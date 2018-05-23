import React from 'react';
import Pusher from 'pusher-js';

// Components
import Board from './Board';
import Players from './Players';
import Login from './Login';
import Waiting from './Waiting';
import Overlay from './Overlay';

import normalizecss from 'normalize.css';
import '../assets/css/styles.css';

const MOBILE_VIEWPORT_WIDTH_THRESHOLD = 768;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            channel: '',
            username: '',
            playerId: null,
            isInvite: false,
            playerIsReady: false,
            gameIsOpen: false,
            playerHasJoined: false,
            players: [],
            cardsOpponent: [],
            cards: [],
            passRound: false,
            opponentPassRound: false,
            playersTurn: false,
            spells: [],
            gameStatus: [],
            winner: false,
        };

        this.pusher = new Pusher(process.env.PUSHER_APP_KEY, {
            cluster: 'eu',
            encrypted: true,
        });

        this.handleOnEvent = this.handleOnEvent.bind(this);
        this.handleOnSubmitForm = this.handleOnSubmitForm.bind(this);
        this.triggerMessage = this.triggerMessage.bind(this);
        this.handleCardOnClick = this.handleCardOnClick.bind(this);
        this.handleOnClickPassRound = this.handleOnClickPassRound.bind(this);
        this.resetGame = this.resetGame.bind(this);
    }

    componentDidMount() {
        const urlHash = window.location.hash;
        if (urlHash.match(/#join\//) !== null) {
            this.setState({
                isInvite: true,
                channel: this.getChannelFromUrlHash(urlHash),
            });
        }
    }

    componentDidUpdate() {
        if (!this.pusherChannel && this.state.channel) {
            this.pusherChannel = this.pusher.subscribe(this.state.channel);
            this.pusherChannel.bind('tweng', data => {
                // handle type 'ready'
                if (data.type === 'ready') {
                    if (data.valid) {
                        this.setState(prevState => ({
                            gameIsOpen: true,
                            players: data.players,
                            playersTurn:
                                prevState.playerId === data.startingPlayerId,
                            gameStatus: data.players.map(player => ({
                                lifes: 2,
                                lostLifes: 0,
                                roundsWon: 0,
                                playerId: player.userId,
                            })),
                        }));
                    }
                }
                // handle type playCard
                if (data.type === 'playCard') {
                    if (data.card.category === 'spell') {
                        this.setState(prevState => ({
                            spells: this.setSpells(
                                prevState.spells,
                                data.card.type,
                            ),
                        }));
                    }
                    if (data.card.playerId !== this.state.playerId) {
                        this.setState(prevState => ({
                            cardsOpponent: prevState.cardsOpponent.concat(
                                data.card,
                            ),
                            playersTurn: prevState.passRound ? false : true,
                        }));
                    }
                }
                // handle opponent passes round
                if (data.type === 'passRound') {
                    if (data.data.playerId !== this.state.playerId) {
                        this.setState(prevState => ({
                            opponentPassRound: true,
                            playersTurn: true,
                        }));
                    }
                }
            });
        }
        if (this.state.cards.length === 0 && this.state.playerHasJoined) {
            this.getCards();
        }
        if (this.state.passRound && this.state.opponentPassRound) {
            // handle new round
            const playerTotalStrength = this.getTotalStrength(
                this.state.cards,
                this.state.spells,
            );
            const opponentTotalStrength = this.getTotalStrength(
                this.state.cardsOpponent,
                this.state.spells,
            );

            let newGameStatus = [];
            if (playerTotalStrength > opponentTotalStrength) {
                // player won
                newGameStatus = this.state.gameStatus.map(statusObj => {
                    if (statusObj.playerId === this.state.playerId) {
                        return Object.assign({}, statusObj, {
                            roundsWon: statusObj.roundsWon + 1,
                        });
                    } else {
                        return Object.assign({}, statusObj, {
                            lostLifes: statusObj.lostLifes + 1,
                        });
                    }
                });
            } else if (playerTotalStrength === opponentTotalStrength) {
                // both lost
                newGameStatus = this.state.gameStatus.map(statusObj =>
                    Object.assign({}, statusObj, {
                        lostLifes: statusObj.lostLifes + 1,
                        roundsWon: statusObj.roundsWon + 1,
                    }),
                );
            } else {
                // opponent won
                newGameStatus = this.state.gameStatus.map(statusObj => {
                    if (statusObj.playerId !== this.state.playerId) {
                        return Object.assign({}, statusObj, {
                            roundsWon: statusObj.roundsWon + 1,
                        });
                    } else {
                        return Object.assign({}, statusObj, {
                            lostLifes: statusObj.lostLifes + 1,
                        });
                    }
                });
            }

            const winner = newGameStatus
                .filter(statusObj => statusObj.roundsWon === 2)
                .pop();

            this.setState(
                prevState => ({
                    gameStatus: newGameStatus,
                    passRound: false,
                    opponentPassRound: false,
                    winner: winner ? winner : false,
                }),
                () => {
                    // reset, and go to next round if possible. otherwise create winner overlay
                    if (!this.state.winner) {
                        this.resetRound();
                    }
                },
            );
        }
    }

    resetRound() {
        this.setState(prevState => ({
            cards: prevState.cards.filter(card => !card.played),
            cardsOpponent: prevState.cardsOpponent.filter(card => !card.played),
            spells: [],
        }));
    }

    resetGame() {
        console.log('reset game');
    }

    setSpells(prevSpells, spell) {
        if (spell === 'clear') {
            return [];
        }
        return [...new Set(prevSpells.concat(spell))];
    }

    getChannelFromUrlHash(urlHash) {
        return urlHash.replace(/#join\//, '');
    }

    getHand(playerId, cards = [], amount = 10) {
        return cards.filter((_, i) => i < amount).map(card => {
            return Object.assign({}, card, {
                played: false,
                playerId: playerId,
            });
        });
    }

    handleCardOnClick(cardId) {
        let cardToPlay = {};
        this.setState(
            prevState => ({
                cards: prevState.cards.map(card => {
                    if (card.id === cardId) {
                        const updatedCard = Object.assign({}, card, {
                            played: true,
                        });
                        cardToPlay = updatedCard;
                        return updatedCard;
                    }
                    return card;
                }),
                playersTurn: this.state.opponentPassRound ? true : false,
            }),
            () => {
                this.playCard(cardToPlay);
            },
        );
    }

    async getCards() {
        const response = await fetch(`${process.env.API_URL}/api/cards`);
        const responseData = await response.json();
        this.setState(prevState => ({
            cards: this.getHand(prevState.playerId, responseData.cards),
        }));
    }

    async playCard(card) {
        const response = await fetch(
            `${process.env.API_URL}/api/channel/message`,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    channel: this.state.channel,
                    card: card,
                    type: 'playCard',
                }),
            },
        );
    }

    async joinChannel(username, channel) {
        const response = await fetch(
            `${process.env.API_URL}/api/channel/join`,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    channel: channel,
                }),
            },
        );

        const responseData = await response.json();

        if (responseData.valid) {
            this.setState(prevState => ({
                playerHasJoined: true,
                playerId: responseData.userId,
            }));
        }

        // something went wrong
        if (!responseData.valid) {
        }
    }

    async createChannel(username) {
        const response = await fetch(
            `${process.env.API_URL}/api/channel/create`,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                }),
            },
        );

        const responseData = await response.json();

        if (responseData.channel) {
            this.setState(prevState => ({
                channel: responseData.channel,
                playerId: responseData.userId,
                playerHasJoined: true,
            }));
        }
    }

    async triggerMessage(data, type) {
        const response = await fetch(
            `${process.env.API_URL}/api/channel/message`,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    channel: this.state.channel,
                    data: data,
                    type: type,
                }),
            },
        );
    }

    handleOnSubmitForm(e) {
        e.preventDefault();
        if (!this.state.isInvite) {
            if (this.state.username.length > 0) {
                this.createChannel(this.state.username);
            }
        } else {
            if (this.state.username.length > 0 && this.state.channel) {
                this.joinChannel(this.state.username, this.state.channel);
            }
        }
    }

    handleOnEvent(e, value, type = '') {
        this.setState({
            [e.target.name]: value !== undefined ? value : e.target.value,
        });
        if (type === 'playerReady') {
            this.playerReady();
        }
    }

    handleOnClickPassRound() {
        this.triggerMessage(
            {
                playerId: this.state.playerId,
            },
            'passRound',
        );
        this.setState({
            passRound: true,
            playersTurn: false,
        });
    }

    async playerReady() {
        const response = await fetch(
            `${process.env.API_URL}/api/channel/ready`,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    channel: this.state.channel,
                }),
            },
        );
    }

    createInviteLink() {
        let inviteLink = null;
        if (this.state.channel !== '' && !this.state.isInvite) {
            inviteLink = `${process.env.APP_URL}/#join/${this.state.channel}`;
        }
        return inviteLink;
    }

    applySpell(card, spells) {
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
    }

    getTotalStrength(cards, spells) {
        return cards
            .filter(card => card.played)
            .map(card => this.applySpell(card, spells))
            .reduce((acc, curr) => (acc += curr.strength), 0);
    }

    renderMobile() {
        return (
            <div
                className={
                    'container mobile' +
                    (this.state.gameIsOpen ? '' : ' is-login')
                }
            >
                {this.state.winner ? (
                    <Overlay
                        winner={this.state.winner}
                        playerId={this.state.playerId}
                        reset={this.resetGame}
                    />
                ) : null}
                <Login
                    username={this.state.username}
                    isInvite={this.state.isInvite}
                    playerHasJoined={this.state.playerHasJoined}
                    handleOnEvent={this.handleOnEvent}
                    handleOnSubmitForm={this.handleOnSubmitForm}
                    inviteLink={this.createInviteLink()}
                    playerIsReady={this.state.playerIsReady}
                />
                {this.state.playerIsReady ? (
                    this.state.gameIsOpen ? (
                        <React.Fragment>
                            <Players
                                isMobile={true}
                                gameStatus={this.state.gameStatus}
                                players={this.state.players}
                                playerId={this.state.playerId}
                                playerTotalStrength={this.getTotalStrength(
                                    this.state.cards,
                                    this.state.spells,
                                )}
                                opponentTotalStrength={this.getTotalStrength(
                                    this.state.cardsOpponent,
                                    this.state.spells,
                                )}
                                handlePassRound={
                                    this.state.playersTurn
                                        ? this.handleOnClickPassRound
                                        : null
                                }
                                passRound={this.state.passRound}
                                opponentPassRound={this.state.opponentPassRound}
                                playersTurn={this.state.playersTurn}
                            />
                            <Board
                                isMobile={true}
                                cards={this.state.cards}
                                cardsOpponent={this.state.cardsOpponent}
                                handleCardOnClick={
                                    !this.state.passRound
                                        ? this.handleCardOnClick
                                        : null
                                }
                                spells={this.state.spells}
                                playersTurn={this.state.playersTurn}
                            />
                        </React.Fragment>
                    ) : (
                        <Waiting />
                    )
                ) : null}
            </div>
        );
    }

    renderDesktop() {
        return (
            <div
                className={
                    'container' + (this.state.gameIsOpen ? '' : ' is-login')
                }
            >
                {this.state.winner ? (
                    <Overlay
                        winner={this.state.winner}
                        playerId={this.state.playerId}
                        reset={this.resetGame}
                    />
                ) : null}
                <Login
                    username={this.state.username}
                    isInvite={this.state.isInvite}
                    playerHasJoined={this.state.playerHasJoined}
                    handleOnEvent={this.handleOnEvent}
                    handleOnSubmitForm={this.handleOnSubmitForm}
                    inviteLink={this.createInviteLink()}
                    playerIsReady={this.state.playerIsReady}
                />
                {this.state.playerIsReady ? (
                    this.state.gameIsOpen ? (
                        <React.Fragment>
                            <Players
                                gameStatus={this.state.gameStatus}
                                players={this.state.players}
                                playerId={this.state.playerId}
                                playerTotalStrength={this.getTotalStrength(
                                    this.state.cards,
                                    this.state.spells,
                                )}
                                opponentTotalStrength={this.getTotalStrength(
                                    this.state.cardsOpponent,
                                    this.state.spells,
                                )}
                                handlePassRound={
                                    this.state.playersTurn
                                        ? this.handleOnClickPassRound
                                        : null
                                }
                                passRound={this.state.passRound}
                                opponentPassRound={this.state.opponentPassRound}
                                playersTurn={this.state.playersTurn}
                            />
                            <Board
                                cards={this.state.cards}
                                cardsOpponent={this.state.cardsOpponent}
                                handleCardOnClick={
                                    !this.state.passRound
                                        ? this.handleCardOnClick
                                        : null
                                }
                                spells={this.state.spells}
                                playersTurn={this.state.playersTurn}
                            />
                        </React.Fragment>
                    ) : (
                        <Waiting />
                    )
                ) : null}
            </div>
        );
    }

    render() {
        return (
            <React.Fragment>
                {window.innerWidth <= MOBILE_VIEWPORT_WIDTH_THRESHOLD
                    ? this.renderMobile()
                    : this.renderDesktop()}
            </React.Fragment>
        );
    }
}

export default App;
