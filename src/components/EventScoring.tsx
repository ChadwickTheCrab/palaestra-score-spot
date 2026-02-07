'use client';

import { useState, useEffect } from 'react';
import { CurrentMeet, EventType, EVENTS, EVENT_CONFIG, Gymnast } from '@/types';
import { Check, ChevronRight, Trophy, AlertCircle } from 'lucide-react';
import { BarsPictogram, BeamPictogram, FloorPictogram, VaultPictogram } from './icons/Pictograms';

interface EventScoringProps {
  meet: CurrentMeet;
  onSelectEvent: (event: EventType | null) => void;
  onUpdateScore: (event: EventType, gymnastId: string, score: number | null) => void;
  onEventComplete: (event: EventType) => void;
  onViewResults: () => void;
}

export function EventScoring({
  meet,
  onSelectEvent,
  onUpdateScore,
  onEventComplete,
  onViewResults,
}: EventScoringProps) {
  const [activeEvent, setActiveEvent] = useState<EventType | null>(meet.activeEvent);

  useEffect(() => {
    setActiveEvent(meet.activeEvent);
  }, [meet.activeEvent]);

  const handleEventClick = (event: EventType) => {
    if (meet.eventScores[event].completed) return;
    setActiveEvent(event);
    onSelectEvent(event);
  };

  const handleScoreChange = (gymnastId: string, value: string) => {
    if (!activeEvent) return;
    
    if (value === '' || value === '.') {
      onUpdateScore(activeEvent, gymnastId, null);
      return;
    }
    
    const score = parseFloat(value);
    if (!isNaN(score) && score >= 0 && score <= 10) {
      onUpdateScore(activeEvent, gymnastId, Math.round(score * 1000) / 1000);
    }
  };

  const getScoreValue = (gymnastId: string): string => {
    if (!activeEvent) return '';
    const score = meet.eventScores[activeEvent].scores.find(
      s => s.gymnastId === gymnastId
    )?.score;
    return score !== undefined ? score.toString() : '';
  };

  const isEventFullyScored = (event: EventType): boolean => {
    return meet.gymnasts.every(g => 
      meet.eventScores[event].scores.some(s => s.gymnastId === g.id)
    );
  };

  const completedCount = EVENTS.filter(e => meet.eventScores[e].completed).length;
  const allComplete = completedCount === 4;

  return (
    <div className="space-y-6 pb-24">
      {/* Progress Header */}
      <div className="card elevation-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-on-surface">Event Progress</h2>
          <span className="text-sm text-accent font-semibold">
            {completedCount}/4 Complete
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-surface-variant rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${(completedCount / 4) * 100}%` }}
          />
        </div>

        {allComplete && (
          <button
            onClick={onViewResults}
            className="w-full mt-4 py-3 bg-accent text-on-primary rounded-lg font-semibold
                       flex items-center justify-center gap-2 animate-pulse"
          >
            <Trophy className="w-5 h-5" />
            View Results
          </button>
        )}
      </div>

      {/* Event Selection */}
      {!activeEvent && (
        <div className="space-y-3">
          <h3 className="text-sm uppercase tracking-wider text-on-surface-variant">
            Select Event to Score
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {EVENTS.map((event) => {
              const config = EVENT_CONFIG[event];
              const isCompleted = meet.eventScores[event].completed;
              const scoreCount = meet.eventScores[event].scores.length;
              const totalGymnasts = meet.gymnasts.length;
              
              const Pictogram = event === 'bars' ? BarsPictogram :
                                event === 'beam' ? BeamPictogram :
                                event === 'floor' ? FloorPictogram : VaultPictogram;

              return (
                <button
                  key={event}
                  onClick={() => handleEventClick(event)}
                  disabled={isCompleted}
                  className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center
                    ${isCompleted 
                      ? 'border-accent/50 bg-accent/10 cursor-default' 
                      : 'border-outline hover:border-accent hover:bg-accent/5'
                    }`}
                >
                  {isCompleted && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-on-primary" />
                    </div>
                  )}
                  
                  <div className="mb-2">
                    <Pictogram className="w-10 h-10 text-on-surface" />
                  </div>
                  <div className="font-semibold text-on-surface">{config.label}</div>
                  
                  {!isCompleted && (
                    <div className="text-xs text-on-surface-variant mt-1">
                      {scoreCount}/{totalGymnasts} scored
                    </div>
                  )}
                  
                  {isCompleted && (
                    <div className="text-xs text-accent mt-1 font-medium">
                      Complete ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Event Scoring */}
      {activeEvent && (
        <div className="space-y-4 animate-slide-up">
          {/* Event Header */}
          <div className={`p-4 rounded-xl bg-gradient-to-r ${EVENT_CONFIG[activeEvent].bgGradient} border border-outline/30`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeEvent === 'bars' && <BarsPictogram className="w-10 h-10 text-on-surface" />}
                {activeEvent === 'beam' && <BeamPictogram className="w-10 h-10 text-on-surface" />}
                {activeEvent === 'floor' && <FloorPictogram className="w-10 h-10 text-on-surface" />}
                {activeEvent === 'vault' && <VaultPictogram className="w-10 h-10 text-on-surface" />}
                <div>
                  <h3 className="text-xl font-bold text-on-surface">
                    {EVENT_CONFIG[activeEvent].label}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Enter scores for each gymnast
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setActiveEvent(null);
                  onSelectEvent(null);
                }}
                className="text-sm text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-lg
                           hover:bg-surface-variant transition-colors"
              >
                Back
              </button>
            </div>
          </div>

          {/* Gymnast Score Inputs */}
          <div className="space-y-3">
            {meet.gymnasts.map((gymnast, index) => (
              <div
                key={gymnast.id}
                className="card elevation-1 p-4 flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center
                                text-sm font-bold text-on-surface-variant">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-on-surface">{gymnast.name}</p>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.001"
                      min="0"
                      max="10"
                      value={getScoreValue(gymnast.id)}
                      onChange={(e) => handleScoreChange(gymnast.id, e.target.value)}
                      placeholder="0.000"
                      className="w-24 py-2.5 px-3 bg-surface-variant border-2 border-outline rounded-lg
                                 text-center font-mono text-lg font-semibold text-on-surface
                                 focus:border-accent focus:outline-none transition-colors
                                 placeholder:text-on-surface-variant/30"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant/50">
                      /10
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Complete Event Button */}
          <div className="pt-4 space-y-3">
            {isEventFullyScored(activeEvent) ? (
              <button
                onClick={() => {
                  onEventComplete(activeEvent);
                  setActiveEvent(null);
                }}
                className="w-full py-4 bg-accent text-on-primary rounded-xl font-semibold
                           flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                <Check className="w-5 h-5" />
                Mark {EVENT_CONFIG[activeEvent].label} Complete
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex items-center gap-2 p-4 bg-warning/10 border border-warning/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
                <p className="text-sm text-warning">
                  Enter all scores before completing this event
                </p>
              </div>
            )}
            
            <button
              onClick={() => {
                setActiveEvent(null);
                onSelectEvent(null);
              }}
              className="w-full py-3 text-on-surface-variant hover:text-on-surface
                         rounded-xl font-medium transition-colors"
            >
              Save & Continue Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}