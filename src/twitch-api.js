import { clientID, followsLimit } from "./config.json";

const opts = Object.freeze({
    headers: Object.freeze({
        "Client-ID": clientID,
        'Accept': 'application/vnd.twitchtv.v5+json'
    })
});

const getUserID = (username) => {
    return fetch(`https://api.twitch.tv/kraken/users?login=${username}`, opts);
};

const getFollows = (userId, page = 1) => {
    return fetch(`https://api.twitch.tv/kraken/users/${userId}/follows/channels?limit=${followsLimit}&offset=${(page - 1) * followsLimit}`, opts)
        .then((response) => response.json())
        .then((json) => {
            if(json._total > page * followsLimit) {
                return getFollows(userId, page + 1).then((follows) => {
                    return json.follows.concat(follows);
                });
            }
            return json.follows;
        });
};
const getPosts = (userId) => {
    return fetch("https://api.twitch.tv/kraken/feed/" + userId + "/posts", opts)
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
export const getFeed = (username) => {
    return getUserID(username)
        .then(getFollows)
        .then((follows) => Promise.all(follows.map((follow) => getPosts(follow.channel._id))))
        .then((posts) => [].concat(...posts))
        .then((posts) => posts.sort((a, b) => b.date - a.date));
};
