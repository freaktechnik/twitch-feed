import React from 'react';
import Channel from './channel.jsx';

const Mention = (props) => {
    var slug = props.text.toLowerCase();
    if(slug.startsWith("@")) {
        slug = slug.substr(1);
    }

    return ( <Channel slug={ slug } author={ props.text }/> );
};
Mention.propTypes = {
    text: React.PropTypes.string.isRequired
};
export default Mention;
