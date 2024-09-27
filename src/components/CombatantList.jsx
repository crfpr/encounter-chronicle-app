import React from 'react';
import { Button } from './ui/button';
import CombatantNameType from './CombatantNameType';
import HPSection from './HPSection';
import CombatantActions from './CombatantActions';
import CombatantStateManager from './CombatantStateManager';
import LegendaryFeatures from './LegendaryFeatures';
import ConditionInput from './ConditionInput';
import TokenInput from './TokenInput';
import TurnNavigator from './TurnNavigator';
import PlaceholderTurnNavigator from './PlaceholderTurnNavigator';

const CombatantList = React.forwardRef(({
  combatants,
  activeCombatantIndex,
  onPreviousTurn,
  onNextTurn,
  setIsNumericInputActive,
  updateCombatant,
  addCombatant,
  removeCombatant,
  round,
  isMobile
}, ref) => {
  const handleAddCombatant = () => {
    addCombatant({
      id: Date.now(),
      name: 'New Combatant',
      type: 'PC',
      initiative: '',
      currentHp: '',
      maxHp: '',
      ac: '',
      conditions: [],
      tokens: []
    });
  };

  const handleAddCondition = (combatantId) => {
    const combatant = combatants.find(c => c.id === combatantId);
    if (combatant) {
      const updatedConditions = [
        ...combatant.conditions,
        { id: Date.now(), label: 'New Condition', conditionDuration: null, isPersistent: false }
      ];
      updateCombatant({ ...combatant, conditions: updatedConditions });
    }
  };

  const handleAddToken = (combatantId) => {
    const combatant = combatants.find(c => c.id === combatantId);
    if (combatant) {
      const updatedTokens = [
        ...combatant.tokens,
        { id: Date.now(), label: 'New Token', tokenDuration: null, isPersistent: false }
      ];
      updateCombatant({ ...combatant, tokens: updatedTokens });
    }
  };

  return (
    <div ref={ref} className="space-y-4">
      {combatants.map((combatant, index) => (
        <div key={combatant.id} className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-stretch">
            <div className="w-10 flex-shrink-0 flex items-center justify-center border-r border-zinc-300 dark:border-zinc-700">
              {index === activeCombatantIndex ? (
                <TurnNavigator
                  onPreviousTurn={onPreviousTurn}
                  onNextTurn={onNextTurn}
                  turnTime={combatant.turnTime || 0}
                />
              ) : (
                <PlaceholderTurnNavigator />
              )}
            </div>
            <div className="flex-grow p-4 space-y-2">
              <div className="flex items-center justify-between">
                <CombatantNameType
                  name={combatant.name}
                  type={combatant.type}
                  onUpdate={(name, type) => updateCombatant({ ...combatant, name, type })}
                  isMobile={isMobile}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={combatant.initiative}
                    onChange={(e) => updateCombatant({ ...combatant, initiative: e.target.value })}
                    className="w-12 text-center bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded"
                    placeholder="Init"
                  />
                  <input
                    type="text"
                    value={combatant.ac}
                    onChange={(e) => updateCombatant({ ...combatant, ac: e.target.value })}
                    className="w-12 text-center bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded"
                    placeholder="AC"
                  />
                  <Button
                    onClick={() => removeCombatant(combatant.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CombatantActions
                  combatant={combatant}
                  isActive={index === activeCombatantIndex}
                  updateCombatant={updateCombatant}
                  setIsNumericInputActive={setIsNumericInputActive}
                  isMobile={isMobile}
                />
                <HPSection
                  combatant={combatant}
                  isActive={index === activeCombatantIndex}
                  updateCombatant={updateCombatant}
                  setIsNumericInputActive={setIsNumericInputActive}
                />
              </div>
              <CombatantStateManager
                combatant={combatant}
                updateCombatant={updateCombatant}
                isMobile={isMobile}
              />
              <LegendaryFeatures
                character={combatant}
                updateCharacter={updateCombatant}
                isMobile={isMobile}
              />
              <div className="flex flex-wrap gap-2">
                {combatant.conditions.map((condition) => (
                  <ConditionInput
                    key={condition.id}
                    condition={condition}
                    onLabelChange={(label) => {
                      const updatedConditions = combatant.conditions.map(c =>
                        c.id === condition.id ? { ...c, label } : c
                      );
                      updateCombatant({ ...combatant, conditions: updatedConditions });
                    }}
                    onDurationChange={(conditionDuration) => {
                      const updatedConditions = combatant.conditions.map(c =>
                        c.id === condition.id ? { ...c, conditionDuration } : c
                      );
                      updateCombatant({ ...combatant, conditions: updatedConditions });
                    }}
                    onRemove={() => {
                      const updatedConditions = combatant.conditions.filter(c => c.id !== condition.id);
                      updateCombatant({ ...combatant, conditions: updatedConditions });
                    }}
                    onTogglePersistent={() => {
                      const updatedConditions = combatant.conditions.map(c =>
                        c.id === condition.id ? { ...c, isPersistent: !c.isPersistent } : c
                      );
                      updateCombatant({ ...combatant, conditions: updatedConditions });
                    }}
                  />
                ))}
                <Button
                  onClick={() => handleAddCondition(combatant.id)}
                  variant="outline"
                  size="sm"
                >
                  Add Condition
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {combatant.tokens.map((token) => (
                  <TokenInput
                    key={token.id}
                    token={token}
                    onLabelChange={(label) => {
                      const updatedTokens = combatant.tokens.map(t =>
                        t.id === token.id ? { ...t, label } : t
                      );
                      updateCombatant({ ...combatant, tokens: updatedTokens });
                    }}
                    onDurationChange={(tokenDuration) => {
                      const updatedTokens = combatant.tokens.map(t =>
                        t.id === token.id ? { ...t, tokenDuration } : t
                      );
                      updateCombatant({ ...combatant, tokens: updatedTokens });
                    }}
                    onRemove={() => {
                      const updatedTokens = combatant.tokens.filter(t => t.id !== token.id);
                      updateCombatant({ ...combatant, tokens: updatedTokens });
                    }}
                    onTogglePersistent={() => {
                      const updatedTokens = combatant.tokens.map(t =>
                        t.id === token.id ? { ...t, isPersistent: !t.isPersistent } : t
                      );
                      updateCombatant({ ...combatant, tokens: updatedTokens });
                    }}
                  />
                ))}
                <Button
                  onClick={() => handleAddToken(combatant.id)}
                  variant="outline"
                  size="sm"
                >
                  Add Token
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Button onClick={handleAddCombatant} className="w-full">
        Add Combatant
      </Button>
    </div>
  );
});

export default CombatantList;