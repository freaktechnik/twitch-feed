import React from 'react';
import Container from 'muicss/lib/react/container';
import Message from './message.jsx';
import MessageBody from './message-body.jsx';
import PropTypes from 'prop-types';

const ENDORSE_EMOTE = 1;

const MessageFeed = (props) => {
    let messages;
    if(props.messages) {
        messages = props.messages.map((message) => {
            let reactions = Object.keys(message.reactions).map((k) => {
                let id = parseInt(k, 10);
                if(k == "endorse") {
                    id = ENDORSE_EMOTE;
                }

                const reaction = message.reactions[k];
                reaction.key = id;
                return reaction;
            });
            if(!reactions.length) {
                reactions = [ {
                    key: 1,
                    emote: "endorse",
                    count: 0
                } ];
            }
            return (
                <Message author={ message.user.display_name } avatar={ message.user.logo } authorName={ message.user.name } date={ message.date } key={ message.id } id={ message.id } reactions={ reactions }>
                    <MessageBody body={ message.body } emotes={ message.emotes } cite={ `https://twitch.tv/${message.user.name}/p/${message.id}` }/>
                </Message>
            );
        });
    }

    let msg = "";
    if(props.messages === null) {
        msg = "User is not known to Twitch";
    }
    else if(!props.messages.length) {
        msg = "No channel feed messages from any followed channel for the current user";
    }
    const info = msg != "" ? (<p className="mui--text-subhead mui--text-dark-secondary mui--text-center">{ msg }</p>) : "";

    return (
        <Container>
            <main>
                <div className="space"></div>
                { info }
                { messages }
            </main>
        </Container>
    );
};
MessageFeed.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({
        emotes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)),
        reactions: PropTypes.objectOf(PropTypes.shape({
            emote: PropTypes.string.isRequired,
            count: PropTypes.number.isRequired
        })),
        user: PropTypes.shape({
            'display_name': PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            logo: PropTypes.string
        }).isRequired,
        'created_at': PropTypes.string.isRequired,
        id: PropTypes.node,
        body: PropTypes.node
    }))
};
export default MessageFeed;
