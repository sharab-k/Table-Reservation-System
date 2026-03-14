import { Users, MapPin } from 'lucide-react'

interface TableCardProps {
  name: string
  capacity: number
  location: string
  icon?: React.ReactNode
  isSelected?: boolean
  badge?: 'Premium' | 'VIP' | 'Exclusive'
  status?: 'available' | 'reserved' | 'occupied'
  onClick?: () => void
}

export default function TableCard({
  name,
  capacity,
  location,
  isSelected = false,
  badge,
  onClick,
}: TableCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '20px',
        borderRadius: '12px',
        border: isSelected ? '1px solid #5E8B6A' : '1px solid #e5e7eb',
        backgroundColor: isSelected ? 'rgba(94, 139, 106, 0.1)' : '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'block',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}
      onMouseOver={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = '#d1d5db';
      }}
      onMouseOut={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '9999px',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: '#6b7280' }}>
            <rect x="3" y="4" width="18" height="12" rx="1" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="9" y1="4" x2="9" y2="16" />
            <line x1="15" y1="4" x2="15" y2="16" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem', fontFamily: 'var(--font-sans)', margin: 0 }}>
              {name}
            </h3>
            {badge && (
              <span style={{
                fontSize: '10px',
                fontWeight: 500,
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: badge === 'Premium' ? 'rgba(234, 179, 8, 0.2)' : badge === 'VIP' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                color: badge === 'Premium' ? '#eab308' : badge === 'VIP' ? '#4ade80' : '#c084fc',
                fontFamily: 'var(--font-sans)'
              }}>
                {badge}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '0.75rem', color: '#6b7280', fontFamily: 'var(--font-sans)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={13} />
              Capacity: {capacity} seats
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} />
              {location}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
