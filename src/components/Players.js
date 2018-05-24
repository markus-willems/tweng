import React from 'react';

const Player = ({
    player,
    totalStrength,
    type,
    gameStatus,
    opponentPassRound,
    playersTurn,
}) => {
    return (
        <div className="player">
            <div className="player-info">
                <div className="avatar">
                    <img
                        src={require(`../assets/images/${type}.svg`)}
                        alt="Crown"
                    />
                </div>
                <div className="lifes">
                    {gameStatus
                        .filter(
                            statusObj => statusObj.playerId === player.userId,
                        )
                        .map(statusObj => {
                            return Array.from({
                                length: statusObj.lifes - statusObj.lostLifes,
                            }).map((_, index) => {
                                return (
                                    <div key={index} className="life">
                                        <img
                                            src={require(`../assets/images/heart.svg`)}
                                            alt="Life"
                                        />
                                    </div>
                                );
                            });
                        })}
                    {gameStatus
                        .filter(
                            statusObj => statusObj.playerId === player.userId,
                        )
                        .map(statusObj => {
                            return Array.from({
                                length: statusObj.lostLifes,
                            }).map((_, index) => {
                                return (
                                    <div key={index} className="life lost">
                                        <img
                                            src={require(`../assets/images/heart.svg`)}
                                            alt="Life"
                                        />
                                    </div>
                                );
                            });
                        })}
                </div>
                <div className="name">{player.username}</div>
                <div className="total-strength">
                    <span>{totalStrength}</span>
                </div>
                {opponentPassRound ? (
                    <div className="passed">Opponent passed!</div>
                ) : null}
                {playersTurn ? <div className="turn">Your turn!</div> : null}
            </div>
        </div>
    );
};

export default ({
    players,
    playerId,
    playerTotalStrength,
    opponentTotalStrength,
    handlePassRound,
    gameStatus,
    passRound,
    opponentPassRound,
    playersTurn,
    isMobile,
    menuIsOpen,
}) => {
    const opponent = players.filter(player => player.userId !== playerId).pop();
    const player = players.filter(player => player.userId === playerId).pop();

    return (
        <div className={'players' + (isMobile && menuIsOpen ? ' open' : '')}>
            <Player
                player={opponent}
                type="opponent"
                totalStrength={opponentTotalStrength}
                gameStatus={gameStatus}
                opponentPassRound={opponentPassRound}
            />
            <div
                className={`actions${
                    !handlePassRound ? ' actions-disable' : ''
                }`}
            >
                {!passRound ? (
                    <button className="btn-primary" onClick={handlePassRound}>
                        Pass
                    </button>
                ) : (
                    <div className="passed">Passed!</div>
                )}
            </div>
            <Player
                player={player}
                type="player"
                totalStrength={playerTotalStrength}
                gameStatus={gameStatus}
                playersTurn={playersTurn}
            />
        </div>
    );
};
