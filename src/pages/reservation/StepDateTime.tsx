import { useState } from 'react'
import { Calendar, AlertCircle } from 'lucide-react'
import TimeSlotPicker from '../../components/TimeSlotPicker'
import GuestCounter from '../../components/GuestCounter'
import WaitingListModal from '../../components/WaitingListModal'
import type { ReservationData } from './ReservationWizard'

interface StepDateTimeProps {
  data: ReservationData
  updateData: (updates: Partial<ReservationData>) => void
}

const TIME_SLOTS = [
  '17:00', '17:30', '18:00', '18:30', '19:00',
  '19:30', '20:00', '20:30', '21:00', '21:30',
]

export default function StepDateTime({ data, updateData }: StepDateTimeProps) {
  const [showWaitingList, setShowWaitingList] = useState(false)
  const fullyBooked = false // Toggle to show fully booked state
  const conflictSlots = ['20:30'] // Simulating a booked slot

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '24px', fontFamily: 'var(--font-sans)', marginTop: 0 }}>
        When would you like to dine?
      </h2>

      {fullyBooked && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626' }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>All time slots are fully booked.</span>
          </div>
          <button
            onClick={() => setShowWaitingList(true)}
            className="btn-gold"
            style={{ padding: '8px 16px', fontSize: '0.875rem' }}
          >
            Join Waiting List
          </button>
        </div>
      )}

      {/* Date */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>
          Date
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={data.date}
            onChange={(e) => updateData({ date: e.target.value })}
            style={{ 
              padding: '12px 16px', 
              paddingRight: '40px', 
              width: '100%', 
              boxSizing: 'border-box',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              color: '#111827',
              fontSize: '1rem',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <Calendar size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
        </div>
      </div>

      {/* Time Slots */}
      <div style={{ marginBottom: '32px' }}>
        <TimeSlotPicker
          slots={TIME_SLOTS}
          selectedSlot={data.time}
          onSelect={(slot) => updateData({ time: slot })}
          disabledSlots={conflictSlots}
          fullyBooked={fullyBooked}
        />
      </div>

      {/* Guest Counter */}
      <GuestCounter
        count={data.guests}
        onChange={(count) => updateData({ guests: count })}
      />

      <WaitingListModal
        isOpen={showWaitingList}
        onClose={() => setShowWaitingList(false)}
      />
    </div>
  )
}
