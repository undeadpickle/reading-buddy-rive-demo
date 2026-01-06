import type { EventLogEntry } from '../../types/events';

interface EventLogProps {
  entries: EventLogEntry[];
}

export function EventLog({ entries }: EventLogProps) {
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatAction = (entry: EventLogEntry): string => {
    const { type, inputName, value } = entry.event.action;
    if (type === 'trigger') {
      return `trigger: ${inputName}`;
    }
    return `${type}: ${inputName} = ${value}`;
  };

  if (entries.length === 0) {
    return (
      <div
        style={{
          padding: 16,
          color: '#888',
          fontSize: 14,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        No events fired yet. Try the timer or quick events above!
      </div>
    );
  }

  return (
    <div
      style={{
        maxHeight: 150,
        overflowY: 'auto',
        fontSize: 13,
        fontFamily: 'monospace',
      }}
    >
      {entries.map((entry) => (
        <div
          key={entry.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '70px 1fr auto',
            gap: 12,
            padding: '6px 8px',
            borderBottom: '1px solid #eee',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#888' }}>{formatTime(entry.timestamp)}</span>
          <span>
            {entry.event.emoji} {entry.event.label}
          </span>
          <span style={{ color: '#666', fontSize: 12 }}>
            {formatAction(entry)}
          </span>
        </div>
      ))}
    </div>
  );
}
