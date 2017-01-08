import { clientID, followsLimit } from "./config.json";

const opts = Object.freeze({
    headers: Object.freeze({
        "Client-ID": clientID,
        'Accept': 'application/vnd.twitchtv.v5+json'
    })
});

const getUserID = async (username) => {
    const response = await fetch(`https://api.twitch.tv/kraken/users?login=${username}`, opts);
    if(!response.ok) {
        throw `Could not load user ID for ${username}`;
    }
    const json = await response.json();
    if(json.users.length < 1) {
        throw `No users found for username ${username}`;
    }
    return json.users[0]._id;
};

const getFollows = async (userId, page = 1) => {
    const response = await fetch(`https://api.twitch.tv/kraken/users/${userId}/follows/channels?limit=${followsLimit}&offset=${(page - 1) * followsLimit}`, opts);
    const json = await response.json();
    if(json._total > page * followsLimit) {
        const follows = await getFollows(userId, page + 1);
        return json.follows.concat(follows);
    }
    return json.follows;
};

const getPosts = async (userId) => {
    let json;
    try {
        const response = await fetch(`https://api.twitch.tv/kraken/feed/${userId}/posts`, opts);
        json = await response.json();
    }
    catch(e) {
        json = { posts: [] };
    }

    if("error" in json) {
        return [];
    }
    return json.posts.map((post) => {
        post.date = Date.parse(post.created_at);
        return post;
    });
};
export const getFeed = async (username) => {
    const userId = await getUserID(username);
    const follows = await getFollows(userId);
    let posts = await Promise.all(follows.map((follow) => getPosts(follow.channel._id)));
    posts = [].concat(...posts);
    return posts.sort((a, b) => b.date - a.date);
};
