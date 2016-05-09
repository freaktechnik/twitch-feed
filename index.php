<?php
include_once __DIR__.'/vendor/autoload.php';
include_once __DIR__.'/config.php';
include_once __DIR__.'/Twitch.php';

use OAuth\Common\Storage\Session;
use OAuth\Common\Consumer\Credentials;
use OAuth\OAuth2\Service\Twitch;

$uriFactory = new \OAuth\Common\Http\Uri\UriFactory();
$currentUri = $uriFactory->createFromSuperGlobalArray($_SERVER);
$currentUri->setQuery('');
$storage = new Session();
$credentials = new Credentials(
    $apiKey,
    $apiSecret,
    $currentUri->getAbsoluteUri()
);
$serviceFactory = new \OAuth\ServiceFactory();

/** @var $twitch Twitch */
$twitch = $serviceFactory->createService('Twitch', $credentials, $storage, array(Twitch::SCOPE_CHANNEL_FEED_READ, Twitch::SCOPE_USER_READ));

if (isset($_POST['logout'])) {
    $storage->clearToken('Twitch');
    $url = $currentUri->getRelativeUri() . '?go=go';
    echo '<p>Logged out. <a href="'.$url.'">Log in again</a></p>';
}
else if (!empty($_GET['code']) || $storage->hasAccessToken('Twitch')) {
    if(!$storage->hasAccessToken('Twitch')) {
        // This was a callback request from twitch, get the token
        $twitch->requestAccessToken($_GET['code']);
    }

    $token = json_decode($twitch->request(''), true);
    $username = $token['token']['user_name'];

    $result = json_decode($twitch->request('users/'.$username.'/follows/channels?limit=100'), true);

    $posts = array();

    foreach($result['follows'] as $channel) {
        try {
            $channelPosts = json_decode($twitch->request('feed/'.$channel['channel']['name'].'/posts'), true);
            $posts = array_merge($posts, $channelPosts['posts']);
        } catch(Exception $e) {
            // Channel is not in the feed beta I think.
        }
    }

    usort($posts, function($l, $r) {
        return strtotime($r['created_at']) - strtotime($l['created_at']);
    });

    echo '<h1>Channel Feeds</h1><p>Note: this only works for the first hundred followed channels</p><form method="POST"><button name="logout" value="true" type="submit">Logout</button></form>';
    echo '<ul>';
    foreach($posts as $post) {
        echo '<li><q>'.$post['body'].'</q> <cite><a href="https://twitch.tv/'.$post['user']['name'].'">'.$post['user']['display_name'].'</a></cite> (<time datetime="'.$post['created_at'].'">'.date('D j.M Y', strtotime($post['created_at'])).'</time>)</li>';
    }
    echo '</ul>';

} elseif (!empty($_GET['go']) && $_GET['go'] === 'go') {
    $url = $twitch->getAuthorizationUri();
    header('Location: ' . $url);

} else {
    $url = $currentUri->getRelativeUri() . '?go=go';
    echo "<a href='$url'>Login with Twitch!</a>";
}

