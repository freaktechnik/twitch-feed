import React from 'react';
import Mention from './mention.jsx';

/**
 * This converts @name into a link to name's channel. However usually those are
 * mentions of the Twitter usernames, which sometimes don't match up. In a perfect
 * world, Twitch would add some magic to fix that, but there are no mentions yet
 * in the Twitch world.
 *
 * @param {Array.<ReactNode>} nodes - Nodes to convert mentions to links.
 * @returns {Array.<ReactNode>} Array of nodes now with links instead of text
 *          for mentions.
 * @todo Fall back to Twitter if twitch user does not exist.
 */
export default (nodes) => {
    const ret = [];

    for(const n in nodes) {
        if(typeof nodes[n] == "string" && nodes[n].search(/@\S+/) != -1) {
            let node = nodes[n];
            let result = node.search(/@\S+/);
            let offset = 0;
            while(result != -1 && node.length) {
                if(result > 0) {
                    ret.push(node.slice(0, result));
                }
                const mention = node.match(/@\S+/)[0];
                ret.push(<Mention text={ mention } key={ n + ":" + (offset + result) + mention }/>);

                if(result + mention.length < node.length) {
                    node = node.slice(result + mention.length);
                    offset += result + mention.length;
                    result = node.search(/@\S+/);
                }
                else {
                    node = "";
                    result = -1;
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
