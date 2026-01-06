import { READING_MILESTONES } from '../../utils/constants';

interface ReadingTimerProps {
  displayMinutes: number;
  maxMilestone: number;
  milestonesFired: number[];
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const buttonStyle: React.CSSProperties = {
  padding: '6px 14px',
  fontSize: 13,
  borderRadius: 4,
  border: '1px solid #ccc',
  background: '#fff',
  cursor: 'pointer',
};

export function ReadingTimer({
  displayMinutes,
  maxMilestone,
  milestonesFired,
  isRunning,
  onStart,
  onPause,
  onReset,
}: ReadingTimerProps) {
  const percentage = Math.min((displayMinutes / maxMilestone) * 100, 100);

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500 }}>
          Reading Time: {displayMinutes} min
        </span>
        <span style={{ fontSize: 12, color: '#888' }}>
          {displayMinutes}/{maxMilestone} min
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        {/* Track */}
        <div
          style={{
            height: 10,
            backgroundColor: '#e0e0e0',
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          {/* Fill */}
          <div
            style={{
              height: '100%',
              width: `${percentage}%`,
              backgroundColor: '#4caf50',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Milestone markers */}
        {READING_MILESTONES.map((milestone) => {
          const isFired = milestonesFired.includes(milestone);
          const position = (milestone / maxMilestone) * 100;
          return (
            <div
              key={milestone}
              style={{
                position: 'absolute',
                left: `${position}%`,
                top: -2,
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: isFired ? '#4caf50' : '#bbb',
                  border: '2px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  color: '#fff',
                }}
              >
                {isFired ? '✓' : ''}
              </div>
              <span style={{ fontSize: 10, color: '#666', marginTop: 2 }}>
                {milestone}m
              </span>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {!isRunning ? (
            <button style={buttonStyle} onClick={onStart}>
              ▶️ Start
            </button>
          ) : (
            <button style={buttonStyle} onClick={onPause}>
              ⏸️ Pause
            </button>
          )}
          <button style={buttonStyle} onClick={onReset}>
            🔄 Reset
          </button>
        </div>
        <span style={{ fontSize: 11, color: '#888' }}>
          1 sec = 1 min (accelerated)
        </span>
      </div>
    </div>
  );
}
