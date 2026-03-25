require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function debugLogin() {
  const email = "fresh_1774439405986@example.com";
  const password = "Password123";

  console.log("1. Authenticating...");
  const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    console.log("Auth Error!", authError);
    return;
  }
  
  const userId = authData.user.id;
  console.log("2. Auth Success. User ID:", userId);

  const { data: staffMember, error: staffError } = await supabaseAdmin
    .from('staff_members')
    .select('*, organizations(*)')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  console.log("3. Staff Member Query Error:", staffError);
  console.log("4. Staff Member Data:", !!staffMember, staffMember?.id);
}

debugLogin();
