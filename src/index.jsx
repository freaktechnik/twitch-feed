import React from "react";
import ReactDOM from "react-dom";

import "babel-core/register";
import "babel-polyfill";

import Page from './page.jsx';

import 'muicss/dist/css/mui.min.css';
import 'mprogress/build/css/mprogress.min.css';
import './style.css';

ReactDOM.render(<Page pollInterval={120000} title="Consolidated Twitch Channel Feed"/>, document.getElementById("content"));
