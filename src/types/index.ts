export type EventType = 'bars' | 'beam' | 'floor' | 'vault';
export type SkillLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface Gymnast {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  skillLevel: SkillLevel;
  gymnasts: Gymnast[];
  createdAt: number;
}

export interface MeetScore {
  gymnastId: string;
  score: number;
}

export interface EventScores {
  event: EventType;
  scores: MeetScore[];
  completed: boolean;
}

export interface CurrentMeet {
  id: string;
  name: string;
  date: string;
  groupId: string | null;
  gymnasts: Gymnast[];
  eventScores: Record<EventType, EventScores>;
  activeEvent: EventType | null;
}

export interface AppData {
  groups: Group[];
  currentMeet: CurrentMeet | null;
  meetHistory: CompletedMeet[];
}

export interface CompletedMeet {
  id: string;
  name: string;
  date: string;
  groupName: string;
  skillLevel: SkillLevel;
  results: MeetResults;
  completedAt: number;
}

export interface GymnastResult {
  gymnast: Gymnast;
  totalScore: number;
  eventScores: Record<EventType, number | null>;
  rank: number;
}

export interface MeetResults {
  gymnasts: GymnastResult[];
  teamTotal: number;
  topThree: GymnastResult[];
  completedEvents: EventType[];
}

export const EVENT_CONFIG: Record<EventType, { 
  label: string; 
  icon: string; 
  emoji: string; 
  color: string;
  bgGradient: string;
}> = {
  bars: {
    label: 'Bars',
    icon: 'horizontal_rule',
    emoji: '🥍',
    color: '#c9a227',
    bgGradient: 'from-amber-900/20 to-yellow-900/20',
  },
  beam: {
    label: 'Beam',
    icon: 'straighten',
    emoji: '🪵',
    color: '#c9a227',
    bgGradient: 'from-orange-900/20 to-amber-900/20',
  },
  floor: {
    label: 'Floor',
    icon: 'square_foot',
    emoji: '💃',
    color: '#c9a227',
    bgGradient: 'from-yellow-900/20 to-amber-900/20',
  },
  vault: {
    label: 'Vault',
    icon: 'trending_up',
    emoji: '🚀',
    color: '#c9a227',
    bgGradient: 'from-amber-900/20 to-orange-900/20',
  },
};

export const EVENTS: EventType[] = ['bars', 'beam', 'floor', 'vault'];

export const SKILL_LEVELS: SkillLevel[] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

export function calculateGymnastTotal(eventScores: Record<EventType, number | null>): number {
  const scores = Object.values(eventScores).filter((s): s is number => s !== null);
  return scores.reduce((sum, score) => sum + score, 0);
}

export function calculateTeamTotal(results: GymnastResult[]): number {
  const sorted = [...results].sort((a, b) => b.totalScore - a.totalScore);
  const topThree = sorted.slice(0, 3);
  return topThree.reduce((sum, r) => sum + r.totalScore, 0);
}

export function getCompletedEvents(eventScores: Record<EventType, EventScores>): EventType[] {
  return EVENTS.filter(event => eventScores[event]?.completed);
}

export function isMeetComplete(eventScores: Record<EventType, EventScores>): boolean {
  return EVENTS.every(event => eventScores[event]?.completed);
}