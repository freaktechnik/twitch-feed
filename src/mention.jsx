import React from 'react';
import Channel from './channel.jsx';
import PropTypes from 'prop-types';

const MENTION = "@";

const Mention = (props) => {
    let slug = props.text.toLowerCase();
    if(slug.startsWith(MENTION)) {
        slug = slug.substr(MENTION.length);
    }

    return ( <Channel slug={ slug } author={ props.text }/> );
};
Mention.propTypes = {
    text: PropTypes.string.isRequired
};
export default Mention;
