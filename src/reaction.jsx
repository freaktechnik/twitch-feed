import React from 'react';
import Emote from './emote.jsx';
import PropTypes from 'prop-types';

const ReactionSchema = {
    emote: PropTypes.string,
    emoteId: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired
};

export const ReactionShape = PropTypes.shape(ReactionSchema);

export const Reaction = (props) => (
    <li className="reaction"><Emote emoteId={ props.emoteId } sourceText={ props.emote } height={16} />&nbsp;<b className="mui--text-dark-secondary">{ props.count }</b></li>
);
Reaction.propTypes = ReactionSchema;
