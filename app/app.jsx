var React = require('react');
var Router = require('react-router');
var Github = require('./api/github.js');
var Board = require('./components/board/board.jsx');
var BreadCrumbs = require('./components/navigation/breadcrumbs.jsx');

var Route = Router.Route;
var Link = Router.Link;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var Navbar = require('./components/navigation/navbar.jsx');
var Organisations = require('./components/navigation/organisation.jsx');

var NotFound = require('./components/notfound/notfound.jsx');

console.log(localStorage.getItem("oauth_key"));
if(localStorage.getItem("oauth_key") === null) 
{
    localStorage.setItem("oauth_key",window.prompt("Please supply an oauth key:"));
}

var App = React.createClass({
    render: function () {
        console.log(this.props.activeRouteHandler)
        return (
            <div id="app">
                <Navbar loggedIn={false}/>
                <this.props.activeRouteHandler />
            </div>
        );
    }
});

React.render((
    <Routes location="history">
        <Route name="home" path="/" handler={App} alt="Home">
            <DefaultRoute handler={Organisations} />
            <Route name="organisation" path=":organisation" handler={Organisations}/>
            <Route name="board" path=":organisation/:repository" handler={Board} />
        <NotFoundRoute handler={NotFound} />
        </Route>
        <DefaultRoute handler={Organisations} />
  </Routes>
), document.body);