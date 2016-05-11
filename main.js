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

const Timestamp = (props) => (
    <time datetime={ props.date } title ={ new Date(props.date).toLocaleString() } className={ props.className }>{ moment(props.date).fromNow() }</time>
);

const Author = (props) => (
    <cite><a href={ "https://twitch.tv/" + props.slug }>{ props.author }</a></cite>
);

const AVATAR_SIZES = [ 50, 70, 150, 300, 600 ];
const Avatar = (props) => {
    const srcs = AVATAR_SIZES.map((s) => props.src.replace("300x300", s+"x"+s) + " "+s+"w");
    return (
        <img height={ props.height } width={ props.width } src={ props.src } srcset={ srcs.join(",") } sizes={ props.width + "w" } className={ props.className } />
    );
};

class MessageBody extends React.Component {
    render() {
        return (
            <span>{ ReactAutolink.autolink(this.props.body, { rel: "nofollow" }) }</span>
        );
    }
}

const Message = (props) => (
    <Panel>
        <header>
            <Avatar height="70" width="70" className="mui--pull-left message-img" src={ props.avatar || "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_300x300.png" } />
            <Author slug={ props.authorName } author={ props.author } />
            <Timestamp date={ props.date } className="mui--pull-right mui--text-dark-secondary" />
        </header>
        <q>{ props.children }</q>
    </Panel>
);

const MessageFeed = (props) => {
    var messages = props.messages.map((message) => (
        <Message author={ message.user.display_name } avatar={ message.user.logo } authorName={ message.user.name } date={ message.date } key={ message.id }>
            <MessageBody body={ message.body } />
        </Message>
    ));

    var msg = "";
    if(!props.messages.length) {
        msg = "No channel feed messages from any followed channel for the current user";
    }
    var info = msg != "" ? (<p className="mui--text-subhead mui--text-dark-secondary mui--text-center">{ msg }</p>) : "";

    return (
        <Container>
            <main>
                <div className="space"></div>
                { info }
                { messages }
            </main>
        </Container>
    );
};

class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.progress = new Mprogress({
            template: this.props.template,
            parent: "#" + this.props.parentId,
            start: this.props.running
        });
    }

    static get defaultProps() {
        return {
            template: 1,
            parentId: "progress",
            running: false
        };
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

const Header = (props) => (
<Appbar className="mui--z1 sticky-appbar">
    <Container fluid={true} className="mui--appbar-height mui--appbar-line-height mui--align-middle">
        <h className="mui--text-title mui--hidden-xs">{ props.title }</h>
        <Form inline={true} onSubmit={ props.onSubmit } className="mui--pull-right mui--appbar-height navbar-form">
            <Input value={ props.username } hint="Twitch Username" onChange={ props.onChange } />
            <Button type="submit">Load</Button>
        </Form>
    </Container>
    <ProgressBar running={ props.loading } template={3} />
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

        this.progress = new Mprogress({
            template: 4,
            parent: "#progress"
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
        if(data !== null) {
            this.setState({ data, loading: false });

            if(!history.state || history.state.usernameValue != this.state.usernameValue)
                history.pushState(this.state, this.state.usernameValue, window.location.toString());

            if(document.title.includes("-"))
                document.title = document.title.replace(/\-\s.+$/, "- " + this.state.usernameValue);
            else
                document.title = document.title + " - " + this.state.usernameValue;
        }
        else {
            this.setState({ loading: false });
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
                <Header title="Consolidated Twitch Channel Feed" username={ this.state.usernameValue } onChange={ this.handleKeypress } onSubmit={ this.handleRefresh } loading={ this.state.loading } />
                <MessageFeed messages={ this.state.data } />
                <footer className="main-footer">
                    <Container className="mui--text-center mui--text-light-secondary">
                        <a href="https://reactjs.com">React</a> thing with <a href="https://www.muicss.com">MUICSS</a>. Source code on <a href="https://github.com/freaktechnik/twitch-feed">GitHub</a>.
                    </Container>
                </footer>
            </div>
        );
    }
}

ReactDOM.render(<Page pollInterval={120000}/>, document.getElementById("content"));

