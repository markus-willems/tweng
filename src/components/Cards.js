import React from 'react';

import Card from './Card';

const applySpell = (card, spells) => {
    let newCard = Object.assign({}, card);
    spells.forEach(spell => {
        if (spell === 'frost' && newCard.type === 'frontline') {
            newCard.strength = 1;
        }
        if (spell === 'fog' && newCard.type === 'midrange') {
            newCard.strength = 1;
        }
        if (spell === 'rain' && newCard.type === 'longrange') {
            newCard.strength = 1;
        }
    });
    return newCard;
};

const rowStength = (cards, spells, type) => {
    return cards
        .filter(card => card.type === type && card.played)
        .map(card => applySpell(card, spells))
        .reduce((acc, curr) => (acc += curr.strength), 0);
};

const rowCards = (cards, spells, type) => {
    return cards
        .filter(card => card.type === type && card.played)
        .map(card => applySpell(card, spells))
        .map(card => <Card key={card.id} {...card} />);
};

const spellActive = (spells, type) => {
    return (
        spells.filter(spell => {
            if (spell === 'frost' && type === 'frontline') {
                return true;
            }
            if (spell === 'fog' && type === 'midrange') {
                return true;
            }
            if (spell === 'rain' && type === 'longrange') {
                return true;
            }
        }).length > 0
    );
};

export default ({
    cards,
    cardsOpponent,
    spells,
    isMobile,
    playersTurn,
    opponentPassRound,
}) => {
    const isTurn = isMobile && playersTurn;
    const hasPassed = isMobile && opponentPassRound;
    return (
        <div className="cards">
            <div className="cards-opponent">
                <div className="row">
                    {spellActive(spells, 'longrange') ? (
                        <div className="spell-active" />
                    ) : null}
                    <div
                        className={
                            'row-strength' + (hasPassed ? ' passed' : '')
                        }
                    >
                        {rowStength(cardsOpponent, spells, 'longrange')}
                    </div>
                    {rowCards(cardsOpponent, spells, 'longrange')}
                </div>
                <div className="row">
                    {spellActive(spells, 'midrange') ? (
                        <div className="spell-active" />
                    ) : null}
                    <div
                        className={
                            'row-strength' + (hasPassed ? ' passed' : '')
                        }
                    >
                        {rowStength(cardsOpponent, spells, 'midrange')}
                    </div>
                    {rowCards(cardsOpponent, spells, 'midrange')}
                </div>
                <div className="row">
                    {spellActive(spells, 'frontline') ? (
                        <div className="spell-active" />
                    ) : null}
                    <div
                        className={
                            'row-strength' + (hasPassed ? ' passed' : '')
                        }
                    >
                        {rowStength(cardsOpponent, spells, 'frontline')}
                    </div>
                    {rowCards(cardsOpponent, spells, 'frontline')}
                </div>
            </div>
            <div className="cards-player">
                <div className="row">
                    {spellActive(spells, 'frontline') ? (
                        <div className="spell-active" />
                    ) : null}
                    <div className={'row-strength' + (isTurn ? ' turn' : '')}>
                        {rowStength(cards, spells, 'frontline')}
                    </div>
                    {rowCards(cards, spells, 'frontline')}
                </div>
                <div className="row">
                    {spellActive(spells, 'midrange') ? (
                        <div className="spell-active" />
                    ) : null}
                    <div className={'row-strength' + (isTurn ? ' turn' : '')}>
                        {rowStength(cards, spells, 'midrange')}
                    </div>
                    {rowCards(cards, spells, 'midrange')}
                </div>
                <div className="row">
                    {spellActive(spells, 'longrange') ? (
                        <div className="spell-active" />
                    ) : null}
                    <div className={'row-strength' + (isTurn ? ' turn' : '')}>
                        {rowStength(cards, spells, 'longrange')}
                    </div>
                    {rowCards(cards, spells, 'longrange')}
                </div>
            </div>
        </div>
    );
};
