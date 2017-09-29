import React from 'react';
import Channel from './channel.jsx';
import PropTypes from 'prop-types';

const Author = (props) => (
    <cite><Channel slug={ props.slug } author={ props.author }/></cite>
);
Author.propTypes = {
    slug: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired
};
export default Author;
