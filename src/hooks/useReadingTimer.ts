import { useState, useEffect, useCallback, useRef } from 'react';
import { READING_MILESTONES } from '../utils/constants';

interface UseReadingTimerOptions {
  onMilestone: (minutes: number, eventId: string) => void;
  onStart?: () => void;
  onStop?: () => void;
}

interface UseReadingTimerReturn {
  isRunning: boolean;
  displayMinutes: number;
  milestonesFired: number[];
  maxMilestone: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useReadingTimer({
  onMilestone,
  onStart,
  onStop,
}: UseReadingTimerOptions): UseReadingTimerReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [milestonesFired, setMilestonesFired] = useState<number[]>([]);

  // Use refs to avoid stale closures in interval
  const milestonesFiredRef = useRef<number[]>([]);
  const onMilestoneRef = useRef(onMilestone);

  // Keep refs updated
  milestonesFiredRef.current = milestonesFired;
  onMilestoneRef.current = onMilestone;

  // 1 real second = 1 simulated minute for demo
  const displayMinutes = elapsedSeconds;
  const maxMilestone = Math.max(...READING_MILESTONES);

  // Timer interval effect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Milestone detection effect - runs when elapsedSeconds changes
  useEffect(() => {
    READING_MILESTONES.forEach((milestone) => {
      if (
        elapsedSeconds === milestone &&
        !milestonesFiredRef.current.includes(milestone)
      ) {
        onMilestoneRef.current(milestone, `reading-${milestone}min`);
        setMilestonesFired((prev) => [...prev, milestone]);
      }
    });
  }, [elapsedSeconds]);

  const start = useCallback(() => {
    setIsRunning(true);
    onStart?.();
  }, [onStart]);

  const pause = useCallback(() => {
    setIsRunning(false);
    onStop?.();
  }, [onStop]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setMilestonesFired([]);
    milestonesFiredRef.current = [];
    onStop?.();
  }, [onStop]);

  return {
    isRunning,
    displayMinutes,
    milestonesFired,
    maxMilestone,
    start,
    pause,
    reset,
  };
}
