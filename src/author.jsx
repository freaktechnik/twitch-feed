import React from 'react';
import Channel from './channel.jsx';

const Author = (props) => (
    <cite><Channel slug={ props.slug } author={ props.author }/></cite>
);
Author.propTypes = {
    slug: React.PropTypes.string.isRequired,
    author: React.PropTypes.string.isRequired
};
export default Author;
