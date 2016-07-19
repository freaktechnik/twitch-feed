import React from 'react';
import moment from 'moment';

const Timestamp = (props) => (
    <time dateTime={ props.date } title ={ new Date(props.date).toLocaleString() } className={ props.className }>{ moment(props.date).fromNow() }</time>
);
Timestamp.propTypes = {
    date: React.PropTypes.number.isRequired,
    className: React.PropTypes.string
};
export default Timestamp;
