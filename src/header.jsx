import React from 'react';
import Appbar from "muicss/lib/react/appbar";
import Button from "muicss/lib/react/button";
import Form from "muicss/lib/react/form";
import Container from "muicss/lib/react/container";
import Input from "muicss/lib/react/input";
import ProgressBar from './progress-bar.jsx';

const Header = (props) => (
<Appbar className="mui--z2 sticky-appbar">
    <Container fluid={true} className="mui--appbar-height mui--appbar-line-height mui--align-middle">
        <h className="mui--text-title mui--hidden-xs">{ props.title }</h>
        <Form inline={true} onSubmit={ props.onSubmit } className="mui--pull-right mui--appbar-height navbar-form">
            <Input value={ props.username } hint="Twitch Username" onChange={ props.onChange } />
            <Button type="submit">Load</Button>
        </Form>
    </Container>
    <ProgressBar running={ props.loading } template={3} />
</Appbar>);
Header.propTypes = {
    onSubmit: React.PropTypes.func,
    onChange: React.PropTypes.func,
    loading: React.PropTypes.bool,
    username: React.PropTypes.string,
    title: React.PropTypes.node.isRequired
};
export default Header;
