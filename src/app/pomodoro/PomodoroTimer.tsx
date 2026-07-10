'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSlider } from '@/hooks/useSlider';
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

// One shared context — browsers cap concurrent AudioContexts, so creating a
// new one per beep eventually silences the completion sound.
let audioCtx: AudioContext | null = null;

function playBeep() {
  try {
    audioCtx ??= new AudioContext();
    const ctx = audioCtx;
    if (ctx.state === 'suspended') void ctx.resume();
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
  const endTimeRef = useRef<number>(0);
  const modeSlider = useSlider(mode);

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

    // Count down against a wall-clock end time — a 1s interval decrementing
    // state drifts and stalls entirely when the tab is backgrounded.
    endTimeRef.current = Date.now() + secondsLeft * 1000;

    const tick = () => {
      const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      if (remaining > 0) {
        setSecondsLeft(remaining);
        return;
      }

      playBeep();
      if (mode === 'work') {
        const newSessions = sessions + 1;
        setSessions(newSessions);
        const nextMode = newSessions % 4 === 0 ? 'long' : 'short';
        setMode(nextMode);
        setSecondsLeft(durations[nextMode] * 60);
      } else {
        setMode('work');
        setSecondsLeft(durations.work * 60);
      }
      setRunning(false);
    };

    intervalRef.current = setInterval(tick, 250);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // secondsLeft is intentionally omitted: it's read once to set the end
    // time when the timer starts; re-running on every tick would reset it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode, sessions, durations]);

  // Surface the countdown in the tab title so it's visible from other tabs
  useEffect(() => {
    const original = document.title;
    return () => {
      document.title = original;
    };
  }, []);

  useEffect(() => {
    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const ss = String(secondsLeft % 60).padStart(2, '0');
    document.title = `${mm}:${ss} · ${MODE_LABELS[mode]} · Pomodoro`;
  }, [secondsLeft, mode]);

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
      <div
        className="segmented segmented--accent w-full"
        ref={modeSlider}
      >
        <div className="segmented-thumb" />
        {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
          <button
            key={m}
            data-active={mode === m}
            aria-pressed={mode === m}
            className="segmented-item"
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

      <div className="flex gap-3">
        <button className="btn btn-primary px-8" onClick={() => setRunning(!running)}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button className="btn btn-ghost px-8" onClick={reset}>
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
        <button
          className="mx-auto text-xs text-[var(--color-graphite)] transition-colors duration-200 hover:text-[var(--color-paper)]"
          onClick={() => setShowSettings(!showSettings)}
        >
          {showSettings ? 'Hide Settings' : 'Customize Durations'}
        </button>
        <div className="disclosure" data-open={showSettings}>
          <div className={`disclosure-inner ${styles.settingsPanelInner}`}>
            {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
              <div key={m} className={styles.settingRow}>
                <span>{MODE_LABELS[m]}</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    className={styles.settingInput}
                    value={durations[m]}
                    onChange={(e) => updateDuration(m, e.target.value)}
                    min={1}
                    max={99}
                    aria-label={`${MODE_LABELS[m]} duration in minutes`}
                  />
                  <span className="text-xs text-[var(--color-graphite)]">min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
