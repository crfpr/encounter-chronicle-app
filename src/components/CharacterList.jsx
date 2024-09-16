import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import CharacterCard from './CharacterCard';
import { Button } from '../components/ui/button';

const CharacterList = forwardRef(({ combatants, setCombatants, activeCombatantIndex, turnTime, onPreviousTurn, onNextTurn, setIsNumericInputActive, round, isMobile }, ref) => {
  const listRef = useRef(null);
  const activeCombatantRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToActiveCombatant: () => {
      if (activeCombatantRef.current && listRef.current) {
        const listRect = listRef.current.getBoundingClientRect();
        const cardRect = activeCombatantRef.current.getBoundingClientRect();
        const scrollTop = listRef.current.scrollTop;

        if (cardRect.top < listRect.top || cardRect.bottom > listRect.bottom) {
          listRef.current.scrollTo({
            top: scrollTop + cardRect.top - listRect.top - 16,
            behavior: 'smooth'
          });
        }
      }
    }
  }));

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollToActiveCombatant();
    }
  }, [activeCombatantIndex, ref]);

  const addCombatant = () => {
    const newCombatant = {
      id: Date.now(),
      initiative: '',
      name: 'New Combatant',
      type: 'PC',
      currentHp: 0,
      maxHp: 0,
      tempHp: 0,
      ac: 10,
      action: false,
      bonusAction: false,
      currentMovement: 30,
      maxMovement: 30,
      reaction: false,
      conditions: [],
      turnCount: 0,
      roundCount: 0,
      cumulativeTurnTime: 0,
      hasActed: false,
      state: 'alive'
    };
    setCombatants(prevCombatants => [...prevCombatants, newCombatant]);
  };

  const removeCombatant = (id) => {
    setCombatants(prevCombatants => prevCombatants.filter(c => c.id !== id));
  };

  const updateCombatant = (updatedCombatant) => {
    setCombatants(prevCombatants => 
      prevCombatants.map(c => {
        if (c.id === updatedCombatant.id) {
          console.log(`Updating combatant ${c.name}:`, updatedCombatant);
          return { ...c, ...updatedCombatant };
        }
        return c;
      })
    );
  };

  const sortCombatants = () => {
    setCombatants(prevCombatants => 
      [...prevCombatants].sort((a, b) => {
        if (a.initiative === '' && b.initiative === '') return 0;
        if (a.initiative === '') return 1;
        if (b.initiative === '') return -1;
        return Number(b.initiative) - Number(a.initiative);
      })
    );
  };

  const handleInitiativeBlur = (id, initiative) => {
    updateCombatant({ id, initiative });
    sortCombatants();
  };

  const handleInitiativeSubmit = (id, initiative) => {
    updateCombatant({ id, initiative });
    sortCombatants();
  };

  return (
    <div ref={listRef} className="space-y-4 overflow-y-auto h-full">
      {combatants.map((combatant, index) => (
        <div 
          key={combatant.id} 
          className={`relative transition-all duration-300 ease-in-out ${index === activeCombatantIndex ? 'z-10' : 'z-0'}`} 
          data-index={index}
          ref={index === activeCombatantIndex ? activeCombatantRef : null}
        >
          <CharacterCard
            combatant={combatant}
            updateCombatant={updateCombatant}
            removeCombatant={removeCombatant}
            isActive={index === activeCombatantIndex}
            turnTime={turnTime}
            onPreviousTurn={onPreviousTurn}
            onNextTurn={onNextTurn}
            setIsNumericInputActive={setIsNumericInputActive}
            onInitiativeBlur={handleInitiativeBlur}
            onInitiativeSubmit={handleInitiativeSubmit}
            round={round}
            isMobile={isMobile}
          />
        </div>
      ))}
      <div className="pb-6">
        <Button 
          onClick={addCombatant} 
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors duration-200"
        >
          Add Combatant
        </Button>
      </div>
    </div>
  );
});

export default CharacterList;
