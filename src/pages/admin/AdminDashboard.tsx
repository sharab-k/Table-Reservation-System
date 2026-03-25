import { useState, useEffect } from 'react'
import { Calendar, Users as UsersIcon, LayoutGrid, UserCheck } from 'lucide-react'
import { api } from '../../services/api'
import Navbar from '../../components/Navbar'
import StatsCard from '../../components/StatsCard'
import ReservationTab from './tabs/ReservationTab'
import TablesManagementTab from './tabs/TablesManagementTab'
import StaffManagementTab from './tabs/StaffManagementTab'
import FloorMapTab from './tabs/FloorMapTab'

const tabs = [
  { id: 'reservation', label: 'Reservation' },
  { id: 'tables', label: 'Tables Management' },
  { id: 'staff', label: 'Staff Management' },
  { id: 'floormap', label: 'Floor Map' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('reservation')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [stats, setStats] = useState({
    todayBookings: 0,
    seatedNow: 0,
    totalTables: 0,
    totalStaff: 0
  })
  const isDark = theme === 'dark'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const orgId = 'default-org-id'
        const { data } = await api.get(`/organizations/${orgId}/stats`)
        if (data.stats) {
          setStats({
            todayBookings: data.stats.todayBookings || 0,
            seatedNow: data.stats.seatedNow || 0,
            totalTables: data.stats.totalTables || 0,
            totalStaff: data.stats.totalStaff || 0
          })
        }
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }
    fetchStats()
  }, [])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: isDark ? '#0B1517' : '#ffffff',
      fontFamily: 'var(--font-sans)',
      transition: 'background-color 0.3s ease'
    }}>
      <Navbar variant="admin" theme={theme} onToggleTheme={toggleTheme} />

      <div className="res-admin-container" style={{ padding: '32px 48px' }}>
        {/* Stats Cards */}
        <div className="res-admin-stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px', // Spacious gap
          marginBottom: '32px'
        }}>
          <StatsCard
            label="Today's Bookings"
            value={stats.todayBookings}
            icon={<Calendar size={18} />}
            variant={theme}
          />
          <StatsCard
            label="Seated Now"
            value={stats.seatedNow}
            icon={<UsersIcon size={18} />}
            variant={theme}
          />
          <StatsCard
            label="Tables"
            value={stats.totalTables}
            icon={<LayoutGrid size={18} />}
            variant={theme}
          />
          <StatsCard
            label="Total Staff"
            value={stats.totalStaff}
            icon={<UserCheck size={18} />}
            variant={theme}
          />
        </div>

        {/* Tab Navigation */}
        <div style={{
          width: '100%',
        }}>
          <div className="res-admin-tabs" style={{
            display: 'flex',
            gap: '32px', // wide gap between tabs
            borderBottom: `1px solid ${isDark ? '#30363d' : '#e5e7eb'}`,
            marginBottom: '24px' // Add space below tabs
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '16px 0',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  position: 'relative',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  color: activeTab === tab.id
                    ? (isDark ? '#5EEA7A' : '#10b981')
                    : (isDark ? '#8b949e' : '#6b7280'),
                  transition: 'color 0.2s'
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: isDark ? '#5EEA7A' : '#10b981'
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            {activeTab === 'reservation' && <ReservationTab theme={theme} />}
            {activeTab === 'tables' && <TablesManagementTab theme={theme} />}
            {activeTab === 'staff' && <StaffManagementTab theme={theme} />}
            {activeTab === 'floormap' && <FloorMapTab theme={theme} />}
          </div>
        </div>
      </div>
    </div>
  )
}
