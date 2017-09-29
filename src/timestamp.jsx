import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const Timestamp = (props) => (
    <time dateTime={ props.date } title ={ new Date(props.date).toLocaleString() } className={ props.className }>{ moment(props.date).fromNow() }</time>
);
Timestamp.propTypes = {
    date: PropTypes.number.isRequired,
    className: PropTypes.string
};
export default Timestamp;
