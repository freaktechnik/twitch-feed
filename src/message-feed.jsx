import React from 'react';
import Container from 'muicss/lib/react/container';
import Message from './message.jsx';
import MessageBody from './message-body.jsx';

const MessageFeed = (props) => {
    if(props.messages) {
        var messages = props.messages.map((message) => {
            let reactions = Object.keys(message.reactions).map((k) => {
                let id = parseInt(k, 10);
                if(k == "endorse")
                    id = 1;

                let reaction = message.reactions[k];
                reaction.key = id;
                return reaction;
            });
            if(reactions.length == 0) {
                reactions = [
                    {
                        key: 1,
                        emote: "endorse",
                        count: 0
                    }
                ];
            }
            return (
                <Message author={ message.user.display_name } avatar={ message.user.logo } authorName={ message.user.name } date={ message.date } key={ message.id } id={ message.id } reactions={ reactions }>
                    <MessageBody body={ message.body } emotes={ message.emotes } cite={ "https://twitch.tv/" + message.user.name + "/p/" + message.id }/>
                </Message>
            )
        });
    }

    var msg = "";
    if(props.messages === null) {
        msg = "User is not known to Twitch";
    }
    else if(!props.messages.length) {
        msg = "No channel feed messages from any followed channel for the current user";
    }
    var info = msg != "" ? (<p className="mui--text-subhead mui--text-dark-secondary mui--text-center">{ msg }</p>) : "";

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
    messages: React.PropTypes.arrayOf(React.PropTypes.shape({
        emotes: React.PropTypes.arrayOf(React.PropTypes.objectOf(React.PropTypes.number)),
        reactions: React.PropTypes.objectOf(React.PropTypes.shape({
            emote: React.PropTypes.string.isRequired,
            count: React.PropTypes.number.isRequired
        })),
        user: React.PropTypes.shape({
            display_name: React.PropTypes.string.isRequired,
            name: React.PropTypes.string.isRequired,
            logo: React.PropTypes.string
        }).isRequired,
        created_at: React.PropTypes.string.isRequired,
        id: React.PropTypes.node,
        body: React.PropTypes.node
    })),
};
export default MessageFeed;
