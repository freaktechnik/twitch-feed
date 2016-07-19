import fetch from "whatwg-fetch";

import { clientID, followsLimit } from "./config.json";

const opts = {
    headers: {
        "Client-ID": clientID
    }
};

const getFollows = (username, page = 1) => {
    return fetch(`https://api.twitch.tv/kraken/users/${username.toLowerCase()}/follows/channels?limit=${followsLimit}&offset=${(page-1)*followsLimit}`, opts)
        .then((response) => response.json())
        .then((json) => {
            if(json._total > page * followsLimit) {
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
export const getFeed = (username) => {
    return getFollows(username)
        .then((follows) => Promise.all(follows.map((follow) => getPosts(follow.channel.name))))
        .then((posts) => [].concat(...posts))
        .then((posts) => posts.sort((a, b) => b.date - a.date));
};
