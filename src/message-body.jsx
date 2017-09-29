import React from 'react';
import Emote from './emote.jsx';
import ReactAutolink from 'react-autolink';
import autoMention from './auto-mention.jsx';
import PropTypes from 'prop-types';

const START = 0;
const EXTRA = 1;
const TO_PREVIOUS = 3;

const MessageBody = (props) => {
    let msg = [ props.body ];
    let offset = 0;
    props.emotes.sort((a, b) => a.start - b.start).forEach((emote) => {
        const initialMsg = msg[--msg.length];
        if(emote.start) {
            msg[--msg.length] = initialMsg.substring(START, emote.start + offset);
        }
        else {
            msg = [];
        }

        const emoteName = initialMsg.substring(emote.start + offset, emote.end + offset + EXTRA);
        msg.push(<Emote emoteId={ emote.id } sourceText={ emoteName } />);

        msg.push(initialMsg.substring(emote.end + offset + EXTRA));

        if(emote.start) {
            offset -= msg[msg.length - TO_PREVIOUS].length;
        }
        offset -= emoteName.length;
    });

    const linkOpts = { rel: "nofollow" };
    msg = [].concat(...msg.map((m) => {
        if(typeof m == "string") {
            return m.split("\n");
        }
        return m;
    }));

    const paragraphs = [];
    let currentParagraph = 0;
    for(let i = 0; i < msg.length; ++i) {
        const c = msg[i];
        if(!paragraphs[currentParagraph]) {
            paragraphs[currentParagraph] = [];
        }

        if(typeof c == "string") {
            const processed = autoMention(ReactAutolink.autolink(c, linkOpts));
            paragraphs[currentParagraph].push(...processed);
            if(i + EXTRA < msg.length && typeof msg[i + EXTRA] == "string") {
                ++currentParagraph;
            }
        }
        else {
            paragraphs[currentParagraph].push(c);
        }
    }
    const finalMsg = paragraphs.map((p, i) => (<p key={ i }>{ [].concat(...p) }</p>));

    return (
        <blockquote cite={ props.cite }>{ finalMsg }</blockquote>
    );
};
MessageBody.propTypes = {
    body: PropTypes.string.isRequired,
    emotes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)).isRequired,
    cite: PropTypes.string
};
export default MessageBody;
