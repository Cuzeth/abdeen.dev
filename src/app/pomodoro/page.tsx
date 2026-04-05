import type { Metadata } from 'next';
import ToolPageShell from '@/components/ToolPageShell';
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
    <ToolPageShell
      title="Pomodoro Timer"
      description="A stripped-back focus timer with customizable sessions, calm pacing, and just enough feedback to keep momentum."
    >
      <PomodoroTimer />
    </ToolPageShell>
  );
}
