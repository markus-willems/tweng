import React from 'react';

const CardMenu = ({ cardId, menuIsOpen, handleCardOnClick }) => {
    return (
        <div
            style={{ display: menuIsOpen ? 'block' : 'none' }}
            className="card-menu"
        >
            <span onClick={() => handleCardOnClick(cardId)}>▲</span>
        </div>
    );
};

export default class Card extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuIsOpen: false,
        };

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        this.setState(prevState => ({
            menuIsOpen: !prevState.menuIsOpen,
        }));
    }

    render() {
        const {
            type,
            strength,
            id,
            category,
            playerId,
            played,
            handleCardOnClick,
            playersTurn,
        } = this.props;
        return (
            <div
                onClick={!played && playersTurn ? this.handleOnClick : null}
                className="card"
            >
                {!played && playersTurn ? (
                    <CardMenu
                        cardId={id}
                        handleCardOnClick={handleCardOnClick}
                        menuIsOpen={this.state.menuIsOpen}
                    />
                ) : null}
                <div className="card-image">
                    <img
                        src={require(`../assets/images/${type}.svg`)}
                        alt={type}
                    />
                </div>
                {category === 'attack' ? (
                    <div className="card-strength">{strength}</div>
                ) : null}
            </div>
        );
    }
}
