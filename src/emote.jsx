import React from 'react';
import { emoteSizes, emoteBaseUrl } from './config.json';
import PropTypes from 'prop-types';

const Emote = (props) => {
    const emoteUrl = `${emoteBaseUrl + props.emoteId}/`;
    const urls = emoteSizes.map((s, i) => `${emoteUrl + s} ${++i}x`);
    return (
        <img src={ `${emoteUrl}1.0` } srcSet={ urls.join(",") } alt={ props.sourceText } title={ props.sourceText } width={ props.width } height={ props.height } />
    );
};
Emote.propTypes = {
    emoteId: PropTypes.number.isRequired,
    sourceText: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number
};

export default Emote;
