'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  AppData, 
  Group, 
  Gymnast, 
  CurrentMeet, 
  EventType, 
  EVENTS,
  MeetScore,
  MeetResults,
  GymnastResult,
  calculateGymnastTotal,
  calculateTeamTotal,
  CompletedMeet 
} from '@/types';

const STORAGE_KEY = 'palaestra-app-data-v2';

const DEFAULT_DATA: AppData = {
  groups: [],
  currentMeet: null,
  meetHistory: [],
};

export function useAppData() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData({ ...DEFAULT_DATA, ...parsed });
      } catch (e) {
        console.error('Failed to parse app data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  // GROUP MANAGEMENT
  const createGroup = useCallback((name: string, skillLevel: string, gymnastNames: string[]): Group => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: name.trim(),
      skillLevel: skillLevel as any,
      gymnasts: gymnastNames
        .filter(n => n.trim())
        .map((name, index) => ({
          id: `gym-${Date.now()}-${index}`,
          name: name.trim(),
        })),
      createdAt: Date.now(),
    };

    setData(prev => ({
      ...prev,
      groups: [...prev.groups, newGroup],
    }));

    return newGroup;
  }, []);

  const updateGroup = useCallback((groupId: string, updates: Partial<Group>) => {
    setData(prev => ({
      ...prev,
      groups: prev.groups.map(g => 
        g.id === groupId ? { ...g, ...updates } : g
      ),
    }));
  }, []);

  const deleteGroup = useCallback((groupId: string) => {
    setData(prev => ({
      ...prev,
      groups: prev.groups.filter(g => g.id !== groupId),
    }));
  }, []);

  const addGymnastToGroup = useCallback((groupId: string, name: string) => {
    const newGymnast: Gymnast = {
      id: `gym-${Date.now()}`,
      name: name.trim(),
    };

    setData(prev => ({
      ...prev,
      groups: prev.groups.map(g => 
        g.id === groupId 
          ? { ...g, gymnasts: [...g.gymnasts, newGymnast] }
          : g
      ),
    }));

    return newGymnast;
  }, []);

  const removeGymnastFromGroup = useCallback((groupId: string, gymnastId: string) => {
    setData(prev => ({
      ...prev,
      groups: prev.groups.map(g => 
        g.id === groupId 
          ? { ...g, gymnasts: g.gymnasts.filter(gym => gym.id !== gymnastId) }
          : g
      ),
    }));
  }, []);

  // MEET MANAGEMENT
  const startNewMeet = useCallback((name: string, groupId: string) => {
    const group = data.groups.find(g => g.id === groupId);
    if (!group) return null;

    const newMeet: CurrentMeet = {
      id: `meet-${Date.now()}`,
      name: name.trim() || 'New Meet',
      date: new Date().toISOString().split('T')[0],
      groupId,
      gymnasts: [...group.gymnasts],
      eventScores: EVENTS.reduce((acc, event) => ({
        ...acc,
        [event]: { event, scores: [], completed: false }
      }), {} as Record<EventType, any>),
      activeEvent: null,
    };

    setData(prev => ({
      ...prev,
      currentMeet: newMeet,
    }));

    return newMeet;
  }, [data.groups]);

  const setActiveEvent = useCallback((event: EventType | null) => {
    setData(prev => ({
      ...prev,
      currentMeet: prev.currentMeet 
        ? { ...prev.currentMeet, activeEvent: event }
        : null,
    }));
  }, []);

  const updateEventScore = useCallback((event: EventType, gymnastId: string, score: number | null) => {
    setData(prev => {
      if (!prev.currentMeet) return prev;

      const eventData = prev.currentMeet.eventScores[event];
      const existingIndex = eventData.scores.findIndex(s => s.gymnastId === gymnastId);

      let newScores: MeetScore[];
      if (score === null || score === undefined) {
        newScores = eventData.scores.filter(s => s.gymnastId !== gymnastId);
      } else if (existingIndex >= 0) {
        newScores = [...eventData.scores];
        newScores[existingIndex] = { gymnastId, score };
      } else {
        newScores = [...eventData.scores, { gymnastId, score }];
      }

      return {
        ...prev,
        currentMeet: {
          ...prev.currentMeet,
          eventScores: {
            ...prev.currentMeet.eventScores,
            [event]: {
              ...eventData,
              scores: newScores,
            },
          },
        },
      };
    });
  }, []);

  const markEventComplete = useCallback((event: EventType) => {
    setData(prev => {
      if (!prev.currentMeet) return prev;

      return {
        ...prev,
        currentMeet: {
          ...prev.currentMeet,
          eventScores: {
            ...prev.currentMeet.eventScores,
            [event]: {
              ...prev.currentMeet.eventScores[event],
              completed: true,
            },
          },
          activeEvent: null,
        },
      };
    });
  }, []);

  const completeMeet = useCallback((): MeetResults | null => {
    if (!data.currentMeet) return null;

    const results = calculateResults(data.currentMeet);
    
    const completedMeet: CompletedMeet = {
      id: data.currentMeet.id,
      name: data.currentMeet.name,
      date: data.currentMeet.date,
      groupName: data.groups.find(g => g.id === data.currentMeet?.groupId)?.name || 'Unknown',
      skillLevel: data.groups.find(g => g.id === data.currentMeet?.groupId)?.skillLevel || 'Bronze',
      results,
      completedAt: Date.now(),
    };

    setData(prev => ({
      ...prev,
      currentMeet: null,
      meetHistory: [completedMeet, ...prev.meetHistory],
    }));

    return results;
  }, [data.currentMeet, data.groups]);

  const cancelCurrentMeet = useCallback(() => {
    setData(prev => ({
      ...prev,
      currentMeet: null,
    }));
  }, []);

  const clearAllData = useCallback(() => {
    if (confirm('Are you sure? This will delete ALL groups and meet history.')) {
      setData(DEFAULT_DATA);
    }
  }, []);

  // CALCULATIONS
  const calculateResults = useCallback((meet: CurrentMeet): MeetResults => {
    const gymnastResults: GymnastResult[] = meet.gymnasts.map(gymnast => {
      const eventScores: Record<EventType, number | null> = {
        bars: meet.eventScores.bars.scores.find(s => s.gymnastId === gymnast.id)?.score || null,
        beam: meet.eventScores.beam.scores.find(s => s.gymnastId === gymnast.id)?.score || null,
        floor: meet.eventScores.floor.scores.find(s => s.gymnastId === gymnast.id)?.score || null,
        vault: meet.eventScores.vault.scores.find(s => s.gymnastId === gymnast.id)?.score || null,
      };

      return {
        gymnast,
        totalScore: calculateGymnastTotal(eventScores),
        eventScores,
        rank: 0,
      };
    });

    // Sort and assign ranks
    const sortedResults = [...gymnastResults]
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((r, index) => ({ ...r, rank: index + 1 }));

    const completedEvents = EVENTS.filter(event => meet.eventScores[event].completed);

    return {
      gymnasts: sortedResults,
      teamTotal: calculateTeamTotal(sortedResults),
      topThree: sortedResults.slice(0, 3),
      completedEvents,
    };
  }, []);

  const currentResults = data.currentMeet ? calculateResults(data.currentMeet) : null;

  return {
    data,
    isLoaded,
    
    // Groups
    groups: data.groups,
    createGroup,
    updateGroup,
    deleteGroup,
    addGymnastToGroup,
    removeGymnastFromGroup,
    
    // Current Meet
    currentMeet: data.currentMeet,
    startNewMeet,
    setActiveEvent,
    updateEventScore,
    markEventComplete,
    completeMeet,
    cancelCurrentMeet,
    currentResults,
    
    // History
    meetHistory: data.meetHistory,
    
    // Admin
    clearAllData,
  };
}

export function exportData(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function importData(json: string): AppData | null {
  try {
    const parsed = JSON.parse(json);
    if (parsed.groups && Array.isArray(parsed.groups)) {
      return parsed as AppData;
    }
    return null;
  } catch {
    return null;
  }
}