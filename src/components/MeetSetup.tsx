'use client';

import { useState } from 'react';
import { Group } from '@/types';
import { Trophy, Calendar, ChevronLeft, Users } from 'lucide-react';

interface MeetSetupProps {
  group: Group;
  onStart: (group: Group, meetName: string) => void;
  onCancel: () => void;
}

export function MeetSetup({ group, onStart, onCancel }: MeetSetupProps) {
  const [meetName, setMeetName] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const handleStart = () => {
    const name = meetName.trim() || `${group.name} Meet - ${today}`;
    onStart(group, name);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Groups
      </button>

      {/* Group Summary */}
      <div className="card elevation-2 p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Users className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface">{group.name}</h2>
            <p className="text-on-surface-variant">
              {group.skillLevel} • {group.gymnasts.length} gymnasts
            </p>
          </div>
        </div>

        <div className="border-t border-outline/20 pt-4">
          <h3 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3">
            Gymnasts
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.gymnasts.map((gymnast) => (
              <span
                key={gymnast.id}
                className="px-3 py-1.5 bg-surface-variant rounded-full text-sm text-on-surface"
              >
                {gymnast.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Meet Details Form */}
      <div className="card elevation-1 p-5 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6 text-accent" />
          <h2 className="text-lg font-semibold text-on-surface">Meet Details</h2>
        </div>

        <div>
          <label className="text-sm text-on-surface-variant mb-1.5 block flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Meet Name
          </label>
          <input
            type="text"
            value={meetName}
            onChange={(e) => setMeetName(e.target.value)}
            placeholder={`${group.name} Meet - ${today}`}
            className="input-field"
          />
          <p className="text-xs text-on-surface-variant/70 mt-1.5">
            Give your meet a memorable name
          </p>
        </div>

        <div>
          <label className="text-sm text-on-surface-variant mb-1.5 block flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date
          </label>
          <input
            type="date"
            value={today}
            disabled
            className="input-field opacity-70"
          />
        </div>
      </div>

      {/* Scoring Info */}
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
        <h3 className="text-sm font-medium text-accent mb-2">How Scoring Works</h3>
        <ul className="text-xs text-on-surface-variant space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-accent">1.</span>
            Select an event (Bars, Beam, Floor, or Vault)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">2.</span>
            Enter scores for each gymnast in that event
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">3.</span>
            Mark the event complete when all scores are entered
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">4.</span>
            Repeat for all 4 events
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">5.</span>
            View results with team total (top 3 scores combined)
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={handleStart}
          className="w-full py-4 bg-accent text-on-primary rounded-xl font-semibold text-lg
                     hover:bg-accent-light transition-all shadow-lg shadow-accent/20
                     flex items-center justify-center gap-2"
        >
          <Trophy className="w-5 h-5" />
          Start Meet
        </button>
        
        <button
          onClick={onCancel}
          className="w-full py-3 bg-surface-variant text-on-surface rounded-xl font-medium
                     hover:bg-outline/30 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}