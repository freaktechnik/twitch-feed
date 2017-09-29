import React from 'react';
import { avatarSizes } from './config.json';
import PropTypes from 'prop-types';

const Avatar = (props) => {
    const srcs = avatarSizes.map((s) => `${props.src.replace("300x300", `${s}x${s}`)} ${s}w`);
    return (
        <img height={ props.height } width={ props.width } src={ props.src } srcSet={ srcs.join(",") } sizes={ `${props.width}px` } className={ props.className } />
    );
};
Avatar.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
    className: PropTypes.string
};
export default Avatar;
