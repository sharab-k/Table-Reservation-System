import { useState, useEffect } from 'react'
import { Plus, Edit } from 'lucide-react'
import { api } from '../../../services/api'
import StatusBadge from '../../../components/StatusBadge'

interface TablesManagementTabProps {
  theme: 'dark' | 'light'
}

export default function TablesManagementTab({ theme }: TablesManagementTabProps) {
  const isDark = theme === 'dark'
  const [tablesList, setTablesList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true)
        const orgId = 'default-org-id'
        const { data } = await api.get(`/organizations/${orgId}/tables`)
        if (data.data) {
          setTablesList(data.data)
        }
      } catch (err) {
        console.error('Failed to fetch tables:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTables()
  }, [])

  return (
    <div>
      <div className="res-admin-tab-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, color: isDark ? '#ffffff' : '#1f2937' }}>
          All Tables
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
          <Plus size={16} />
          Add Table
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${isDark ? '#30363d' : '#e5e7eb'}` }}>
              {['Table', 'Area', 'Capacity', 'Type', 'Shape', 'Status', ''].map((h) => (
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
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '16px', color: isDark ? '#8b949e' : '#6b7280' }}>Loading tables...</td></tr>
            )}
            {!loading && tablesList.map((table) => (
              <tr
                key={table.id}
                style={{
                  borderBottom: `1px solid ${isDark ? '#30363d' : '#e5e7eb'}`,
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? '#161B22' : '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '16px', fontWeight: 600, color: isDark ? '#ffffff' : '#1f2937' }}>
                  {table.name || `#${table.table_number}`}
                </td>
                <td style={{ padding: '16px', color: isDark ? '#8b949e' : '#6b7280' }}>
                  {table.floor_area?.name || table.area || 'Main Dining'}
                </td>
                <td style={{ padding: '16px', color: isDark ? '#8b949e' : '#6b7280' }}>
                  {table.capacity}
                </td>
                <td style={{ padding: '16px', color: isDark ? '#8b949e' : '#6b7280' }}>
                  {table.table_type || 'Standard'}
                </td>
                <td style={{ padding: '16px', color: isDark ? '#8b949e' : '#6b7280' }}>
                  {table.shape || 'Rectangle'}
                </td>
                <td style={{ padding: '16px' }}>
                  <StatusBadge status={table.status || 'available'} />
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: isDark ? '#8b949e' : '#6b7280',
                    cursor: 'pointer',
                    padding: '4px'
                  }}>
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && tablesList.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '16px', color: isDark ? '#8b949e' : '#6b7280' }}>No tables found. Add one or upload a floor plan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
