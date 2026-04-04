import type { Metadata } from 'next';
import FadeInWrapper from '@/components/FadeInWrapper';
import PomodoroTimer from './PomodoroTimer';

export const metadata: Metadata = {
  title: 'Pomodoro Timer',
  description:
    'A clean Pomodoro timer with customizable work and break durations, session tracking, and audio notifications. Boost productivity with the Pomodoro Technique.',
  alternates: { canonical: 'https://abdeen.dev/pomodoro' },
  openGraph: {
    title: 'Pomodoro Timer | abdeen.dev',
    description:
      'Stay productive with customizable focus sessions and breaks. Track your sessions with a clean, minimal timer.',
    url: 'https://abdeen.dev/pomodoro',
  },
};

export default function PomodoroPage() {
  return (
    <FadeInWrapper direction="up">
      <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-[var(--heading)] tracking-tight">Pomodoro Timer</h1>
        <p className="text-sm text-[var(--text)] mb-6">Stay focused, take breaks</p>
        <PomodoroTimer />
      </div>
    </FadeInWrapper>
  );
}
