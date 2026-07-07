'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Check } from 'lucide-react';
import type { HeightUnit, WeightUnit, WorkoutLevel, FitnessGoal } from '@prisma/client';

const TOTAL_STEPS = 5;

const LEVELS: { value: WorkoutLevel; label: string; sub: string }[] = [
  { value: 'NEWBIE', label: 'Newbie', sub: 'Never worked out in a gym or at home.' },
  { value: 'BEGINNER', label: 'Beginner', sub: 'Working out for 1-2 months. Knows the basics.' },
  { value: 'ELITE', label: 'Elite', sub: 'Working out for a long time, experienced lifter.' },
];

const GOALS: { value: FitnessGoal; label: string }[] = [
  { value: 'GAIN_MUSCLE', label: 'Gain Muscle' },
  { value: 'LOSE_FAT', label: 'Lose Fat' },
  { value: 'MAINTAIN', label: 'Maintain' },
  { value: 'STRENGTH', label: 'Strength' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [weightUnit, setWeightUnit] = useState<WeightUnit>('KG');
  const [weightKg, setWeightKg] = useState(72.5);

  const [heightUnit, setHeightUnit] = useState<HeightUnit>('CM');
  const [heightCm, setHeightCm] = useState(175);

  const [workoutLevel, setWorkoutLevel] = useState<WorkoutLevel | null>(null);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal | null>(null);

  const canContinue =
    step === 1 ? weightKg > 0 :
    step === 2 ? heightCm > 0 :
    step === 3 ? workoutLevel !== null :
    step === 4 ? fitnessGoal !== null :
    true;

  async function handleFinish() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/profile/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weightKg,
          weightUnit,
          heightCm,
          heightUnit,
          workoutLevel,
          fitnessGoal,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Something went wrong. Please try again.');
      }
      router.push('/');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  }

  return (
    <PageTransition>
      <div
        className="px-6 pt-8 max-w-lg mx-auto flex flex-col"
        style={{ minHeight: '100dvh' }}
      >
        {/* Progress */}
        <div className="mb-8">
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Step {Math.min(step, TOTAL_STEPS)} of {TOTAL_STEPS}
          </p>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'var(--border)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--accent)' }}
              animate={{ width: `${(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1"
          >
            {step === 1 && (
              <div>
                <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  What&apos;s your current weight?
                </h1>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Choose your unit
                </p>

                <UnitToggle
                  options={['KG', 'LBS']}
                  value={weightUnit}
                  onChange={(v) => setWeightUnit(v as WeightUnit)}
                />

                <div className="text-center my-8">
                  <span className="font-display text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {weightKg}
                  </span>
                  <span className="text-lg ml-1" style={{ color: 'var(--text-secondary)' }}>
                    {weightUnit.toLowerCase()}
                  </span>
                </div>

                <input
                  type="range"
                  min={30}
                  max={200}
                  step={0.5}
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                  className="w-full"
                  style={{ accentColor: 'var(--accent)' }}
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  What&apos;s your height?
                </h1>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Choose your unit
                </p>

                <UnitToggle
                  options={['CM', 'FT_IN']}
                  labels={{ CM: 'CM', FT_IN: 'FT / IN' }}
                  value={heightUnit}
                  onChange={(v) => setHeightUnit(v as HeightUnit)}
                />

                <div className="text-center my-8">
                  <span className="font-display text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {heightCm}
                  </span>
                  <span className="text-lg ml-1" style={{ color: 'var(--text-secondary)' }}>
                    cm
                  </span>
                </div>

                <input
                  type="range"
                  min={120}
                  max={220}
                  step={1}
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseFloat(e.target.value))}
                  className="w-full"
                  style={{ accentColor: 'var(--accent)' }}
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Select your fitness level
                </h1>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Choose the option that best describes you.
                </p>

                <div className="space-y-3">
                  {LEVELS.map((level) => (
                    <SelectableCard
                      key={level.value}
                      selected={workoutLevel === level.value}
                      onClick={() => setWorkoutLevel(level.value)}
                      title={level.label}
                      sub={level.sub}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  What&apos;s your fitness goal?
                </h1>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Choose your main goal.
                </p>

                <div className="space-y-3">
                  {GOALS.map((goal) => (
                    <SelectableCard
                      key={goal.value}
                      selected={fitnessGoal === goal.value}
                      onClick={() => setFitnessGoal(goal.value)}
                      title={goal.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="text-center pt-8">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'var(--accent-dim)' }}
                >
                  <Check size={40} style={{ color: 'var(--accent)' }} />
                </div>
                <h1 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  All Set, Let&apos;s Go!
                </h1>
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Your account has been created successfully.
                </p>
                <GlassCard className="mt-6 inline-block px-4 py-3">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    You&apos;ll see your username on your account page.
                  </p>
                </GlassCard>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="text-sm text-center mt-4" style={{ color: 'var(--destructive)' }}>
            {error}
          </p>
        )}

        <div className="py-8">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            disabled={!canContinue}
            loading={submitting}
            onClick={handleNext}
          >
            {step === TOTAL_STEPS ? 'Get Started' : 'Continue'}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}

function UnitToggle({
  options,
  labels,
  value,
  onChange,
}: {
  options: string[];
  labels?: Record<string, string>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="inline-flex p-1 rounded-full"
      style={{ background: 'var(--border)' }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className="px-5 py-2 rounded-full text-sm font-semibold transition-colors"
          style={{
            background: value === opt ? 'var(--accent)' : 'transparent',
            color: value === opt ? '#fff' : 'var(--text-secondary)',
          }}
        >
          {labels?.[opt] ?? opt}
        </button>
      ))}
    </div>
  );
}

function SelectableCard({
  selected,
  onClick,
  title,
  sub,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  sub?: string;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left p-4 flex items-center gap-3"
      style={{
        background: 'var(--card)',
        border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: selected ? 'var(--shadow-sm)' : 'none',
      }}
    >
      <div className="flex-1">
        <p className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </p>
        {sub && (
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {sub}
          </p>
        )}
      </div>
      {selected && (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--accent)' }}
        >
          <Check size={14} color="#fff" strokeWidth={3} />
        </div>
      )}
    </motion.button>
  );
}