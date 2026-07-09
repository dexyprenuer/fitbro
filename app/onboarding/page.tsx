'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Check, Delete } from 'lucide-react';
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

// Max digits allowed for each numpad context (prevents absurd values like 99999)
const WEIGHT_MAX_DIGITS = 5; // e.g. "199.5"
const HEIGHT_MAX_DIGITS = 3; // e.g. "220"

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [weightUnit, setWeightUnit] = useState<WeightUnit>('KG');
  const [weightInput, setWeightInput] = useState('72.5');

  const [heightUnit, setHeightUnit] = useState<HeightUnit>('CM');
  const [heightInput, setHeightInput] = useState('175');

  const [workoutLevel, setWorkoutLevel] = useState<WorkoutLevel | null>(null);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal | null>(null);

  const weightKg = parseFloat(weightInput) || 0;
  const heightCm = parseFloat(heightInput) || 0;

  const canContinue =
    step === 1 ? weightKg > 0 :
    step === 2 ? heightCm > 0 :
    step === 3 ? workoutLevel !== null :
    step === 4 ? fitnessGoal !== null :
    true;

  function handleNumpadPress(field: 'weight' | 'height', key: string) {
    const current = field === 'weight' ? weightInput : heightInput;
    const setValue = field === 'weight' ? setWeightInput : setHeightInput;
    const maxDigits = field === 'weight' ? WEIGHT_MAX_DIGITS : HEIGHT_MAX_DIGITS;

    if (key === 'backspace') {
      setValue(current.slice(0, -1) || '0');
      return;
    }

    if (key === '.') {
      // Only weight supports decimals; only one decimal point allowed
      if (field !== 'weight' || current.includes('.')) return;
      setValue(current + '.');
      return;
    }

    // Digit press
    const digitsOnly = current.replace('.', '');
    if (digitsOnly.length >= maxDigits) return;

    // Replace leading "0" unless typing a decimal like "0.5"
    if (current === '0') {
      setValue(key);
    } else {
      setValue(current + key);
    }
  }

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
                    {weightInput}
                  </span>
                  <span className="text-lg ml-1" style={{ color: 'var(--text-secondary)' }}>
                    {weightUnit.toLowerCase()}
                  </span>
                </div>

                <Numpad
                  onPress={(key) => handleNumpadPress('weight', key)}
                  allowDecimal
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
                    {heightInput}
                  </span>
                  <span className="text-lg ml-1" style={{ color: 'var(--text-secondary)' }}>
                    cm
                  </span>
                </div>

                <Numpad
                  onPress={(key) => handleNumpadPress('height', key)}
                  allowDecimal={false}
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

function Numpad({
  onPress,
  allowDecimal,
}: {
  onPress: (key: string) => void;
  allowDecimal: boolean;
}) {
  const keys = allowDecimal
    ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace']
    : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];

  return (
    <div className="grid grid-cols-3 gap-3 mt-2">
      {keys.map((key, i) => {
        if (key === '') {
          return <div key={`empty-${i}`} />;
        }

        return (
          <motion.button
            key={key}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onPress(key)}
            className="h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {key === 'backspace' ? (
              <Delete size={22} style={{ color: 'var(--text-primary)' }} />
            ) : (
              <span
                className="font-display text-2xl font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {key}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}