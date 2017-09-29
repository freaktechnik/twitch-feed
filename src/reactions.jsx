import React from 'react';
import PropTypes from 'prop-types';

import { Reaction, ReactionShape } from './reaction.jsx';
import ReactionsOverflow from './reactions-overflow.jsx';

import { maxReactions } from './config.json';

const START = 0;

const Reactions = (props) => {
    const reactions = props.reactions.sort((a, b) => {
        if(a.emote == "endorse") {
            return Number.MIN_SAFE_INTEGER;
        }
        else if(b.emote == "endorse") {
            return Number.MAX_SAFE_INTEGER;
        }
        return b.count - a.count;
    });
    const getReaction = (r) => (<Reaction emoteId={ r.key } emote={ r.emote } count={ r.count } key={ r.key } />);

    const visibleReactions = reactions.slice(START, maxReactions).map(getReaction);
    const extraReactions = reactions.slice(maxReactions).map(getReaction);
    return (
        <aside>
            <ul className="mui-list--inline reactions">
                { visibleReactions }
            </ul>
            <ReactionsOverflow reactions={ extraReactions }/>
        </aside>
    );
};
Reactions.propTypes = {
    reactions: PropTypes.arrayOf(ReactionShape).isRequired
};
export default Reactions;
