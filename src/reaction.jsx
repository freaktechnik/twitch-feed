import React from 'react';
import Emote from './emote.jsx';

const ReactionSchema = {
    key: React.PropTypes.number.isRequired,
    emote: React.PropTypes.string,
    count: React.PropTypes.number.isRequired
};

export const ReactionShape = React.PropTypes.shape(ReactionSchema);

export const Reaction = (props) => (
    <li className="reaction"><Emote emoteId={ props.emoteId } sourceText={ props.emote } height={16} />&nbsp;<b className="mui--text-dark-secondary">{ props.count }</b></li>
);
Reaction.propTypes = ReactionSchema;
