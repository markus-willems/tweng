import React from 'react';

export default ({
    winner,
    playerId,
    reset,
    showCredits,
    handleCloseOverlay,
    loading,
}) => {
    return (
        <div className="overlay">
            <div className="overlay-message">
                {showCredits ? (
                    <React.Fragment>
                        <h2>Credits</h2>
                        <div className="credits">
                            <div>
                                Icons made by{' '}
                                <a
                                    href="https://www.flaticon.com/authors/smashicons"
                                    title="Smashicons"
                                >
                                    Smashicons
                                </a>{' '}
                                from{' '}
                                <a
                                    href="https://www.flaticon.com/"
                                    title="Flaticon"
                                >
                                    www.flaticon.com
                                </a>{' '}
                                is licensed by{' '}
                                <a
                                    href="http://creativecommons.org/licenses/by/3.0/"
                                    title="Creative Commons BY 3.0"
                                    target="_blank"
                                >
                                    CC 3.0 BY
                                </a>
                            </div>
                        </div>
                        <div className="buttons">
                            {
                                <button
                                    className="btn-primary"
                                    onClick={() =>
                                        handleCloseOverlay('credits')
                                    }
                                >
                                    Close
                                </button>
                            }
                        </div>
                    </React.Fragment>
                ) : null}
                {winner ? (
                    <React.Fragment>
                        <h2>{`You ${
                            winner.playerId === playerId ? 'won' : 'lost'
                        }!`}</h2>
                        <div className="buttons">
                            {/* <button className="btn-primary" onClick={reset}>
                        New game!
                    </button> */}
                        </div>
                    </React.Fragment>
                ) : null}
                {loading ? (
                    <React.Fragment>
                        <h2>Loading...</h2>
                    </React.Fragment>
                ) : null}
            </div>
        </div>
    );
};
