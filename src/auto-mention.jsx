import React from 'react';
import Mention from './mention.jsx';

const NO_RESULT = -1;
const START = 0;
/**
 * @typedef {Object} ReactNode
 */
/**
 * This converts @name into a link to name's channel. However usually those are
 * mentions of the Twitter usernames, which sometimes don't match up. In a perfect
 * world, Twitch would add some magic to fix that, but there are no mentions yet
 * in the Twitch world.
 *
 * @param {[ReactNode]} nodes - Nodes to convert mentions to links.
 * @returns {[ReactNode]} Array of nodes now with links instead of text
 *          for mentions.
 * @todo Fall back to Twitter if twitch user does not exist.
 */
export default (nodes) => {
    const ret = [];

    for(const n in nodes) {
        if(typeof nodes[n] == "string" && nodes[n].search(/@\S+/) != NO_RESULT) {
            let node = nodes[n];
            let result = node.search(/@\S+/);
            let offset = 0;
            while(result != NO_RESULT && node.length) {
                if(result > START) {
                    ret.push(node.slice(START, result));
                }
                const mention = node.match(/@\S+/).shift();
                ret.push(<Mention text={ mention } key={ `${n}:${offset + result}${mention}` }/>);

                if(result + mention.length < node.length) {
                    node = node.slice(result + mention.length);
                    offset += result + mention.length;
                    result = node.search(/@\S+/);
                }
                else {
                    node = "";
                    result = NO_RESULT;
                }
            }
            if(node.length) {
                ret.push(node);
            }
        }
        else {
            ret.push(nodes[n]);
        }
    }

    return ret;
};
