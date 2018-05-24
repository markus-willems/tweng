import React from 'react';

import Cards from './Cards';
import Hand from './Hand';

export default ({
    cards,
    cardsOpponent,
    playersTurn,
    spells,
    setTotalStrength,
    handleCardOnClick,
    isMobile,
    opponentPassRound,
}) => {
    return (
        <div className="board">
            <Cards
                isMobile={isMobile}
                spells={spells}
                cards={cards}
                cardsOpponent={cardsOpponent}
                opponentPassRound={opponentPassRound}
                playersTurn={playersTurn}
            />
            <Hand
                isMobile={isMobile}
                cards={cards}
                playersTurn={playersTurn}
                handleCardOnClick={handleCardOnClick}
            />
        </div>
    );
};
