import React from 'react';

const Channel = (props) => {
    var author = props.author || props.slug;
    var tooltipAuthor = author.startsWith("@") ? author.substr(1) : author;

    return ( <a href={ "https://twitch.tv/" + props.slug } title={ tooltipAuthor + " on Twitch" }>{ author }</a> );
};
Channel.propTypes = {
    slug: React.PropTypes.string.isRequired,
    author: React.PropTypes.string
};
export default Channel;
