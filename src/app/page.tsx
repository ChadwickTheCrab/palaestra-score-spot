'use client';

import { useState } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { EVENT_CONFIG, EventType, EVENTS, Group } from '@/types';
import { GroupManager } from '@/components/GroupManager';
import { MeetSetup } from '@/components/MeetSetup';
import { EventScoring } from '@/components/EventScoring';
import { ResultsView } from '@/components/ResultsView';
import { ShareImage } from '@/components/ShareImage';

type View = 'groups' | 'setup' | 'scoring' | 'results' | 'share';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('groups');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  
  const {
    isLoaded,
    groups,
    createGroup,
    updateGroup,
    deleteGroup,
    addGymnastToGroup,
    removeGymnastFromGroup,
    currentMeet,
    startNewMeet,
    setActiveEvent,
    updateEventScore,
    markEventComplete,
    completeMeet,
    cancelCurrentMeet,
    currentResults,
    clearAllData,
  } = useAppData();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🦁</div>
          <p className="text-on-surface-variant">Loading Palaestra...</p>
        </div>
      </div>
    );
  }

  const handleStartMeet = (group: Group, meetName: string) => {
    const meet = startNewMeet(meetName, group.id);
    if (meet) {
      setSelectedGroup(group);
      setCurrentView('scoring');
    }
  };

  const handleEventComplete = (event: EventType) => {
    markEventComplete(event);
    
    // Check if all events are complete
    if (currentMeet) {
      const allComplete = EVENTS.every(e => 
        e === event ? true : currentMeet.eventScores[e].completed
      );
      
      if (allComplete) {
        setTimeout(() => setCurrentView('results'), 500);
      }
    }
  };

  const handleFinishMeet = () => {
    completeMeet();
    setCurrentView('groups');
    setSelectedGroup(null);
  };

  const handleCancelMeet = () => {
    cancelCurrentMeet();
    setCurrentView('groups');
    setSelectedGroup(null);
  };

  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-surface-variant border-b border-outline/20 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-light rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🦁</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-on-surface sequin">
                  Palaestra
                </h1>
                <p className="text-xs text-on-surface-variant">Score Spot</p>
              </div>
            </div>
            
            {currentMeet && (
              <button
                onClick={handleCancelMeet}
                className="text-sm text-error px-3 py-1.5 rounded-lg hover:bg-error/10 transition-colors"
              >
                Cancel Meet
              </button>
            )}
          </div>
          
          {currentMeet && (
            <div className="mt-3 p-3 bg-primary-20/50 rounded-lg">
              <p className="text-sm font-medium text-on-surface">{currentMeet.name}</p>
              <p className="text-xs text-on-surface-variant">
                {selectedGroup?.name} • {selectedGroup?.skillLevel}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* GROUPS VIEW */}
        {currentView === 'groups' && (
          <GroupManager
            groups={groups}
            onCreateGroup={createGroup}
            onDeleteGroup={deleteGroup}
            onAddGymnast={addGymnastToGroup}
            onRemoveGymnast={removeGymnastFromGroup}
            onStartMeet={(group) => setCurrentView('setup')}
            onSelectGroup={setSelectedGroup}
          />
        )}

        {/* SETUP VIEW */}
        {currentView === 'setup' && selectedGroup && (
          <MeetSetup
            group={selectedGroup}
            onStart={handleStartMeet}
            onCancel={() => setCurrentView('groups')}
          />
        )}

        {/* SCORING VIEW */}
        {currentView === 'scoring' && currentMeet && selectedGroup && (
          <EventScoring
            meet={currentMeet}
            eventOrder={selectedGroup.eventOrder}
            onSelectEvent={setActiveEvent}
            onUpdateScore={updateEventScore}
            onEventComplete={handleEventComplete}
            onViewResults={() => setCurrentView('results')}
            onReorderEvents={(newOrder) => {
              updateGroup(selectedGroup.id, { eventOrder: newOrder });
            }}
          />
        )}

        {/* RESULTS VIEW */}
        {currentView === 'results' && currentResults && currentMeet && (
          <ResultsView
            results={currentResults}
            meetName={currentMeet.name}
            groupName={selectedGroup?.name || ''}
            onShare={() => setCurrentView('share')}
            onFinish={handleFinishMeet}
            onBack={() => setCurrentView('scoring')}
          />
        )}

        {/* SHARE VIEW */}
        {currentView === 'share' && currentResults && currentMeet && (
          <ShareImage
            meetName={currentMeet.name}
            date={currentMeet.date}
            groupName={selectedGroup?.name || ''}
            skillLevel={selectedGroup?.skillLevel || 'Bronze'}
            results={currentResults}
            onBack={() => setCurrentView('results')}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-surface-variant border-t border-outline/20 py-3">
        <div className="max-w-lg mx-auto px-4 text-center space-y-1">
          <p className="text-xs text-on-surface-variant">
            🦁 Palaestra Lionesses • {new Date().getFullYear()}
          </p>
          <div className="flex items-center justify-center gap-3">
            {groups.length > 0 && (
              <button
                onClick={clearAllData}
                className="text-xs text-error/70 hover:text-error"
              >
                Clear All Data
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Hard reset: Clear all app data and reload?')) {
                  localStorage.removeItem('palaestra-app-data-v2');
                  window.location.reload();
                }
              }}
              className="text-xs text-warning/70 hover:text-warning"
            >
              Hard Reset
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}