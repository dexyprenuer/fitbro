'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, Copy, Pencil, Delete, Check } from 'lucide-react';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import { PageTransition } from '@/components/ui/PageTransition';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { HeightUnit, WeightUnit, WorkoutLevel, FitnessGoal } from '@prisma/client';

interface ProfileData {
  username: string;
  email: string | null;
  avatarUrl: string | null;
  heightCm: number | null;
  weightKg: number | null;
  heightUnit: HeightUnit;
  weightUnit: WeightUnit;
  workoutLevel: WorkoutLevel | null;
  fitnessGoal: FitnessGoal | null;
  createdAt: string;
}

const LEVEL_LABELS: Record<WorkoutLevel, string> = {
  NEWBIE: 'Newbie',
  BEGINNER: 'Beginner',
  ELITE: 'Elite',
};

const GOAL_LABELS: Record<FitnessGoal, string> = {
  GAIN_MUSCLE: 'Gain Muscle',
  LOSE_FAT: 'Lose Fat',
  MAINTAIN: 'Maintain',
  STRENGTH: 'Strength',
};

const LEVEL_OPTIONS: { value: WorkoutLevel; label: string }[] = [
  { value: 'NEWBIE', label: 'Newbie' },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'ELITE', label: 'Elite' },
];

const GOAL_OPTIONS: { value: FitnessGoal; label: string }[] = [
  { value: 'GAIN_MUSCLE', label: 'Gain Muscle' },
  { value: 'LOSE_FAT', label: 'Lose Fat' },
  { value: 'MAINTAIN', label: 'Maintain' },
  { value: 'STRENGTH', label: 'Strength' },
];

type EditField = 'height' | 'weight' | 'units' | 'level' | 'goal' | null;

