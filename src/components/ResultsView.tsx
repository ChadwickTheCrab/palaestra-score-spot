'use client';

import { MeetResults, GymnastResult, EVENT_CONFIG, EventType, EVENTS } from '@/types';
import { Trophy, Medal, Share2, ChevronLeft, Camera } from 'lucide-react';
import { BarsPictogram, BeamPictogram, FloorPictogram, VaultPictogram } from './icons/Pictograms';

interface ResultsViewProps {
  results: MeetResults;
  meetName: string;
  groupName: string;
  onShare: () => void;
  onFinish: () => void;
  onBack: () => void;
}

export function ResultsView({
  results,
  meetName,
  groupName,
  onShare,
  onFinish,
  onBack,
}: ResultsViewProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="text-lg font-bold text-on-surface-variant">#{rank}</span>;
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-on-surface-variant/50';
    if (score >= 9.5) return 'text-accent font-bold';
    if (score >= 9.0) return 'text-accent/80';
    return 'text-on-surface';
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Scoring
      </button>

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
          <Trophy className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-1">{meetName}</h1>
        <p className="text-on-surface-variant">{groupName}</p>
      </div>

      {/* Team Total Card */}
      <div className="card elevation-2 p-6 bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30">
        <div className="text-center">
          <p className="text-sm uppercase tracking-wider text-on-surface-variant mb-2">
            Team Total
          </p>
          <div className="text-5xl font-bold text-accent sequin mb-2">
            {results.teamTotal.toFixed(3)}
          </div>
          <p className="text-xs text-on-surface-variant">
            Top 3 individual scores combined
          </p>
        </div>

        {/* Top 3 All-Arounders */}
        {results.topThree.length > 0 && (
          <div className="mt-6 pt-6 border-t border-accent/20">
            <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-3 text-center">
              Top All-Arounders
            </p>
            <div className="space-y-2">
              {results.topThree.map((gymnast, idx) => (
                <div
                  key={gymnast.gymnast.id}
                  className="flex items-center justify-between p-3 bg-surface/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(idx + 1)}
                    <span className="font-medium text-on-surface">
                      {gymnast.gymnast.name}
                    </span>
                  </div>
                  <span className="font-bold text-accent">
                    {gymnast.totalScore.toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Individual Results */}
      <div className="space-y-3">
        <h3 className="text-sm uppercase tracking-wider text-on-surface-variant font-medium">
          Individual Rankings
        </h3>
        
        {results.gymnasts.map((result) => (
          <div
            key={result.gymnast.id}
            className={`card p-4 ${
              result.rank <= 3 ? 'border border-accent/30' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                ${result.rank <= 3 ? 'bg-accent/20' : 'bg-surface-variant'}`}>
                  {getRankIcon(result.rank)}
                </div>
                <div>
                  <p className="font-semibold text-on-surface">{result.gymnast.name}</p>
                  <p className="text-xs text-on-surface-variant">All-Around Score</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${
                  result.rank <= 3 ? 'text-accent' : 'text-on-surface'
                }`}>
                  {result.totalScore.toFixed(3)}
                </p>
              </div>
            </div>

            {/* Event Breakdown */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-outline/20">
              {EVENTS.map((event) => {
                const score = result.eventScores[event];
                const Pictogram = event === 'bars' ? BarsPictogram :
                                  event === 'beam' ? BeamPictogram :
                                  event === 'floor' ? FloorPictogram : VaultPictogram;
                return (
                  <div key={event} className="text-center">
                    <div className="mb-1 flex justify-center">
                      <Pictogram className="w-6 h-6 text-on-surface" />
                    </div>
                    <p className={`text-sm font-medium ${getScoreColor(score)}`}>
                      {score !== null ? score.toFixed(3) : '-'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={onShare}
          className="w-full py-4 bg-accent text-on-primary rounded-xl font-semibold
                     flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
        >
          <Camera className="w-5 h-5" />
          Create Share Image
        </button>
        
        <button
          onClick={onFinish}
          className="w-full py-3 bg-surface-variant text-on-surface rounded-xl font-medium
                     hover:bg-outline/30 transition-colors"
        >
          Finish & Start New Meet
        </button>
      </div>
    </div>
  );
}