const clientID = "ioqz7wp3cbuen5pi9rol3nrzfjr2u0f";
const opts = {
    headers: {
        "Client-ID": clientID
    }
};

const Appbar = mui.react.Appbar,
      Button = mui.react.Button,
      Form = mui.react.Form,
      Container = mui.react.Container,
      Input = mui.react.Input,
      Panel = mui.react.Panel;

//TODO paginate
const getFeed = (username) => {
    return fetch("https://api.twitch.tv/kraken/users/" + username + "/follows/channels", opts)
        .then((response) => response.json())
        .then((json) => Promise.all(json.follows.map((follow) => fetch("https://api.twitch.tv/kraken/feed/" + follow.channel.name + "/posts", opts).then((response) => response.json(), () => []))))
        .then((rawPosts) => rawPosts.map((json) => {
            if(json.posts && json.posts.length) {
                return json.posts.map(function(post) {
                    post.date = Date.parse(post.created_at);
                    return post;
                });
            }
            else {
                return [];
            }
        }))
        .then((posts) => [].concat(...posts))
        .then((posts) => posts.sort((a, b) => b.date - a.date));
};

const Message = (props) => (
    <Panel>
        <header>
            <img height="70" width="70" className="mui--pull-left message-img" src={ props.avatar || "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_300x300.png" } />
            <cite><a href={ "https://twitch.tv/" + props.authorName }>{ props.author }</a></cite>
            <time datetime={ props.date } title={ new Date(props.date).toLocaleString() } className="mui--pull-right mui--text-dark-secondary">{ moment(props.date).fromNow() }</time>
        </header>
        <q>{ props.children }</q>
    </Panel>
);

const MessageFeed = (props) => {
    var messages = props.messages.map((message) => (
        <Message author={ message.user.display_name } avatar={ message.user.logo } authorName={ message.user.name } date={ message.date } key={ message.id }>
            { message.body }
        </Message>
    ));

    var msg = "";
    if(props.loading) {
        msg = "Loading...";
    }
    else if(!props.messages.length) {
        msg = "No channel feed messages from any followed channel for the current user";
    }
    var loading = msg != "" ? (<p className="mui--text-subhead mui--text-dark-secondary mui--text-center">{ msg }</p>) : "";

    return (
        <Container>
            <main>
                <div className="space"></div>
                { loading }
                { messages }
            </main>
        </Container>
    );
};

const Header = (props) => (
<Appbar className="mui--z1 sticky-appbar">
    <Container fluid={true} className="mui--appbar-height mui--appbar-line-height mui--align-middle">
        <h className="mui--text-title mui--hidden-xs">{ props.title }</h>
        <Form inline={true} onSubmit={ props.onSubmit } className="mui--pull-right mui--appbar-height navbar-form">
            <Input value={ props.username } hint="Twitch Username" onChange={ props.onChange } />
            <Button type="submit">Load</Button>
        </Form>
    </Container>
</Appbar>);

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.handleKeypress = this.handleKeypress.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.state = history.state || { data: [], usernameValue: "", loading: false };

        window.addEventListener("popstate", (e) => {
            this.setState(e.state);
        });

        setInterval(this.componentDidMount.bind(this), this.props.pollInterval);
    }
    componentDidMount() {
        if(this.state.usernameValue != "")
            this.handleRefresh({preventDefault: () => {}});
    }
    handleKeypress(e) {
        this.setState({ usernameValue: e.target.value });
    }
    setData(data) {
        let newState = {
            loading: false
        }
        if(data !== null)
            newState.data = data;

        this.setState(newState);
        if(data !== null) {
            if(history.state.usernameValue != this.state.usernameValue)
                history.pushState(this.state, this.state.usernameValue, window.location.toString());

            if(document.title.includes("-"))
                document.title = document.title.replace(/\-\s.+$/, "- " + this.state.usernameValue);
            else
                document.title = document.title + " - " + this.state.usernameValue;
        }
    }
    handleRefresh(e) {
        e.preventDefault();
        if(this.state.usernameValue != "") {
            this.setState({ loading: true });
            getFeed(this.state.usernameValue).then((messages) => {
                this.setData(messages);
            }, () => {
                this.setData(null);
            });
        }
        else {
            this.setData([]);
        }
    }
    render() {
        return (
            <div>
                <Header title="Consolidated Twitch Channel Feed" username={ this.state.usernameValue } onChange={ this.handleKeypress } onSubmit={ this.handleRefresh }/>
                <MessageFeed loading={ this.state.loading } messages={ this.state.data } />
            </div>
        );
    }
}

ReactDOM.render(<Page pollInterval={120000}/>, document.getElementById("content"));