export default function AccountPage() {
  const { signOut } = useClerk();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [editField, setEditField] = useState<EditField>(null);
  const [saving, setSaving] = useState(false);

  // Draft values used while a modal is open
  const [draftHeight, setDraftHeight] = useState('');
  const [draftWeight, setDraftWeight] = useState('');
  const [draftHeightUnit, setDraftHeightUnit] = useState<HeightUnit>('CM');
  const [draftWeightUnit, setDraftWeightUnit] = useState<WeightUnit>('KG');
  const [draftLevel, setDraftLevel] = useState<WorkoutLevel | null>(null);
  const [draftGoal, setDraftGoal] = useState<FitnessGoal | null>(null);

  function fetchProfile() {
    return fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data.profile));
  }

  useEffect(() => {
    fetchProfile().finally(() => setLoading(false));
  }, []);

  function handleCopyUsername() {
    if (!profile) return;
    navigator.clipboard.writeText(profile.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function openEdit(field: EditField) {
    if (!profile) return;
    setDraftHeight(String(profile.heightCm ?? ''));
    setDraftWeight(String(profile.weightKg ?? ''));
    setDraftHeightUnit(profile.heightUnit);
    setDraftWeightUnit(profile.weightUnit);
    setDraftLevel(profile.workoutLevel);
    setDraftGoal(profile.fitnessGoal);
    setEditField(field);
  }

  async function handleSave(patch: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        await fetchProfile();
        setEditField(null);
      }
    } finally {
      setSaving(false);
    }
  }

  function handleNumpadPress(
    field: 'height' | 'weight',
    key: string,
    allowDecimal: boolean
  ) {
    const current = field === 'height' ? draftHeight : draftWeight;
    const setValue = field === 'height' ? setDraftHeight : setDraftWeight;
    const maxDigits = field === 'height' ? 3 : 5;

    if (key === 'backspace') {
      setValue(current.slice(0, -1) || '0');
      return;
    }
    if (key === '.') {
      if (!allowDecimal || current.includes('.')) return;
      setValue(current + '.');
      return;
    }
    const digitsOnly = current.replace('.', '');
    if (digitsOnly.length >= maxDigits) return;
    setValue(current === '0' ? key : current + key);
  }

  const memberSince = profile
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <PageTransition>
      <div
        className="px-4 pt-8 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 7rem))' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/settings"
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
          >
            <ChevronLeft size={18} style={{ color: 'var(--text-primary)' }} />
          </Link>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Account
          </h1>
        </div>

        {loading || !profile ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-[var(--radius-lg)] animate-pulse"
                style={{ background: 'var(--border)' }}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Avatar + username */}
            <div className="flex flex-col items-center mb-6">
              <div
                className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mb-3"
                style={{ background: 'var(--accent-dim)', boxShadow: 'var(--shadow-sm)' }}
              >
                {profile.avatarUrl ? (
                  <Image src={profile.avatarUrl} alt={profile.username} width={80} height={80} />
                ) : (
                  <span className="font-display text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                    {profile.username.slice(5, 6)}
                  </span>
                )}
              </div>
              <button
                onClick={handleCopyUsername}
                className="flex items-center gap-1.5 text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {profile.username}
                <Copy size={13} />
                {copied && <span style={{ color: 'var(--success)' }}>Copied</span>}
              </button>
              {profile.email && (
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {profile.email}
                </p>
              )}
            </div>

            {/* Profile stats */}
            <GlassCard className="mb-4">
              <p className="section-label mb-3">Profile</p>
              <div className="space-y-0.5">
                <StatRow
                  label="Height"
                  value={`${profile.heightCm ?? '—'} cm`}
                  onEdit={() => openEdit('height')}
                />
                <StatRow
                  label="Weight"
                  value={`${profile.weightKg ?? '—'} kg`}
                  onEdit={() => openEdit('weight')}
                />
                <StatRow
                  label="Units"
                  value={`${profile.weightUnit.toLowerCase()}, ${profile.heightUnit === 'CM' ? 'cm' : 'ft'}`}
                  onEdit={() => openEdit('units')}
                />
                <StatRow
                  label="Fitness Level"
                  value={profile.workoutLevel ? LEVEL_LABELS[profile.workoutLevel] : '—'}
                  onEdit={() => openEdit('level')}
                />
                <StatRow
                  label="Fitness Goal"
                  value={profile.fitnessGoal ? GOAL_LABELS[profile.fitnessGoal] : '—'}
                  onEdit={() => openEdit('goal')}
                  last
                />
              </div>
            </GlassCard>

            <GlassCard className="mb-6">
              <StatRow label="Member Since" value={memberSince} last />
            </GlassCard>

            <Button variant="destructive" fullWidth onClick={() => signOut()}>
              Sign Out
            </Button>
          </>
        )}
      </div>

      {/* Height modal */}
      <Modal open={editField === 'height'} onClose={() => setEditField(null)} title="Edit Height">
        <div className="text-center my-6">
          <span className="font-display text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {draftHeight || '0'}
          </span>
          <span className="text-lg ml-1" style={{ color: 'var(--text-secondary)' }}>
            cm
          </span>
        </div>
        <Numpad onPress={(k) => handleNumpadPress('height', k, false)} allowDecimal={false} />
        <div className="pt-6">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            loading={saving}
            disabled={!draftHeight || parseFloat(draftHeight) <= 0}
            onClick={() => handleSave({ heightCm: parseFloat(draftHeight) })}
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* Weight modal */}
      <Modal open={editField === 'weight'} onClose={() => setEditField(null)} title="Edit Weight">
        <div className="text-center my-6">
          <span className="font-display text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {draftWeight || '0'}
          </span>
          <span className="text-lg ml-1" style={{ color: 'var(--text-secondary)' }}>
            kg
          </span>
        </div>
        <Numpad onPress={(k) => handleNumpadPress('weight', k, true)} allowDecimal />
        <div className="pt-6">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            loading={saving}
            disabled={!draftWeight || parseFloat(draftWeight) <= 0}
            onClick={() => handleSave({ weightKg: parseFloat(draftWeight) })}
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* Units modal */}
      <Modal open={editField === 'units'} onClose={() => setEditField(null)} title="Edit Units">
        <div className="space-y-5 my-4">
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Weight Unit
            </p>
            <SegmentedToggle
              options={['KG', 'LBS']}
              value={draftWeightUnit}
              onChange={(v) => setDraftWeightUnit(v as WeightUnit)}
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Height Unit
            </p>
            <SegmentedToggle
              options={['CM', 'FT_IN']}
              labels={{ CM: 'CM', FT_IN: 'FT / IN' }}
              value={draftHeightUnit}
              onChange={(v) => setDraftHeightUnit(v as HeightUnit)}
            />
          </div>
        </div>
        <div className="pt-4">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            loading={saving}
            onClick={() =>
              handleSave({ weightUnit: draftWeightUnit, heightUnit: draftHeightUnit })
            }
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* Fitness level modal */}
      <Modal open={editField === 'level'} onClose={() => setEditField(null)} title="Edit Fitness Level">
        <div className="space-y-3 my-4">
          {LEVEL_OPTIONS.map((opt) => (
            <SelectableRow
              key={opt.value}
              selected={draftLevel === opt.value}
              label={opt.label}
              onClick={() => setDraftLevel(opt.value)}
            />
          ))}
        </div>
        <div className="pt-4">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            loading={saving}
            disabled={!draftLevel}
            onClick={() => handleSave({ workoutLevel: draftLevel })}
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* Fitness goal modal */}
      <Modal open={editField === 'goal'} onClose={() => setEditField(null)} title="Edit Fitness Goal">
        <div className="space-y-3 my-4">
          {GOAL_OPTIONS.map((opt) => (
            <SelectableRow
              key={opt.value}
              selected={draftGoal === opt.value}
              label={opt.label}
              onClick={() => setDraftGoal(opt.value)}
            />
          ))}
        </div>
        <div className="pt-4">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            loading={saving}
            disabled={!draftGoal}
            onClick={() => handleSave({ fitnessGoal: draftGoal })}
          >
            Save
          </Button>
        </div>
      </Modal>
    </PageTransition>
  );
}

function StatRow({
  label,
  value,
  last,
  onEdit,
}: {
  label: string;
  value: string;
  last?: boolean;
  onEdit?: () => void;
}) {
  return (
    <button
      onClick={onEdit}
      disabled={!onEdit}
      className="w-full flex items-center justify-between py-2.5 text-left"
      style={{ borderBottom: last ? 'none' : '1px solid var(--border)' }}
    >
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <span className="flex items-center gap-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {value}
        </span>
        {onEdit && <Pencil size={13} style={{ color: 'var(--text-muted)' }} />}
      </span>
    </button>
  );
}

function SegmentedToggle({
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
    <div className="inline-flex p-1 rounded-full" style={{ background: 'var(--border)' }}>
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

function SelectableRow({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-4 flex items-center justify-between"
      style={{
        background: 'var(--card)',
        border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <span className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
        {label}
      </span>
      {selected && (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'var(--accent)' }}
        >
          <Check size={14} color="#fff" strokeWidth={3} />
        </div>
      )}
    </button>
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
    <div className="grid grid-cols-3 gap-3">
      {keys.map((key, i) => {
        if (key === '') return <div key={`empty-${i}`} />;
        return (
          <motion.button
            key={key}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onPress(key)}
            className="h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {key === 'backspace' ? (
              <Delete size={20} style={{ color: 'var(--text-primary)' }} />
            ) : (
              <span className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {key}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}