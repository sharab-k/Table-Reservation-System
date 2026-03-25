import { useState, useEffect } from 'react'
import { Search, MoreVertical, Plus, X } from 'lucide-react'
import { api } from '../../../services/api'
import StatusBadge from '../../../components/StatusBadge'

interface StaffManagementTabProps {
  theme: 'dark' | 'light'
}

const staff = [
  { id: 1, name: 'Sarah Chen', email: 'sarahchen@example.com', lastActive: '2 min ago', status: 'manager' as const },
  { id: 2, name: 'James Wilson', email: 'jameswilson@example.com', lastActive: '5 min ago', status: 'manager' as const },
  { id: 3, name: 'Maria Garcia', email: 'mariagarcia@example.com', lastActive: '3 min ago', status: 'host' as const },
  { id: 4, name: 'Robert Kim', email: 'robertkim@example.com', lastActive: '10 min ago', status: 'manager' as const },
  { id: 5, name: 'Emily Davis', email: 'emilydavis@example.com', lastActive: '15 min ago', status: 'host' as const },
  { id: 6, name: 'Tom Miller', email: 'tommiller@example.com', lastActive: '2 min ago', status: 'viewer' as const },
  { id: 7, name: 'Tom Miller', email: 'tommiller@example.com', lastActive: '2 min ago', status: 'viewer' as const },
]

export default function StaffManagementTab({ theme }: StaffManagementTabProps) {
  const isDark = theme === 'dark'
  const [staffList, setStaffList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // Invite Modal State
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('host')
  const [inviteLoading, setInviteLoading] = useState(false)

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const orgId = 'default-org-id'
      const { data } = await api.get(`/organizations/${orgId}/staff`)
      if (data.staff) {
        setStaffList(data.staff)
      } else {
        setStaffList(staff) // Fallback to dummy data if not implemented fully
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err)
      setStaffList(staff)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleInvite = async () => {
    if (!inviteEmail) return
    try {
      setInviteLoading(true)
      const orgId = 'default-org-id'
      await api.post(`/organizations/${orgId}/staff/invite`, {
        email: inviteEmail,
        role: inviteRole
      })
      alert('Staff invited successfully!')
      setShowInvite(false)
      setInviteEmail('')
      fetchStaff()
    } catch (err) {
      console.error('Failed to invite staff:', err)
      alert('Failed to invite staff.')
    } finally {
      setInviteLoading(false)
    }
  }

  return (
    <div>
      {/* Top Control Bar */}
      <div className="res-admin-tab-header res-staff-controls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
        <div style={{ position: 'relative', width: '400px', maxWidth: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: isDark ? '#8b949e' : '#6b7280' }} />
          <input
            type="text"
            placeholder="Search name, phone, email or skills"
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              backgroundColor: isDark ? '#161B22' : '#ffffff',
              border: `1px solid ${isDark ? '#30363d' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: isDark ? '#ffffff' : '#1f2937',
              fontSize: '0.875rem'
            }}
          />
        </div>
        <select style={{
          padding: '10px 16px',
          backgroundColor: isDark ? '#161B22' : '#ffffff',
          border: `1px solid ${isDark ? '#30363d' : '#e5e7eb'}`,
          borderRadius: '8px',
          color: isDark ? '#ffffff' : '#1f2937',
          fontSize: '0.875rem',
          cursor: 'pointer',
          appearance: 'none', // to allow custom styling if needed, though simple select is fine for MVP
          minWidth: '150px'
        }}>
          <option>All Roles</option>
          <option>Manager</option>
          <option>Host</option>
          <option>Viewer</option>
        </select>
        <button 
          onClick={() => setShowInvite(true)}
          style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          backgroundColor: '#C99C63',
          color: '#ffffff',
          fontWeight: 600,
          borderRadius: '8px',
          border: 'none',
          fontSize: '0.875rem',
          cursor: 'pointer'
        }}>
          <Plus size={16} />
          Invite Staff
        </button>
      </div>

      {/* Table Container */}
      <div style={{
        borderRadius: '12px',
        border: `1px solid ${isDark ? '#30363d' : '#e5e7eb'}`,
        backgroundColor: 'transparent',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                borderBottom: `1px solid ${isDark ? '#30363d' : '#e5e7eb'}`,
                backgroundColor: isDark ? '#101A1C' : '#f9fafb'
              }}>
                {['Name', 'Email', 'Last Active', 'Status', ''].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left',
                    padding: '16px 24px',
                    fontWeight: 500,
                    color: isDark ? '#ffffff' : '#4b5563' // Bright header text as per design
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffList.map((member: any) => (
                <tr
                  key={member.id}
                  style={{
                    borderBottom: `1px solid ${isDark ? '#30363d' : '#e5e7eb'}`,
                    transition: 'background-color 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? '#161B22' : '#f9fafb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '16px 24px', color: isDark ? '#e6edf3' : '#1f2937' }}>
                    {member.user?.name || member.name || member.email?.split('@')[0]}
                  </td>
                  <td style={{ padding: '16px 24px', color: isDark ? '#e6edf3' : '#4b5563' }}>
                    {member.email}
                  </td>
                  <td style={{ padding: '16px 24px', color: isDark ? '#e6edf3' : '#4b5563' }}>
                    {member.lastActive || 'Never'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <StatusBadge status={member.role || member.status || 'viewer'} />
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: isDark ? '#8b949e' : '#6b7280',
                      cursor: 'pointer',
                      padding: '4px'
                    }}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: isDark ? '#101A1C' : '#ffffff',
            border: `1px solid ${isDark ? '#30363d' : '#e5e7eb'}`,
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: isDark ? '#ffffff' : '#111827' }}>Invite Staff</h3>
              <button 
                onClick={() => setShowInvite(false)}
                style={{ background: 'none', border: 'none', color: isDark ? '#8b949e' : '#6b7280', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: isDark ? '#d1d5db' : '#374151', marginBottom: '8px' }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="employee@restaurant.com"
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: `1px solid ${isDark ? '#30363d' : '#d1d5db'}`,
                    borderRadius: '8px',
                    color: isDark ? '#ffffff' : '#111827',
                    boxSizing: 'border-box'
                  }} 
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: isDark ? '#d1d5db' : '#374151', marginBottom: '8px' }}>
                  Role
                </label>
                <select 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: isDark ? '#161B22' : '#ffffff',
                    border: `1px solid ${isDark ? '#30363d' : '#d1d5db'}`,
                    borderRadius: '8px',
                    color: isDark ? '#ffffff' : '#111827',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="manager">Manager</option>
                  <option value="host">Host</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleInvite}
              disabled={inviteLoading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: inviteLoading ? '#9ca3af' : '#C99C63',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: inviteLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {inviteLoading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
