import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import CharacterCard from './CharacterCard';
import { Button } from '../components/ui/button';

const CharacterList = forwardRef(({ combatants, setCombatants, activeCombatantIndex, onPreviousTurn, onNextTurn, setIsNumericInputActive, round, isMobile }, ref) => {
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
    <div className="flex flex-col h-full">
      <div ref={listRef} className="flex-grow space-y-4 overflow-y-auto">
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
              setIsNumericInputActive={setIsNumericInputActive}
              onInitiativeBlur={handleInitiativeBlur}
              onInitiativeSubmit={handleInitiativeSubmit}
              round={round}
              isMobile={isMobile}
            />
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-zinc-300 dark:border-zinc-700 p-4 flex justify-between items-center">
        <Button onClick={onPreviousTurn} variant="outline">Previous</Button>
        <Button onClick={addCombatant} variant="outline">Add Combatant</Button>
        <Button onClick={onNextTurn} variant="outline">Next</Button>
      </div>
    </div>
  );
});

export default CharacterList;
