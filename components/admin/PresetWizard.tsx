'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Trash2, Check, Dumbbell } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { MuscleGroupPicker } from '@/components/admin/MuscleGroupPicker';

interface WizardExercise {
  name: string;
  sets: number;
  reps: number;
}

interface WizardDay {
  title: string;
  muscleGroups: string[];
  exercises: WizardExercise[];
}

interface PresetWizardProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const STEP_LABELS = ['Info', 'Workout Days', 'Exercises', 'Review'];

export function PresetWizard({ open, onClose, onCreated }: PresetWizardProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [days, setDays] = useState<WizardDay[]>([]);
  const [newDayTitle, setNewDayTitle] = useState('');
  const [pickerDayIdx, setPickerDayIdx] = useState<number | null>(null);
  const [activeExerciseDayIdx, setActiveExerciseDayIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setStep(0);
    setName('');
    setDays([]);
    setNewDayTitle('');
    setActiveExerciseDayIdx(0);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function addDay() {
    if (!newDayTitle.trim()) return;
    setDays((prev) => [...prev, { title: newDayTitle.trim(), muscleGroups: [], exercises: [] }]);
    setNewDayTitle('');
  }

  function removeDay(idx: number) {
    setDays((prev) => prev.filter((_, i) => i !== idx));
  }

  function addExercise(dayIdx: number) {
    setDays((prev) =>
      prev.map((d, i) => (i === dayIdx ? { ...d, exercises: [...d.exercises, { name: 'New Exercise', sets: 3, reps: 10 }] } : d))
    );
  }

  function updateExercise(dayIdx: number, exIdx: number, patch: Partial<WizardExercise>) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? { ...d, exercises: d.exercises.map((e, j) => (j === exIdx ? { ...e, ...patch } : e)) }
          : d
      )
    );
  }

  function removeExercise(dayIdx: number, exIdx: number) {
    setDays((prev) =>
      prev.map((d, i) => (i === dayIdx ? { ...d, exercises: d.exercises.filter((_, j) => j !== exIdx) } : d))
    );
  }

  async function submit() {
    setSubmitting(true);
    const res = await fetch('/api/admin/presets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, workoutDays: days }),
    });
    setSubmitting(false);
    if (res.ok) {
      onCreated();
      handleClose();
    }
  }

  const canNext =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && days.length > 0) ||
    step === 2 ||
    step === 3;

  const totalExercises = days.reduce((sum, d) => sum + d.exercises.length, 0);
  const trainingFrequency = `${days.length} day${days.length === 1 ? '' : 's'}/week`;

  return (
    <Modal open={open} onClose={handleClose} title="Create Preset">
      {/* Step indicator */}
      <div className="mb-5 flex items-center gap-1.5">
        {STEP_LABELS.map((label, idx) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="h-1 w-full rounded-full transition-colors"
              style={{ background: idx <= step ? 'var(--accent)' : 'var(--border)' }}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: idx <= step ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Info */}
        {step === 0 && (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                Preset Name
              </label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 6-Day Bro Split"
                className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Training frequency is set automatically based on how many workout days you add next.
            </p>
          </motion.div>
        )}

        {/* Step 2: Workout Days */}
        {step === 1 && (
          <motion.div
            key="days"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {days.map((day, idx) => (
              <div
                key={idx}
                className="rounded-xl p-3.5"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{day.title}</p>
                  <button onClick={() => removeDay(idx)}>
                    <Trash2 size={14} style={{ color: '#DC2626' }} />
                  </button>
                </div>
                <button
                  onClick={() => setPickerDayIdx(idx)}
                  className="mt-2 flex flex-wrap gap-1.5"
                >
                  {day.muscleGroups.length === 0 ? (
                    <span
                      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
                      style={{ background: 'var(--card)', color: 'var(--text-muted)' }}
                    >
                      <Dumbbell size={11} /> Set muscle groups
                    </span>
                  ) : (
                    day.muscleGroups.map((m) => (
                      <span
                        key={m}
                        className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                        style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                      >
                        {m}
                      </span>
                    ))
                  )}
                </button>
              </div>
            ))}

            <div className="flex items-center gap-2">
              <input
                value={newDayTitle}
                onChange={(e) => setNewDayTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addDay()}
                placeholder="Day title (e.g. Push Day)"
                className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              />
              <button
                onClick={addDay}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'var(--accent)' }}
              >
                <Plus size={16} color="white" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Exercises */}
        {step === 2 && (
          <motion.div
            key="exercises"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {days.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">Add workout days first.</p>
            ) : (
              <>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {days.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveExerciseDayIdx(idx)}
                      className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium"
                      style={{
                        background: activeExerciseDayIdx === idx ? 'var(--accent)' : 'var(--bg-secondary)',
                        color: activeExerciseDayIdx === idx ? 'white' : 'var(--text-secondary)',
                      }}
                    >
                      {day.title}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {days[activeExerciseDayIdx]?.exercises.map((ex, exIdx) => (
                    <div key={exIdx} className="rounded-xl p-3" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="flex items-center justify-between gap-2">
                        <input
                          value={ex.name}
                          onChange={(e) => updateExercise(activeExerciseDayIdx, exIdx, { name: e.target.value })}
                          className="flex-1 rounded px-2 py-1 text-sm font-medium outline-none"
                          style={{ background: 'var(--card)', color: 'var(--text-primary)' }}
                        />
                        <button onClick={() => removeExercise(activeExerciseDayIdx, exIdx)}>
                          <Trash2 size={14} style={{ color: '#DC2626' }} />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-5">
                        {(['sets', 'reps'] as const).map((field) => (
                          <div key={field} className="flex items-center gap-2">
                            <span className="text-xs capitalize text-[var(--text-secondary)]">{field}</span>
                            <button
                              onClick={() =>
                                updateExercise(activeExerciseDayIdx, exIdx, {
                                  [field]: Math.max(1, ex[field] - 1),
                                })
                              }
                              className="flex h-6 w-6 items-center justify-center rounded"
                              style={{ background: 'var(--card)' }}
                            >
                              −
                            </button>
                            <span className="w-5 text-center text-sm font-semibold tabular-nums">{ex[field]}</span>
                            <button
                              onClick={() =>
                                updateExercise(activeExerciseDayIdx, exIdx, {
                                  [field]: Math.min(99, ex[field] + 1),
                                })
                              }
                              className="flex h-6 w-6 items-center justify-center rounded"
                              style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                            >
                              +
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => addExercise(activeExerciseDayIdx)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-medium"
                    style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                  >
                    <Plus size={13} /> Add Exercise
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-xl p-4" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-lg font-semibold text-[var(--text-primary)]">{name}</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {trainingFrequency} · {totalExercises} exercises total
              </p>
            </div>

            <div className="space-y-2">
              {days.map((day, idx) => (
                <div key={idx} className="rounded-xl p-3" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{day.title}</p>
                  {day.muscleGroups.length > 0 && (
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                      {day.muscleGroups.join(' · ')}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {day.exercises.length} exercise{day.exercises.length === 1 ? '' : 's'}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav buttons */}
      <div className="mt-6 flex items-center gap-2">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1 rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
          >
            <ChevronLeft size={15} /> Back
          </button>
        )}
        {step < 3 ? (
          <button
            disabled={!canNext}
            onClick={() => setStep((s) => s + 1)}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl py-3 text-sm font-semibold disabled:opacity-40"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            Next <ChevronRight size={15} />
          </button>
        ) : (
          <button
            disabled={submitting}
            onClick={submit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold disabled:opacity-60"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            <Check size={15} /> {submitting ? 'Publishing…' : 'Publish Preset'}
          </button>
        )}
      </div>

      {pickerDayIdx !== null && (
        <MuscleGroupPicker
          open={pickerDayIdx !== null}
          onClose={() => setPickerDayIdx(null)}
          selected={days[pickerDayIdx]?.muscleGroups ?? []}
          onChange={(next) =>
            setDays((prev) => prev.map((d, i) => (i === pickerDayIdx ? { ...d, muscleGroups: next } : d)))
          }
        />
      )}
    </Modal>
  );
}