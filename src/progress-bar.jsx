import React from 'react';
import Mprogress from 'mprogress/build/js/mprogress';


export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.progress = new Mprogress({
            template: this.props.template,
            parent: "#" + this.props.parentId,
            start: this.props.running
        });
    }

    static get propTypes() {
        return {
            running: React.PropTypes.bool,
            parentId: React.PropTypes.string,
            template: React.PropTypes.number
        };
    }

    static get defaultProps() {
        return {
            template: 1,
            parentId: "progress",
            running: false
        };
    }

    componentWillUnmount() {
        this.progress.end();
    }

    render() {
        if(this.props.running)
            this.progress.start();
        else
            this.progress.end();

        return (
            <div id={ this.props.parentId }></div>
        );
    }
}