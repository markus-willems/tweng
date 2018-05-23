import React from 'react';
import ClipboardJS from 'clipboard';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            linkCopied: false,
        };
    }

    componentDidUpdate() {
        if (this.props.inviteLink) {
            const clipboard = new ClipboardJS('.copy');
            clipboard.on('success', () => {
                this.setState({
                    linkCopied: true,
                });
            });
        }
    }

    renderForm() {
        return (
            <form onSubmit={this.props.handleOnSubmitForm}>
                <div className="login-element">
                    <input
                        name="username"
                        className="input"
                        onChange={this.props.handleOnEvent}
                        value={this.props.username}
                        placeholder="Username"
                    />
                </div>
                <div className="login-element">
                    <button className="btn-primary">
                        {this.props.isInvite ? 'Join' : 'Create'} match
                    </button>
                </div>
            </form>
        );
    }

    renderReady() {
        return (
            <div className="login-element">
                <button
                    onClick={e =>
                        this.props.handleOnEvent(e, true, 'playerReady')
                    }
                    name="playerIsReady"
                    className="btn-secondary"
                >
                    Start match!
                </button>
            </div>
        );
    }

    renderInvite() {
        return (
            <React.Fragment>
                <div className="login-element">
                    <input
                        id="invitelink"
                        value={this.props.inviteLink}
                        readOnly
                    />
                </div>
                <div className="login-element">
                    <button
                        className="btn-primary copy"
                        data-clipboard-target="#invitelink"
                    >
                        Copy invite link
                    </button>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const {
            playerHasJoined,
            isInvite,
            inviteLink,
            playerIsReady,
        } = this.props;

        return (
            <React.Fragment>
                {/* !playerIsReady ? (
                    <div className="login">
                        <h2>{isInvite ? 'Join' : 'Create'}</h2>
                        {inviteLink ? (
                            <React.Fragment>
                                {this.renderInvite()}
                                {this.renderReady()}
                                {this.state.linkCopied ? 'Link copied!' : ''}
                            </React.Fragment>
                        ) : (
                            this.renderForm()
                        )}
                    </div>
                ) : null */}
                {!playerIsReady ? (
                    <div className="login">
                        <h2>{isInvite ? 'Join' : 'Create'}</h2>
                        {inviteLink ? this.renderInvite() : null}
                        {playerHasJoined ? this.renderReady() : null}
                        {!playerHasJoined ? this.renderForm() : null}
                        {this.state.linkCopied ? 'Link copied!' : ''}
                    </div>
                ) : null}
            </React.Fragment>
        );
    }
}
