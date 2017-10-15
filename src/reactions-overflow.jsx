import React from 'react';
import PropTypes from 'prop-types';

const DECREMENT = -1;

const ReactionsOverflow = (props) => {
    const content = props.reactions.length ? [
        "⋮",
        ( <div className="reactions-popup mui--z2" tabIndex="0" key="reactions" role="button">
            <ul className="mui-list--unstyled">
                { props.reactions }
            </ul>
        </div> )
    ] : [];
    const tabindex = Math.sign(props.reactions.length) + DECREMENT;
    return (<div className="reactions-more" tabIndex={ tabindex }>
        { content }
    </div>);
};
ReactionsOverflow.propTypes = {
    reactions: PropTypes.arrayOf(PropTypes.node).isRequired
};
export default ReactionsOverflow;
