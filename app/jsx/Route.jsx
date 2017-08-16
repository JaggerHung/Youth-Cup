import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import ReactGA from 'react-ga'

import config from './Config.jsx'

import App from './components/App.jsx'
import BlankPage from './components/BlankPage.jsx'
import IndexPage from './components/IndexPage.jsx'
// import Team from './components/Team.jsx'
// import GameList from './components/GameList.jsx'
// import Game from './components/Game.jsx'
import Boxscore from './components/Boxscore.jsx'
import Photo from './components/Photo.jsx'
import Stats from './components/Stats.jsx'
// import Player from './components/Player.jsx'

// http://stackoverflow.com/questions/27864720/react-router-pass-props-to-handler-component
// https://github.com/reactjs/react-router/blob/master/docs/guides/RouteMatching.md

window.api_host = config.api_host;
window.api_host2 = config.api_host2;
window.men_season_id = config.men_season_id;
window.women_season_id = config.women_season_id;
var locale = 'zh';

ReactGA.initialize('UA-63208228-2');

// $.get({
//     url: url
// }).then(function (data) {
//     console.log(data);
    // const topics = data.topics.reduce(function (map, topic) {
    //     topic.postsMap = topic.posts.reduce(function (postsMap, post) {
    //         postsMap[post.url] = post
    //         return postsMap
    //     }, {})
    //     map[topic.url] = topic
    //     return map
    // }, {})

    // <Route path="/**/:url" components={PostPageRouter} data={data}/>
    
    function logPageView(){
        ReactGA.set({page: window.location.pathname});
        ReactGA.pageview(window.location.pathname);
    }

    function changeLocale(){
        if(locale == 'zh'){
            locale == 'en';
        }else{
            locale == 'zh';
        }
    }

    render((
        <Router history={browserHistory} onUpdate={logPageView}>
            <Route path="/" component={App} onUpdate={logPageView}>
                <IndexRoute component={IndexPage} locale={locale} onUpdate={logPageView}/>
                <Route path="/game/:id" locale={locale} components={Boxscore} onUpdate={logPageView}/>
                <Route path="/photos" locale={locale} components={Photo} onUpdate={logPageView}/>
                <Route path="/stats" locale={locale} components={Stats} onUpdate={logPageView}/>
            </Route>
        </Router>
    ), document.getElementById('app'));
// });