import React from 'react';
import Mention from './mention.jsx';

/**
 * This converts @name into a link to name's channel. However usually those are
 * mentions of the Twitter usernames, which sometimes don't match up. In a perfect
 * world, Twitch would add some magic to fix that, but there are no mentions yet
 * in the Twitch world.
 */
export default (nodes) => {
    var ret = [];

    for(var n in nodes) {
        if(typeof nodes[n] == "string" && nodes[n].search(/@\S+/) != -1) {
            var node = nodes[n];
            var result = node.search(/@\S+/);
            var offset = 0;
            while(result != -1 && node.length) {
                if(result > 0) {
                    ret.push(node.slice(0, result));
                }
                var mention = node.match(/@\S+/)[0];
                ret.push(<Mention text={ mention } key={ n+":"+(offset+result)+mention }/>);

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
