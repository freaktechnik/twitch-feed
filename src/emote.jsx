import React from 'react';
import { emoteSizes, emoteBaseUrl } from './config.json';

const Emote = (props) => {
    const emoteUrl = emoteBaseUrl + props.emoteId + "/";
    const urls = emoteSizes.map((s, i) => emoteUrl + s + " " + (i+1) + "x");
    return (
        <img src={ emoteUrl+"1.0" } srcSet={ urls.join(",") } alt={ props.sourceText } title={ props.sourceText } width={ props.width } height={ props.height } />
    );
};
Emote.propTypes = {
    emoteId: React.PropTypes.number.isRequired,
    sourceText: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number
};

export default Emote;
