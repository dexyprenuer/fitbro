'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, Plus, Trash2, Minus, Pencil, Dumbbell } from 'lucide-react';
import { MuscleGroupPicker } from '@/components/admin/MuscleGroupPicker';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  instructions: string | null;
  order: number;
}

interface WorkoutDay {
  id: string;
  title: string;
  emoji: string;
  order: number;
  muscleGroups: string[];
  exercises: Exercise[];
}

interface Preset {
  id: string;
  name: string;
  schedule: (string | null)[];
  workoutDays: WorkoutDay[];
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdminPresetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [preset, setPreset] = useState<Preset | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDayId, setOpenDayId] = useState<string | null>(null);
  const [newDayTitle, setNewDayTitle] = useState('');
  const [addingDay, setAddingDay] = useState(false);
  const [nameEditing, setNameEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [pickerDayId, setPickerDayId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/presets/${id}`);
    if (res.status === 404) {
      router.push('/admin/presets');
      return;
    }
    const data = await res.json();
    setPreset(data.preset);
    setNameDraft(data.preset?.name ?? '');
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveName() {
    if (!nameDraft.trim() || nameDraft === preset?.name) {
      setNameEditing(false);
      return;
    }
    const res = await fetch(`/api/admin/presets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameDraft.trim() }),
    });
    if (res.ok) {
      const { preset: updated } = await res.json();
      setPreset((prev) => (prev ? { ...prev, name: updated.name } : prev));
    }
    setNameEditing(false);
  }

  async function addDay() {
    if (!newDayTitle.trim()) return;
    const res = await fetch(`/api/admin/presets/${id}/days`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newDayTitle.trim() }),
    });
    if (res.ok) {
      setNewDayTitle('');
      setAddingDay(false);
      await load();
    }
  }

  async function deleteDay(dayId: string, title: string) {
    if (!confirm(`Delete "${title}" and all its exercises?`)) return;
    const res = await fetch(`/api/admin/days/${dayId}`, { method: 'DELETE' });
    if (res.ok) await load();
  }

  async function toggleScheduleDay(dayId: string, weekdayIdx: number) {
    if (!preset) return;
    const nextSchedule = [...preset.schedule];
    nextSchedule[weekdayIdx] = nextSchedule[weekdayIdx] === dayId ? null : dayId;
    setPreset({ ...preset, schedule: nextSchedule });
    await fetch(`/api/admin/presets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedule: nextSchedule }),
    });
  }

  async function addExercise(dayId: string) {
    const res = await fetch(`/api/admin/days/${dayId}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New Exercise', sets: 3, reps: 10 }),
    });
    if (res.ok) await load();
  }

  async function updateExercise(exerciseId: string, patch: Partial<Exercise>) {
    setPreset((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        workoutDays: prev.workoutDays.map((d) => ({
          ...d,
          exercises: d.exercises.map((e) => (e.id === exerciseId ? { ...e, ...patch } : e)),
        })),
      };
    });
    await fetch(`/api/admin/exercises/${exerciseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  }

  async function deleteExercise(exerciseId: string) {
    const res = await fetch(`/api/admin/exercises/${exerciseId}`, { method: 'DELETE' });
    if (res.ok) await load();
  }

  async function updateMuscleGroups(dayId: string, muscleGroups: string[]) {
    setPreset((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        workoutDays: prev.workoutDays.map((d) => (d.id === dayId ? { ...d, muscleGroups } : d)),
      };
    });
    await fetch(`/api/admin/days/${dayId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ muscleGroups }),
    });
  }

  if (loading || !preset) {
    return <p className="text-[var(--text-secondary)]">Loading…</p>;
  }

  const activeDay = preset.workoutDays.find((d) => d.id === pickerDayId);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <button
        onClick={() => router.push('/admin/presets')}
        className="flex items-center gap-1 text-sm text-[var(--text-secondary)]"
      >
        <ChevronLeft size={16} /> Back to Presets
      </button>

      <div className="flex items-center gap-2">
        {nameEditing ? (
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === 'Enter' && saveName()}
            className="rounded-lg px-2 py-1 text-2xl font-semibold outline-none"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
          />
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{preset.name}</h1>
            <button onClick={() => setNameEditing(true)}>
              <Pencil size={15} style={{ color: 'var(--text-muted)' }} />
            </button>
          </>
        )}
      </div>

      {/* Weekly schedule grid */}
      <div
        className="rounded-[var(--radius-lg)] p-4"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <p className="mb-3 text-sm font-medium text-[var(--text-secondary)]">Weekly Schedule</p>
        <div className="grid grid-cols-7 gap-2">
          {WEEKDAYS.map((label, idx) => (
            <div key={label} className="text-center">
              <p className="mb-1 text-xs text-[var(--text-muted)]">{label}</p>
              <select
                value={preset.schedule[idx] ?? ''}
                onChange={(e) => toggleScheduleDay(e.target.value || preset.schedule[idx] || '', idx)}
                className="w-full rounded-lg py-1.5 text-xs outline-none"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                <option value="">Rest</option>
                {preset.workoutDays.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Workout days */}
      <div className="space-y-3">
        {preset.workoutDays.map((day) => {
          const isOpen = openDayId === day.id;
          return (
            <div
              key={day.id}
              className="rounded-[var(--radius-lg)] p-4"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setOpenDayId(isOpen ? null : day.id)}
                  className="flex flex-1 items-center gap-1.5"
                >
                  <p className="font-semibold text-[var(--text-primary)]">{day.title}</p>
                  <span className="text-xs text-[var(--text-secondary)]">({day.exercises.length})</span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                  </motion.div>
                </button>
                <button
                  onClick={() => deleteDay(day.id, day.title)}
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: '#DC2626' }}
                >
                  <Trash2 size={13} /> Delete Day
                </button>
              </div>

              {/* Muscle group chips — tap anywhere in this row to edit */}
              <button
                onClick={() => setPickerDayId(day.id)}
                className="mt-1.5 flex w-full flex-wrap items-center gap-1.5 text-left"
              >
                <Dumbbell size={11} style={{ color: 'var(--text-muted)' }} />
                {day.muscleGroups.length === 0 ? (
                  <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                    Tap to set muscle groups
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

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                      {day.exercises.map((ex) => (
                        <div
                          key={ex.id}
                          className="rounded-lg p-3"
                          style={{ background: 'var(--bg-secondary)' }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <input
                              value={ex.name}
                              onChange={(e) => updateExercise(ex.id, { name: e.target.value })}
                              className="flex-1 rounded px-2 py-1 text-sm font-medium outline-none"
                              style={{ background: 'var(--card)', color: 'var(--text-primary)' }}
                            />
                            <button onClick={() => deleteExercise(ex.id)}>
                              <Trash2 size={14} style={{ color: '#DC2626' }} />
                            </button>
                          </div>
                          <div className="mt-2 flex items-center gap-5">
                            {(['sets', 'reps'] as const).map((field) => (
                              <div key={field} className="flex items-center gap-2">
                                <span className="text-xs capitalize text-[var(--text-secondary)]">{field}</span>
                                <button
                                  onClick={() =>
                                    updateExercise(ex.id, { [field]: Math.max(1, ex[field] - 1) })
                                  }
                                  className="flex h-6 w-6 items-center justify-center rounded"
                                  style={{ background: 'var(--card)' }}
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-5 text-center text-sm font-semibold tabular-nums">
                                  {ex[field]}
                                </span>
                                <button
                                  onClick={() =>
                                    updateExercise(ex.id, { [field]: Math.min(99, ex[field] + 1) })
                                  }
                                  className="flex h-6 w-6 items-center justify-center rounded"
                                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addExercise(day.id)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium"
                        style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                      >
                        <Plus size={13} /> Add Exercise
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Add workout day */}
      {addingDay ? (
        <div
          className="flex items-center gap-2 rounded-[var(--radius-lg)] p-4"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <input
            autoFocus
            value={newDayTitle}
            onChange={(e) => setNewDayTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addDay()}
            placeholder="Day title (e.g. Push Day)"
            className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
            style={{ background: 'var(--bg-secondary)' }}
          />
          <button
            onClick={addDay}
            className="rounded-lg px-3 py-2 text-sm font-medium"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAddingDay(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-lg)] py-3 text-sm font-medium"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--accent)' }}
        >
          <Plus size={15} /> Add Workout Day
        </button>
      )}

      {activeDay && (
        <MuscleGroupPicker
          open={pickerDayId !== null}
          onClose={() => setPickerDayId(null)}
          selected={activeDay.muscleGroups}
          onChange={(next) => updateMuscleGroups(activeDay.id, next)}
        />
      )}
    </motion.div>
  );
}