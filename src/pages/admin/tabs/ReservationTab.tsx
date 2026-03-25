import { useState, useEffect } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { api } from '../../../services/api'
import StatusBadge from '../../../components/StatusBadge'

interface ReservationTabProps {
  theme: 'dark' | 'light'
}

export default function ReservationTab({ theme }: ReservationTabProps) {
  const isDark = theme === 'dark'
  const [resList, setResList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const orgId = 'default-org-id'
      const { data } = await api.get(`/reservations?orgId=${orgId}`)
      if (data.data) {
        setResList(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch reservations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  return (
    <div>
      <div className="res-admin-tab-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, color: isDark ? '#ffffff' : '#1f2937' }}>
          Today's Reservations
        </h3>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.875rem',
          fontWeight: 600,
          padding: '8px 16px',
          backgroundColor: '#C99C63',
          color: '#101A1C',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${isDark ? '#30363d' : '#e5e7eb'}` }}>
              {['Guest', 'Table', 'Time', 'Party Size', 'Status'].map((h) => (
                <th key={h} style={{
                  textAlign: 'left',
                  padding: '16px', // spacious header padding
                  fontWeight: 500,
                  color: isDark ? '#8b949e' : '#6b7280'
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '16px', color: isDark ? '#8b949e' : '#6b7280' }}>Loading reservations...</td></tr>
            )}
            {!loading && resList.map((res) => (
              <tr
                key={res.id}
                style={{
                  borderBottom: `1px solid ${isDark ? '#30363d' : '#e5e7eb'}`,
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? '#161B22' : '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '16px', fontWeight: 600, color: isDark ? '#ffffff' : '#1f2937' }}>
                  {res.customer?.firstName} {res.customer?.lastName}
                </td>
                <td style={{ padding: '16px', color: isDark ? '#8b949e' : '#6b7280' }}>
                  {res.table?.name || 'Unassigned'}
                </td>
                <td style={{ padding: '16px', color: isDark ? '#8b949e' : '#6b7280' }}>
                  {new Date(res.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td style={{ padding: '16px', color: isDark ? '#8b949e' : '#6b7280' }}>
                  {res.partySize}
                </td>
                <td style={{ padding: '16px' }}>
                  <StatusBadge status={res.status || 'pending'} />
                </td>
              </tr>
            ))}
            {!loading && resList.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '16px', color: isDark ? '#8b949e' : '#6b7280' }}>No reservations found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
