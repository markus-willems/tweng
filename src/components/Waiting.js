import React from 'react';

export default class Waiting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dots: '.',
        };
    }

    componentDidMount() {
        this.intervalId = setInterval(() => {
            let newDots = '';
            if (this.state.dots.length > 2) {
                newDots = '.';
            } else {
                newDots = this.state.dots + '.';
            }
            this.setState({
                dots: newDots,
            });
        }, 750);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        return (
            <div className="waiting">{`Waiting for opponent${
                this.state.dots
            }`}</div>
        );
    }
}
