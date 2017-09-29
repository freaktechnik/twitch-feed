import React from 'react';
import PropTypes from 'prop-types';

const MENTION = "@";

const Channel = (props) => {
    const author = props.author || props.slug;
    const tooltipAuthor = author.startsWith(MENTION) ? author.substr(MENTION.length) : author;

    return ( <a href={ `https://twitch.tv/${props.slug}` } title={ `${tooltipAuthor} on Twitch` }>{ author }</a> );
};
Channel.propTypes = {
    slug: PropTypes.string.isRequired,
    author: PropTypes.string
};
export default Channel;
