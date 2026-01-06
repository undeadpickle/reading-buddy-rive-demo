import type { EventCategory } from '../../types/events';
import {
  EVENT_MAPPINGS,
  QUICK_EVENTS,
  CATEGORY_CONFIG,
} from '../../utils/eventMappings';

interface QuickEventsProps {
  onFireEvent: (eventId: string) => void;
}

const buttonStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: 13,
  borderRadius: 6,
  border: '1px solid',
  background: '#fff',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'transform 0.1s, box-shadow 0.1s',
};

export function QuickEvents({ onFireEvent }: QuickEventsProps) {
  const categories = Object.keys(QUICK_EVENTS) as EventCategory[];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
      }}
    >
      {categories.map((category) => {
        const config = CATEGORY_CONFIG[category];
        const eventIds = QUICK_EVENTS[category as keyof typeof QUICK_EVENTS];

        return (
          <div key={category}>
            <h4
              style={{
                margin: '0 0 8px 0',
                fontSize: 13,
                color: config.borderColor,
                fontWeight: 600,
              }}
            >
              {config.label}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {eventIds.map((eventId) => {
                const event = EVENT_MAPPINGS[eventId];
                if (!event) return null;

                return (
                  <button
                    key={eventId}
                    onClick={() => onFireEvent(eventId)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: config.bgColor,
                      borderColor: config.borderColor,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    title={event.description}
                  >
                    {event.emoji} {event.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
