import React from 'react';
import Mprogress from 'mprogress/build/js/mprogress';
import PropTypes from 'prop-types';


export default class ProgressBar extends React.Component {
    static get propTypes() {
        return {
            running: PropTypes.bool,
            parentId: PropTypes.string,
            template: PropTypes.number
        };
    }

    static get defaultProps() {
        return {
            template: 1,
            parentId: "progress",
            running: false
        };
    }

    constructor(props) {
        super(props);
        this.progress = new Mprogress({
            template: this.props.template,
            parent: `#${this.props.parentId}`,
            start: this.props.running
        });
    }

    componentWillUnmount() {
        this.progress.end();
    }

    render() {
        if(this.props.running) {
            this.progress.start();
        }
        else {
            this.progress.end();
        }

        return (
            <div id={ this.props.parentId }></div>
        );
    }
}
