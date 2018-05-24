import React from 'react';

import Card from './Card';

class CardsSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            numberDisplayCards: 2,
        };

        this.handleOnClickButton = this.handleOnClickButton.bind(this);
        this.handleCardOnClick = this.handleCardOnClick.bind(this);
    }

    handleOnClickButton(type) {
        let newIndex = this.state.currentIndex;
        let numberOfCards = this.props.cards.filter(card => !card.played)
            .length;
        if (type === 'prev') {
            if (newIndex > 0) {
                newIndex -= 1;
            }
        } else {
            if (newIndex + 1 < numberOfCards) {
                newIndex += 1;
            }
        }
        this.setState({
            currentIndex: newIndex,
        });
    }

    handleCardOnClick() {
        this.setState({
            currentIndex: 0,
        });
    }

    render() {
        const { cards, handleCardOnClick, playersTurn } = this.props;
        let prevButtonDisabled = this.state.currentIndex === 0;
        let nextButtonDisbaled =
            this.state.currentIndex + 1 ===
            this.props.cards.filter(card => !card.played).length;
        return (
            <div className="cards-slider">
                <div
                    onClick={
                        !prevButtonDisabled
                            ? () => this.handleOnClickButton('prev')
                            : null
                    }
                    className={
                        'button' + (prevButtonDisabled ? ' disabled' : '')
                    }
                >
                    {'<'}
                </div>
                {cards
                    .filter(card => !card.played)
                    .slice(
                        this.state.currentIndex,
                        this.state.numberDisplayCards + this.state.currentIndex,
                    )
                    .map(card => (
                        <Card
                            onClick={this.handleCardOnClick}
                            key={card.id}
                            playersTurn={playersTurn}
                            handleCardOnClick={handleCardOnClick}
                            {...card}
                        />
                    ))}
                <div
                    onClick={
                        !nextButtonDisbaled
                            ? () => this.handleOnClickButton('next')
                            : null
                    }
                    className={
                        'button' + (nextButtonDisbaled ? ' disabled' : '')
                    }
                >
                    {'>'}
                </div>
            </div>
        );
    }
}

export default class Cards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHandOnMobile: false,
        };

        this.handleOnClickHandControls = this.handleOnClickHandControls.bind(
            this,
        );
    }

    handleOnClickHandControls() {
        this.setState({
            showHandOnMobile: !this.state.showHandOnMobile,
        });
    }

    render() {
        const { cards, playersTurn, handleCardOnClick, isMobile } = this.props;
        return (
            <React.Fragment>
                {isMobile ? (
                    <div className="hand-controls">
                        <span onClick={this.handleOnClickHandControls}>
                            {this.state.showHandOnMobile ? 'Hide' : 'Show'} hand
                        </span>
                    </div>
                ) : null}
                <div
                    className={
                        'hand' + (this.state.showHandOnMobile ? ' open' : '')
                    }
                >
                    {!isMobile ||
                    cards.filter(card => !card.played).length === 0 ? (
                        cards
                            .filter(card => !card.played)
                            .map(card => (
                                <Card
                                    key={card.id}
                                    playersTurn={playersTurn}
                                    handleCardOnClick={handleCardOnClick}
                                    {...card}
                                />
                            ))
                    ) : (
                        <CardsSlider cards={cards} {...this.props} />
                    )}
                </div>
            </React.Fragment>
        );
    }
}
