import React from 'react';
import Emote from './emote.jsx';
import ReactAutolink from 'react-autolink';
import autoMention from './auto-mention.jsx';

const MessageBody = (props) => {
    let msg = [props.body];
    let offset = 0;
    props.emotes.sort((a, b) => {
        return a.start - b.start;
    }).forEach((emote) => {
        const initialMsg = msg[msg.length-1];
        if(emote.start > 0)
            msg[msg.length-1] = initialMsg.substring(0, emote.start + offset);
        else
            msg = [];

        const emoteName = initialMsg.substring(emote.start + offset, emote.end + offset + 1);
        msg.push(<Emote emoteId={ emote.id } sourceText={ emoteName } />);

        msg.push(initialMsg.substring(emote.end + offset + 1));

        if(emote.start > 0)
            offset -= msg[msg.length - 3].length;
        offset -= emoteName.length;
    });

    const linkOpts = { rel: "nofollow" };
    msg = [].concat(...msg.map((m) => {
        if(typeof m == "string")
            return m.split("\n");
        else
            return m;
    }));

    const paragraphs = [];
    let currentParagraph = 0;
    for(let i = 0; i < msg.length; ++i) {
        let c = msg[i];
        if(!paragraphs[currentParagraph])
            paragraphs[currentParagraph] = [];

        if(typeof c == "string") {
            var processed = autoMention(ReactAutolink.autolink(c, linkOpts));
            paragraphs[currentParagraph].push(...processed);
            if(i + 1 < msg.length && typeof msg[i+1] == "string")
                ++currentParagraph;
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
    body: React.PropTypes.string.isRequired,
    emotes: React.PropTypes.arrayOf(React.PropTypes.objectOf(React.PropTypes.number)).isRequired,
    cite: React.PropTypes.string
};
export default MessageBody;
