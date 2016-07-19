import React from 'react';

const ReactionsOverflow = (props) => {
    const content = props.reactions.length ? [
        "⋮",
        (<div className="reactions-popup mui--z2" tabIndex="0">
            <ul className="mui-list--unstyled">
                { props.reactions }
            </ul>
        </div>)
    ] : [];
    const tabindex = Math.sign(props.reactions.length) - 1;
    return (<div className="reactions-more" tabIndex={ tabindex }>
        { content }
    </div>);
};
ReactionsOverflow.propTypes = {
    reactions: React.PropTypes.arrayOf(React.PropTypes.node).isRequired
};
export default ReactionsOverflow;
