import { useState, useCallback } from 'react';
import type { RefObject } from 'react';
import type { BuddyLoaderRef } from '../BuddyLoader';
import type { EventLogEntry } from '../../types/events';
import { EVENT_MAPPINGS, CATEGORY_CONFIG } from '../../utils/eventMappings';
import { INPUTS } from '../../utils/constants';
import { useReadingTimer } from '../../hooks/useReadingTimer';
import { ReadingTimer } from './ReadingTimer';
import { QuickEvents } from './QuickEvents';
import { EventLog } from './EventLog';

interface EventsDemoProps {
  buddyRef: RefObject<BuddyLoaderRef>;
}

const sectionStyle: React.CSSProperties = {
  padding: 16,
  backgroundColor: '#f8f9fa',
  borderRadius: 8,
  border: '1px solid #e0e0e0',
  marginBottom: 16,
};

export function EventsDemo({ buddyRef }: EventsDemoProps) {
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const [isReadingState, setIsReadingState] = useState(false);
  const [excitementLevel, setExcitementLevel] = useState(50);

  const addLogEntry = useCallback((eventId: string) => {
    const event = EVENT_MAPPINGS[eventId];
    if (!event) return;

    const entry: EventLogEntry = {
      id: `${Date.now()}-${eventId}`,
      timestamp: new Date(),
      event,
    };
    setEventLog((prev) => [entry, ...prev].slice(0, 20));
  }, []);

  const fireEvent = useCallback(
    (eventId: string) => {
      const mapping = EVENT_MAPPINGS[eventId];
      if (!mapping || !buddyRef.current) return;

      console.group(`[Buddy Event] ${mapping.emoji} ${mapping.label}`);
      console.log(`Category: ${mapping.category}`);
      console.log(`Action: ${mapping.action.type} -> ${mapping.action.inputName}`);

      const { type, inputName, value } = mapping.action;

      switch (type) {
        case 'trigger':
          if (inputName === 'wave') buddyRef.current.triggerWave();
          else if (inputName === 'jump') buddyRef.current.triggerJump();
          else if (inputName === 'blink') buddyRef.current.triggerBlink();
          console.log(`Fired trigger: ${inputName}`);
          break;

        case 'boolean':
        case 'number':
          buddyRef.current.setInput(inputName, value!);
          console.log(`Set ${type}: ${inputName} = ${value}`);
          console.log(
            '%c(Animation may not change until Rive file is updated with this input)',
            'color: #888'
          );
          break;
      }

      console.groupEnd();
      addLogEntry(eventId);
    },
    [buddyRef, addLogEntry]
  );

  const handleMilestone = useCallback(
    (_minutes: number, eventId: string) => {
      fireEvent(eventId);
    },
    [fireEvent]
  );

  const handleTimerStart = useCallback(() => {
    // Set isReading boolean when timer starts
    if (buddyRef.current) {
      buddyRef.current.setInput(INPUTS.IS_READING, true);
      setIsReadingState(true);
      console.log('[Buddy] isReading = true (timer started)');
    }
  }, [buddyRef]);

  const handleTimerStop = useCallback(() => {
    // Clear isReading boolean when timer stops
    if (buddyRef.current) {
      buddyRef.current.setInput(INPUTS.IS_READING, false);
      setIsReadingState(false);
      console.log('[Buddy] isReading = false (timer stopped)');
    }
  }, [buddyRef]);

  const timer = useReadingTimer({
    onMilestone: handleMilestone,
    onStart: handleTimerStart,
    onStop: handleTimerStop,
  });

  const handleExcitementChange = (value: number) => {
    setExcitementLevel(value);
    if (buddyRef.current) {
      buddyRef.current.setInput(INPUTS.EXCITEMENT_LEVEL, value);
      console.log(`[Buddy] ${INPUTS.EXCITEMENT_LEVEL} = ${value}`);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, marginBottom: 8 }}>Events Demo</h2>
      <p style={{ color: '#666', fontSize: 14, marginTop: 0, marginBottom: 16 }}>
        Simulate in-app events that trigger buddy animations
      </p>

      {/* Reading Timer */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: 15, color: '#333' }}>
          📚 Reading Timer
        </h3>
        <ReadingTimer
          displayMinutes={timer.displayMinutes}
          maxMilestone={timer.maxMilestone}
          milestonesFired={timer.milestonesFired}
          isRunning={timer.isRunning}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.reset}
        />
      </div>

      {/* Quick Events */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: 15, color: '#333' }}>
          ⚡ Quick Events
        </h3>
        <QuickEvents onFireEvent={fireEvent} />
      </div>

      {/* Input Types Demo */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: 15, color: '#333' }}>
          🎛️ Input Types Demo
        </h3>
        <p style={{ fontSize: 12, color: '#888', margin: '0 0 12px 0' }}>
          These inputs are prepared for future Rive updates. Values are sent but
          may not animate yet.
        </p>

        {/* Boolean: isReading */}
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            isReading (boolean):
          </span>
          <span
            style={{
              marginLeft: 8,
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 12,
              backgroundColor: isReadingState
                ? CATEGORY_CONFIG.special.bgColor
                : '#f0f0f0',
              color: isReadingState ? CATEGORY_CONFIG.special.borderColor : '#888',
            }}
          >
            {isReadingState ? 'true' : 'false'}
          </span>
          <span style={{ marginLeft: 8, fontSize: 11, color: '#888' }}>
            (controlled by timer)
          </span>
        </div>

        {/* Number: excitementLevel */}
        <div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            excitementLevel (number):
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 6,
            }}
          >
            <input
              type="range"
              min={0}
              max={100}
              value={excitementLevel}
              onChange={(e) => handleExcitementChange(Number(e.target.value))}
              style={{ flex: 1, maxWidth: 200 }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                minWidth: 30,
                textAlign: 'right',
              }}
            >
              {excitementLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Event Log */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 15, color: '#333' }}>
          📋 Event Log
        </h3>
        <EventLog entries={eventLog} />
      </div>
    </div>
  );
}
