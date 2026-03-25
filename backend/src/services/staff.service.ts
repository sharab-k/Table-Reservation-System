import { supabaseAdmin } from '../config/database';
import { AppError, NotFoundError } from '../middleware/errorHandler';
import { InviteStaffDto, UpdateStaffDto } from '../types/api.types';
import { UserRole } from '../types/enums';
import { generateToken, generateRefreshToken } from '../middleware/auth';

export class StaffService {
  /**
   * List all staff for a restaurant.
   */
  async list(restaurantId: string, roleFilter?: string) {
    let query = supabaseAdmin
      .from('staff_members')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (roleFilter && roleFilter !== 'all') {
      query = query.eq('role', roleFilter);
    }

    const { data, error } = await query;

    if (error) throw new AppError('Failed to fetch staff', 500);
    return (data || []).map(this.formatStaff);
  }

  /**
   * Get a single staff member.
   */
  async getById(staffId: string, restaurantId: string) {
    const { data, error } = await supabaseAdmin
      .from('staff_members')
      .select('*')
      .eq('id', staffId)
      .eq('restaurant_id', restaurantId)
      .single();

    if (error || !data) throw new NotFoundError('Staff member');
    return this.formatStaff(data);
  }

  /**
   * Invite a new staff member.
   */
  async invite(restaurantId: string, dto: InviteStaffDto) {
    const { data: existing } = await supabaseAdmin
      .from('staff_members')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .eq('email', dto.email)
      .single();

    if (existing) {
      throw new AppError('Staff member with this email already exists in this restaurant', 409);
    }

    // 1. Create the local tracking record initially to acquire its UUID
    const { data, error } = await supabaseAdmin
      .from('staff_members')
      .insert({
        restaurant_id: restaurantId,
        name: dto.name || dto.email.split('@')[0],
        email: dto.email,
        role: dto.role,
        invited_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !data) throw new AppError('Failed to invite staff member locally', 500);

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const inviteToken = data.id;
    const redirectTo = `${FRONTEND_URL}/accept-invite?token=${inviteToken}`;

    // 2. Check if user already exists in Supabase Auth
    const { data: authUserLookup } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuthUser = authUserLookup?.users.find(u => u.email?.toLowerCase() === dto.email.toLowerCase());

    let authUserId: string;

    let inviteLink = '';

    if (existingAuthUser) {
      authUserId = existingAuthUser.id;
      console.log(`[StaffService DEBUG] User ${dto.email} already exists (ID: ${authUserId}, Confirmed: ${!!existingAuthUser.email_confirmed_at}).`);
      
      // We still attempt to generate a link for them
      const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: dto.email,
        options: { redirectTo }
      });
      
      if (linkData?.properties?.action_link) {
        inviteLink = linkData.properties.action_link;
        console.log(`[StaffService DEBUG] Generated Magic Link for existing user: ${inviteLink}`);
      }
      
      // Also attempt standard invite as a backup (sends email if possible)
      await supabaseAdmin.auth.admin.inviteUserByEmail(dto.email, { redirectTo });
    } else {
      // 3. New user - generate link AND send invite
      console.log(`[StaffService DEBUG] Inviting NEW user: ${dto.email}`);
      
      const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
        type: 'invite',
        email: dto.email,
        options: { redirectTo }
      });

      if (linkData?.properties?.action_link) {
        inviteLink = linkData.properties.action_link;
        console.log(`[StaffService DEBUG] Generated Invite Link: ${inviteLink}`);
      }

      // Also call the official invite (this triggers the email)
      const { data: authData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(dto.email, {
        redirectTo
      });

      if (inviteError || !authData.user) {
        console.error(`[StaffService DEBUG] Supabase Invite Failed:`, inviteError);
        // We only throw if we also failed to generate a link
        if (!inviteLink) {
          await supabaseAdmin.from('staff_members').delete().eq('id', data.id);
          throw new AppError(`Supabase Invite Failed: ${inviteError?.message || 'Check Supabase Auth logs.'}`, 500);
        }
        authUserId = linkData?.user?.id || '';
      } else {
        authUserId = authData.user.id;
      }
      
      if (authUserId) {
        await supabaseAdmin.auth.admin.updateUserById(authUserId, {
          user_metadata: { role: dto.role, name: dto.name || dto.email.split('@')[0] }
        });
      }
    }

    // 4. Form the bridge
    const { error: updateError } = await supabaseAdmin
      .from('staff_members')
      .update({ user_id: authUserId })
      .eq('id', data.id);

    const formatted = this.formatStaff(data);
    return {
      ...formatted,
      inviteLink // Return the generated link to the frontend as a fallback
    };
  }

  /**
   * Accept a staff invitation — finalizes the bridged account.
   */
  async acceptInvite(staffRecordId: string, password: string, name: string) {
    // 1. Get pending staff record
    const { data: staffRecord, error: staffErr } = await supabaseAdmin
      .from('staff_members')
      .select('*, organizations(id, name, slug, setup_completed)')
      .eq('id', staffRecordId)
      .is('accepted_at', null)
      .single();

    if (staffErr || !staffRecord) {
      throw new NotFoundError('Invitation not found or already accepted');
    }

    const roleMap: Record<string, UserRole> = {
      admin: UserRole.RESTAURANT_ADMIN,
      manager: UserRole.MANAGER,
      host: UserRole.HOST,
      viewer: UserRole.VIEWER,
    };

    const userRole = roleMap[staffRecord.role] || UserRole.VIEWER;

    let authUser;

    // 2. Either process the Phase 5 Auth profile or fallback to creating local legacy profiles
    if (staffRecord.user_id) {
       // Profile already fired externally via inviteUserByEmail. We strictly push the chosen password
       const { data: updatedUser, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(staffRecord.user_id, {
         password,
         user_metadata: { name, role: userRole }
       });
       
       if (updateErr || !updatedUser.user) {
         throw new AppError(updateErr?.message || 'Failed to update user password', 500);
       }
       authUser = updatedUser.user;
    } else {
       // Legacy Phase 1/2 Stub logic: Create brand new from scratch!
       const { data: newAuthData, error: authError } = await supabaseAdmin.auth.admin.createUser({
         email: staffRecord.email,
         password,
         email_confirm: true,
         user_metadata: { name, role: userRole },
       });
       
       if (authError || !newAuthData.user) {
         throw new AppError(authError?.message || 'Failed to create account', 500);
       }
       authUser = newAuthData.user;
    }

    // 3. Link finalized auth user to local tracker
    const { error: finalizeErr } = await supabaseAdmin
      .from('staff_members')
      .update({
        user_id: authUser.id,
        name,
        accepted_at: new Date().toISOString(),
      })
      .eq('id', staffRecordId);

    if (finalizeErr) {
      throw new AppError('Failed to accept invitation and link records properly', 500);
    }

    // 4. Generate Local JWT
    const org = staffRecord.organizations;
    const token = generateToken({
      sub: authUser.id,
      email: staffRecord.email,
      role: userRole,
      restaurantId: org.id,
    });

    const refreshToken = generateRefreshToken(authUser.id);

    return {
      user: {
        id: authUser.id,
        email: staffRecord.email,
        role: userRole,
        name,
      },
      token,
      refreshToken,
      restaurant: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        setupCompleted: org.setup_completed,
      },
    };
  }

  /**
   * Update staff member.
   */
  async update(staffId: string, restaurantId: string, dto: UpdateStaffDto) {
    const updateData: Record<string, any> = {};

    if (dto.role !== undefined) updateData.role = dto.role;
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.isActive !== undefined) updateData.is_active = dto.isActive;

    const { data, error } = await supabaseAdmin
      .from('staff_members')
      .update(updateData)
      .eq('id', staffId)
      .eq('restaurant_id', restaurantId)
      .select()
      .single();

    if (error || !data) throw new NotFoundError('Staff member');
    return this.formatStaff(data);
  }

  /**
   * Remove (deactivate) staff member.
   */
  async remove(staffId: string, restaurantId: string) {
    const { data: staff } = await supabaseAdmin
      .from('staff_members')
      .select('role')
      .eq('id', staffId)
      .eq('restaurant_id', restaurantId)
      .single();

    if (!staff) throw new NotFoundError('Staff member');

    const { error } = await supabaseAdmin
      .from('staff_members')
      .update({ is_active: false })
      .eq('id', staffId)
      .eq('restaurant_id', restaurantId);

    if (error) throw new AppError('Failed to remove staff member', 500);
    return { success: true };
  }

  /**
   * Search staff by name, email, or phone.
   */
  async search(restaurantId: string, query: string) {
    const { data, error } = await supabaseAdmin
      .from('staff_members')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`);

    if (error) throw new AppError('Failed to search staff', 500);
    return (data || []).map(this.formatStaff);
  }

  // ─── Formatter ────────────────────────────────────────

  private formatStaff(row: any) {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: row.role,
      isActive: row.is_active,
      invitedAt: row.invited_at,
      acceptedAt: row.accepted_at,
      lastActiveAt: row.last_active_at,
      createdAt: row.created_at,
    };
  }
}

export const staffService = new StaffService();
