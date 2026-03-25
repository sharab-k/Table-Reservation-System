interface StatusBadgeProps {
  status: 'confirmed' | 'seated' | 'arriving' | 'arrived' | 'available' | 'cancelled' | 'no_show' | 'no-show' | 'pending' | 'completed' | 'admin' | 'super_admin' | 'manager' | 'host' | 'viewer'
  label?: string
}

const statusConfig: Record<string, { color: string, bg: string, label: string }> = {
  confirmed: { color: '#00B5CE', bg: 'rgba(0, 181, 206, 0.15)', label: 'Confirmed' },
  seated: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', label: 'Seated' },
  arriving: { color: '#E2B961', bg: 'rgba(226, 185, 97, 0.15)', label: 'Arriving' },
  arrived: { color: '#E2B961', bg: 'rgba(226, 185, 97, 0.15)', label: 'Arrived' },
  pending: { color: '#E2B961', bg: 'rgba(226, 185, 97, 0.15)', label: 'Pending' },
  available: { color: '#F5D90A', bg: 'rgba(245, 217, 10, 0.15)', label: 'Available' },
  cancelled: { color: '#8b949e', bg: 'rgba(139,148,158,0.15)', label: 'Cancelled' },
  no_show: { color: '#8b949e', bg: 'rgba(139,148,158,0.15)', label: 'No Show' },
  'no-show': { color: '#8b949e', bg: 'rgba(139,148,158,0.15)', label: 'No Show' },
  completed: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', label: 'Completed' },
  admin: { color: '#5EEA7A', bg: 'rgba(94, 234, 122, 0.15)', label: 'Admin' },
  super_admin: { color: '#5EEA7A', bg: 'rgba(94, 234, 122, 0.15)', label: 'Super Admin' },
  manager: { color: '#00B5CE', bg: 'rgba(0, 181, 206, 0.15)', label: 'Manager' },
  host: { color: '#F5D90A', bg: 'rgba(245, 217, 10, 0.15)', label: 'Host' },
  viewer: { color: '#8b949e', bg: 'rgba(139, 148, 158, 0.15)', label: 'Viewer' },
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  // Gracefull fallback to avoid crashes if status is unknown or undefined
  const config = (statusConfig as any)[status] || { 
    color: '#8b949e', 
    border: 'none', 
    bg: 'rgba(139, 148, 158, 0.15)', 
    label: (status || 'Unknown').charAt(0).toUpperCase() + (status || 'Unknown').slice(1) 
  }
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px 16px',
      borderRadius: '16px',
      fontSize: '0.75rem',
      fontWeight: 500,
      color: config.color,
      border: config.border,
      backgroundColor: config.bg
    }}>
      {label || config.label}
    </span>
  )
}
