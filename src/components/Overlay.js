import React from 'react';

export default ({ winner, playerId, reset }) => {
    return (
        <div className="overlay">
            <div className="overlay-message">
                <h2>{`You ${
                    winner.playerId === playerId ? 'won' : 'lost'
                }!`}</h2>
                <div className="buttons">
                    <button className="btn-primary" onClick={reset}>
                        New game!
                    </button>
                </div>
            </div>
        </div>
    );
};
