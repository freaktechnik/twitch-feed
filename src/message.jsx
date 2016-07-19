import React from 'react';
import Panel from 'muicss/lib/react/panel';
import Divider from 'muicss/lib/react/divider';

import Avatar from './avatar.jsx';
import Author from './author.jsx';
import Timestamp from './timestamp.jsx';
import Reactions from './reactions.jsx';
import { ReactionShape } from './reaction.jsx';

import { defaultAvatar } from './config.json';

const Message = (props) => (
    <Panel>
        <header>
            <Avatar height={70} width={70} className="mui--pull-left message-img" src={ props.avatar || defaultAvatar } />
            <Author slug={ props.authorName } author={ props.author } />
            <a href={ "https://twitch.tv/" + props.authorName + "/p/" + props.id } rel="noopener" target="_blank" className="mui--pull-right mui--text-dark-secondary"><Timestamp date={ props.date } /></a>
        </header>
        <div className="message-container">
            <Divider/>
            { props.children }
            <Reactions reactions={ props.reactions } />
        </div>
    </Panel>
);
Message.propTypes = {
    avatar: React.PropTypes.string,
    authorName: React.PropTypes.string.isRequired,
    author: React.PropTypes.string.isRequired,
    date: React.PropTypes.number.isRequired,
    reactions: React.PropTypes.arrayOf(ReactionShape).isRequired,
    id: React.PropTypes.node.isRequired
};

export default Message;
