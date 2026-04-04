import type { Metadata } from 'next';
import FadeInWrapper from '@/components/FadeInWrapper';
import PomodoroTimer from './PomodoroTimer';

export const metadata: Metadata = {
  title: 'Pomodoro Timer',
  description: 'A minimal focus timer to stay productive.',
};

export default function PomodoroPage() {
  return (
    <FadeInWrapper direction="up">
      <main className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-[var(--heading)] tracking-tight">Pomodoro Timer</h1>
        <p className="text-sm text-[var(--text)] mb-6">Stay focused, take breaks</p>
        <PomodoroTimer />
      </main>
    </FadeInWrapper>
  );
}
