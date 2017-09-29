import React from 'react';
import Panel from 'muicss/lib/react/panel';
import Divider from 'muicss/lib/react/divider';
import PropTypes from 'prop-types';

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
            <a href={ `https://twitch.tv/${props.authorName}/p/${props.id}` } rel="noopener" target="_blank" className="mui--pull-right mui--text-dark-secondary"><Timestamp date={ props.date } /></a>
        </header>
        <div className="message-container">
            <Divider/>
            { props.children }
            <Reactions reactions={ props.reactions } />
        </div>
    </Panel>
);
Message.propTypes = {
    avatar: PropTypes.string,
    authorName: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
    reactions: PropTypes.arrayOf(ReactionShape).isRequired,
    id: PropTypes.node.isRequired,
    children: PropTypes.element
};

export default Message;
