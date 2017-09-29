import React from 'react';
import Container from 'muicss/lib/react/container';
import Header from './header.jsx';
import MessageFeed from './message-feed.jsx';
import PropTypes from 'prop-types';

import { getFeed } from './twitch-api';

export default class Page extends React.Component {
    constructor(props) {
        super(props);
        this.handleKeypress = this.handleKeypress.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);
        this.handlePopstate = this.handlePopstate.bind(this);
        this.state = history.state || {
            data: [],
            usernameValue: "",
            loading: false,
            loadingUsername: ""
        };
        this.state.loadingUsername = this.state.usernameValue;

        document.title = props.title;
        if(this.state.loadingUsername != "") {
            document.title = `${document.title} - ${this.state.loadingUsername}`;
        }

        setInterval(() => {
            this.refresh(this.state.loadingUsername);
        }, this.props.pollInterval);
    }

    static get propTypes() {
        return {
            pollInterval: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired
        };
    }

    componentDidMount() {
        if(this.state.usernameValue != "") {
            this.refresh(this.state.usernameValue);
        }

        document.addEventListener("keypress", this.handleKeyboard, true);
        window.addEventListener("popstate", this.handlePopstate, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keypress", this.handleKeyboard, true);
        window.removeEventListener("popstate", this.handlePopstate, false);
    }

    handlePopstate(e) {
        this.setState(e.state);
    }

    handleKeyboard(e) {
        if(e.key == "r" && e.ctrlKey) {
            e.preventDefault();
            this.refresh(this.state.usernameValue);
        }
    }
    handleKeypress(e) {
        this.setState({ usernameValue: e.target.value });
    }
    setData(data) {
        this.setState({
            data,
            loading: false
        });
        if(data !== null) {
            if(!history.state || history.state.loadingUsername != this.state.loadingUsername) {
                history.pushState(this.state, this.state.loadingUsername, window.location.toString());
            }
            else if(history.state.loadingUsername == this.state.loadingUsername) {
                history.replaceState(this.state, this.state.loadingUsername, window.location.toString());
            }

            if(document.title.includes(" - ")) {
                document.title = document.title.replace(/-\s.+$/, `- ${this.state.loadingUsername}`);
            }
            else {
                document.title = `${document.title} - ${this.state.loadingUsername}`;
            }
        }
    }
    refresh(username) {
        if(username != "") {
            this.setState({
                loading: true,
                loadingUsername: username
            });
            getFeed(username)
                .then((messages) => {
                    if(this.state.loadingUsername != username) {
                        return;
                    }
                    this.setData(messages);
                })
                .catch(() => {
                    if(this.state.loadingUsername != username) {
                        return;
                    }
                    this.setData(null);
                });
        }
        else {
            this.setData([]);
        }
    }
    handleRefresh(e) {
        e.preventDefault();
        this.refresh(this.state.usernameValue);
    }
    render() {
        return (
            <div>
                <Header title={ this.props.title } username={ this.state.usernameValue } onChange={ this.handleKeypress } onSubmit={ this.handleRefresh } loading={ this.state.loading } />
                <MessageFeed messages={ this.state.data } />
                <footer className="main-footer">
                    <Container className="mui--text-center mui--text-light-secondary">
                        <a href="https://reactjs.com">React</a> thing with <a href="https://www.muicss.com">MUICSS</a>. Source code on <a href="https://github.com/freaktechnik/twitch-feed">GitHub</a>.
                    </Container>
                </footer>
            </div>
        );
    }
}
