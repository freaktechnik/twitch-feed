import React from 'react';
import { avatarSizes } from './config.json';

const Avatar = (props) => {
    const srcs = avatarSizes.map((s) => props.src.replace("300x300", s+"x"+s) + " "+s+"w");
    return (
        <img height={ props.height } width={ props.width } src={ props.src } srcSet={ srcs.join(",") } sizes={ props.width + "px" } className={ props.className } />
    );
};
Avatar.propTypes = {
    height: React.PropTypes.number,
    width: React.PropTypes.number.isRequired,
    src: React.PropTypes.string.isRequired,
    className: React.PropTypes.string
};
export default Avatar;
