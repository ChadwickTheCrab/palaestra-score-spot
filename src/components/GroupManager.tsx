'use client';

import { useState } from 'react';
import { Group, SkillLevel, SKILL_LEVELS } from '@/types';
import { Plus, Trash2, Users, ChevronRight, UserPlus, UserMinus } from 'lucide-react';

interface GroupManagerProps {
  groups: Group[];
  onCreateGroup: (name: string, skillLevel: SkillLevel, gymnastNames: string[]) => void;
  onDeleteGroup: (id: string) => void;
  onAddGymnast: (groupId: string, name: string) => void;
  onRemoveGymnast: (groupId: string, gymnastId: string) => void;
  onStartMeet: (group: Group) => void;
  onSelectGroup: (group: Group) => void;
}

export function GroupManager({
  groups,
  onCreateGroup,
  onDeleteGroup,
  onAddGymnast,
  onRemoveGymnast,
  onStartMeet,
  onSelectGroup,
}: GroupManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupLevel, setNewGroupLevel] = useState<SkillLevel>('Bronze');
  const [gymnastNames, setGymnastNames] = useState(['', '', '', '']);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [newGymnastName, setNewGymnastName] = useState('');

  const handleCreate = () => {
    const validNames = gymnastNames.filter(n => n.trim());
    if (newGroupName.trim() && validNames.length > 0) {
      onCreateGroup(newGroupName, newGroupLevel, gymnastNames);
      setNewGroupName('');
      setGymnastNames(['', '', '', '']);
      setShowCreateForm(false);
    }
  };

  const handleAddGymnast = (groupId: string) => {
    if (newGymnastName.trim()) {
      onAddGymnast(groupId, newGymnastName);
      setNewGymnastName('');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Create New Group Button */}
      {!showCreateForm && (
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full p-4 border-2 border-dashed border-outline rounded-xl 
                     hover:border-accent hover:bg-accent/5 transition-all
                     flex items-center justify-center gap-2 text-on-surface-variant"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Group</span>
        </button>
      )}

      {/* Create Group Form */}
      {showCreateForm && (
        <div className="card elevation-2 p-4 space-y-4">
          <h2 className="text-lg font-semibold text-on-surface">Create New Group</h2>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-on-surface-variant mb-1 block">Group Name</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g., Xcel Bronze 2024"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-sm text-on-surface-variant mb-1 block">Skill Level</label>
              <div className="grid grid-cols-5 gap-2">
                {SKILL_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => setNewGroupLevel(level)}
                    className={`py-2 px-1 rounded-lg text-xs font-medium transition-all
                      ${newGroupLevel === level 
                        ? 'bg-accent text-on-primary' 
                        : 'bg-surface-variant text-on-surface-variant hover:bg-outline/30'
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-on-surface-variant mb-1 block">
                Gymnasts (add at least 1)
              </label>
              <div className="space-y-2">
                {gymnastNames.map((name, index) => (
                  <input
                    key={index}
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const newNames = [...gymnastNames];
                      newNames[index] = e.target.value;
                      setGymnastNames(newNames);
                    }}
                    placeholder={`Gymnast ${index + 1}`}
                    className="input-field"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex-1 py-2.5 px-4 rounded-lg bg-surface-variant text-on-surface font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!newGroupName.trim() || !gymnastNames.some(n => n.trim())}
              className="flex-1 py-2.5 px-4 rounded-lg bg-accent text-on-primary font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Group
            </button>
          </div>
        </div>
      )}

      {/* Existing Groups */}
      {groups.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm uppercase tracking-wider text-on-surface-variant font-medium">
            Your Groups
          </h2>
          
          {groups.map((group) => (
            <div
              key={group.id}
              className="card elevation-1 overflow-hidden"
            >
              {/* Group Header */}
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface">{group.name}</h3>
                    <p className="text-xs text-on-surface-variant">
                      {group.skillLevel} • {group.gymnasts.length} gymnasts
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartMeet(group);
                      onSelectGroup(group);
                    }}
                    className="p-2 bg-accent text-on-primary rounded-lg hover:bg-accent-light transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedGroup === group.id && (
                <div className="border-t border-outline/20 p-4 space-y-3">
                  {/* Gymnasts List */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wider text-on-surface-variant">
                      Gymnasts
                    </h4>
                    {group.gymnasts.map((gymnast) => (
                      <div
                        key={gymnast.id}
                        className="flex items-center justify-between p-2 bg-surface-variant/50 rounded-lg"
                      >
                        <span className="text-sm text-on-surface">{gymnast.name}</span>
                        <button
                          onClick={() => onRemoveGymnast(group.id, gymnast.id)}
                          className="p-1.5 text-error/70 hover:text-error rounded-lg hover:bg-error/10"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Gymnast */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGymnastName}
                      onChange={(e) => setNewGymnastName(e.target.value)}
                      placeholder="Add gymnast..."
                      className="flex-1 input-field text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddGymnast(group.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddGymnast(group.id)}
                      disabled={!newGymnastName.trim()}
                      className="p-2 bg-surface-variant text-on-surface rounded-lg 
                                 hover:bg-accent hover:text-on-primary transition-colors
                                 disabled:opacity-50"
                    >
                      <UserPlus className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Delete Group */}
                  <button
                    onClick={() => onDeleteGroup(group.id)}
                    className="w-full py-2 text-sm text-error/70 hover:text-error 
                               flex items-center justify-center gap-2 rounded-lg hover:bg-error/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Group
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {groups.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤸</div>
          <h3 className="text-lg font-medium text-on-surface mb-2">No Groups Yet</h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Create a group to start tracking scores for your gymnasts
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-accent text-on-primary rounded-xl font-medium"
          >
            Create Your First Group
          </button>
        </div>
      )}
    </div>
  );
}