import { Minus, Plus, User } from 'lucide-react'

interface GuestCounterProps {
  count: number
  onChange: (count: number) => void
  presets?: number[]
}

export default function GuestCounter({ count, onChange, presets = [2, 4, 6, 8] }: GuestCounterProps) {
  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '16px', fontFamily: 'var(--font-sans)' }}>
        How many people will be dining?
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
        <User size={48} style={{ color: '#9ca3af', opacity: 0.7 }} strokeWidth={1.5} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', margin: '16px 0' }}>
          <button
            onClick={() => onChange(Math.max(1, count - 1))}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '9999px',
              backgroundColor: '#5E8B6A',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <Minus size={24} />
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
            <span style={{
              color: '#111827',
              fontSize: '3rem',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              lineHeight: 1
            }}>
              {count}
            </span>
            <span style={{ color: '#111827', fontSize: '1.125rem' }}>Guests</span>
          </div>

          <button
            onClick={() => onChange(Math.min(20, count + 1))}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '9999px',
              backgroundColor: '#5E8B6A',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <Plus size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          {presets.map((preset) => {
             const isSelected = count === preset;
             return (
              <button
                key={preset}
                onClick={() => onChange(preset)}
                style={{
                  width: '80px',
                  padding: '10px 0',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  border: isSelected ? '1px solid #5E8B6A' : '1px solid #d1d5db',
                  backgroundColor: isSelected ? '#5E8B6A' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#111827',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                {preset}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
