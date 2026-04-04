'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './pomodoro.module.css';

type Mode = 'work' | 'short' | 'long';

const DEFAULT_DURATIONS: Record<Mode, number> = {
  work: 25,
  short: 5,
  long: 15,
};

const MODE_LABELS: Record<Mode, string> = {
  work: 'Work',
  short: 'Short Break',
  long: 'Long Break',
};

const RING_RADIUS = 120;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.value = 0.3;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio not available
  }
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>('work');
  const [durations, setDurations] = useState(DEFAULT_DURATIONS);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_DURATIONS.work * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = durations[mode] * 60;
  const progress = 1 - secondsLeft / totalSeconds;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const switchMode = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      setSecondsLeft(durations[newMode] * 60);
      setRunning(false);
    },
    [durations]
  );

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playBeep();
          if (mode === 'work') {
            const newSessions = sessions + 1;
            setSessions(newSessions);
            const nextMode = newSessions % 4 === 0 ? 'long' : 'short';
            setMode(nextMode);
            setRunning(false);
            return durations[nextMode] * 60;
          } else {
            setMode('work');
            setRunning(false);
            return durations.work * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode, sessions, durations]);

  const reset = () => {
    setRunning(false);
    setSecondsLeft(durations[mode] * 60);
  };

  const updateDuration = (m: Mode, val: string) => {
    const num = Math.max(1, Math.min(99, parseInt(val) || 1));
    setDurations((prev) => ({ ...prev, [m]: num }));
    if (m === mode && !running) {
      setSecondsLeft(num * 60);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.modes}>
        {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
          <button
            key={m}
            className={`${styles.modeBtn} ${mode === m ? styles.modeBtnActive : ''}`}
            onClick={() => switchMode(m)}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <div className={styles.timerWrap} role="timer" aria-label={`${MODE_LABELS[mode]}: ${minutes} minutes and ${seconds} seconds remaining`}>
        <svg className={styles.ring} viewBox="0 0 260 260" aria-hidden="true">
          <circle className={styles.ringTrack} cx="130" cy="130" r={RING_RADIUS} />
          <circle
            className={styles.ringProgress}
            cx="130"
            cy="130"
            r={RING_RADIUS}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <span className={styles.time} aria-live="off">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>

      <div className={styles.controls}>
        <button className={`${styles.controlBtn} ${styles.startBtn}`} onClick={() => setRunning(!running)}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button className={`${styles.controlBtn} ${styles.resetBtn}`} onClick={reset}>
          Reset
        </button>
      </div>

      <div className={styles.sessions} aria-label={`${sessions} sessions completed, ${sessions % 4} of 4 in current cycle`}>
        <span>Sessions</span>
        <div className={styles.dots} aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`${styles.dot} ${i < sessions % 4 ? styles.dotFilled : ''}`} />
          ))}
        </div>
        <span>{sessions}</span>
      </div>

      <div className={styles.settings}>
        <button className={styles.settingsToggle} onClick={() => setShowSettings(!showSettings)}>
          {showSettings ? 'Hide Settings' : 'Customize Durations'}
        </button>
        {showSettings && (
          <>
            {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
              <div key={m} className={styles.settingRow}>
                <span>{MODE_LABELS[m]}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <input
                    type="number"
                    className={styles.settingInput}
                    value={durations[m]}
                    onChange={(e) => updateDuration(m, e.target.value)}
                    min={1}
                    max={99}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text)' }}>min</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
