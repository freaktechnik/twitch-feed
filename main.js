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
const FOLLOWS_LIMIT = 100;
const getFollows = (username, page = 1) => {
    return fetch("https://api.twitch.tv/kraken/users/" + username.toLowerCase() + "/follows/channels?limit="+FOLLOWS_LIMIT+"&offset="+((page-1)*FOLLOWS_LIMIT), opts)
        .then((response) => response.json())
        .then((json) => {
            if(json._total > page * FOLLOWS_LIMIT) {
                return getFollows(username, page + 1).then((follows) => {
                    return json.follows.concat(follows);
                });
            }
            return json.follows;
        });
};
const getPosts = (username) => {
    return fetch("https://api.twitch.tv/kraken/feed/" + username + "/posts", opts)
        .then((response) => response.json(), () => ({ posts: [] }))
        .then((json) => {
            if("error" in json) {
                return [];
            }
            else {
                return json.posts.map((post) => {
                    post.date = Date.parse(post.created_at);
                    return post;
                });
            }
        });
};
const getFeed = (username) => {
    return getFollows(username)
        .then((follows) => Promise.all(follows.map((follow) => getPosts(follow.channel.name))))
        .then((posts) => [].concat(...posts))
        .then((posts) => posts.sort((a, b) => b.date - a.date));
};

const EMOTE_SIZES = [ "1.0", "2.0", "3.0" ];
const EMOTE_BASE_URL = "https://static-cdn.jtvnw.net/emoticons/v1/";
const Emote = (props) => {
    const emoteUrl = EMOTE_BASE_URL + props.emoteId + "/";
    const urls = EMOTE_SIZES.map((s, i) => emoteUrl + s + " " + (i+1) + "x");
    return (
        <img src={ emoteUrl+"1.0" } srcSet={ urls.join(",") } alt={ props.sourceText } title={ props.sourceText } />
    );
};

const Reaction = (props) => (
    <li className="reaction"><Emote emoteId={ props.emoteId } sourceText={ props.emote } />&nbsp;<b className="mui--text-dark-secondary">{ props.count }</b></li>
);

const Reactions = (props) => {
    const reactions = props.reactions.map((r) => (<Reaction emoteId={ r.key } emote={ r.emote } count={ r.count } key={ r.key } />));
    return (
        <ul className="mui-list--inline reactions">
            { reactions }
        </ul>
    );
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
        <img height={ props.height } width={ props.width } src={ props.src } srcSet={ srcs.join(",") } sizes={ props.width + "w" } className={ props.className } />
    );
};

const MessageBody = (props) => {
    let msg = [props.body];
    let offset = 0;
    props.emotes.sort((a, b) => {
        return a.start - b.start;
    }).forEach((emote) => {
        const initialMsg = msg[msg.length-1];
        if(emote.start > 0)
            msg[msg.length-1] = initialMsg.substring(0, emote.start + offset);
        else
            msg = [];

        const emoteName = initialMsg.substring(emote.start + offset, emote.end + offset + 1);
        msg.push(<Emote emoteId={ emote.id } sourceText={ emoteName } />);

        msg.push(initialMsg.substring(emote.end + offset + 1));

        if(emote.start > 0)
            offset -= msg[msg.length - 3].length;
        offset -= emoteName.length;
    });

    const linkOpts = { rel: "nofollow" };
    const finalMsg = msg.reduce((p, c) => {
        if(typeof c === "string") {
            p.push(...ReactAutolink.autolink(c, linkOpts));
        }
        else {
            p.push(c);
        }
        return p;
    }, []);

    return (
        <span>{ finalMsg }</span>
    );
};

const Message = (props) => (
    <Panel>
        <header>
            <Avatar height="70" width="70" className="mui--pull-left message-img" src={ props.avatar || "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_300x300.png" } />
            <Author slug={ props.authorName } author={ props.author } />
            <Timestamp date={ props.date } className="mui--pull-right mui--text-dark-secondary" />
        </header>
        <q>{ props.children }</q>
        <Reactions reactions={ props.reactions } />
    </Panel>
);

const MAX_REACTIONS = 9;
const MessageFeed = (props) => {
    var messages = props.messages.map((message) => {
        let reactions = Object.keys(message.reactions).map((k) => {
            let id = parseInt(k, 10);
            if(k == "endorse")
                id = 1;

            let reaction = message.reactions[k];
            reaction.key = id;
            return reaction;
        });
        if(reactions.length == 0) {
            reactions = [
                {
                    key: 1,
                    emote: "endorse",
                    count: 0
                }
            ];
        }
        else {
            reactions = reactions.sort((a, b) => {
                if(a.emote == "endorse")
                    return Number.MIN_SAFE_INTEGER;
                else if(b.emote == "endorse")
                    return Number.MAX_SAFE_INTEGER;
                else
                    return b.count - a.count;
            });
        }
        return (
            <Message author={ message.user.display_name } avatar={ message.user.logo } authorName={ message.user.name } date={ message.date } key={ message.id } reactions={ reactions.slice(0, MAX_REACTIONS) }>
                <MessageBody body={ message.body } emotes={ message.emotes } />
            </Message>
        )
    });

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

