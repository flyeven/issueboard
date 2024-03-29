window.Offline = true;

var React = require('react');
var Router = require('react-router');
var Github = require('./api/github.js');
var Board = require('./components/board/board.jsx');
var IssueDetails = require('./components/issue-details/issuedetails.jsx');
var BreadCrumbs = require('./components/navigation/breadcrumbs.jsx');

var Route = Router.Route;
var Link = Router.Link;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var Navbar = require('./components/navigation/navbar.jsx');
var Organisations = require('./components/navigation/organisation.jsx');

var NotFound = require('./components/notfound/notfound.jsx');

var currentKey = localStorage.getItem("oauth_key");
if(currentKey === null || currentKey === "null") 
{
    var key = window.prompt("Login doesnt work yet, please supply an oauth key instead:");
    if(key !== undefined && key !== "")
        localStorage.setItem("oauth_key",key);
}

var App = React.createClass({
    render: function () {
        return (
            <div id="app">
                <Navbar loggedIn={false}/>
                <this.props.activeRouteHandler />
            </div>
        );
    }
});

React.render((
    <Routes location="hash">
        <Route name="home" path="/" handler={App} alt="Home">
            <DefaultRoute handler={Organisations} />
            <Route name="organisation" path=":organisation" handler={Organisations}/>
            <Route name="board" path=":organisation/:repository" handler={Board} />
            <Route name="issue" path=":organisation/:repository/:issue" handler={IssueDetails} />
        <NotFoundRoute handler={NotFound} />
        </Route>
        <DefaultRoute handler={Organisations} />
  </Routes>
), document.body);