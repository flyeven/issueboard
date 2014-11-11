var React = require('react');
var Router = require('react-router');

var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var Navbar = require('./components/navbar/navbar.jsx');
var NotFound = require('./components/notfound/notfound.jsx');
var Test = require('./components/test/test.jsx');

var App = React.createClass({
    render: function () {
        return (
            <div id="app">
                <Navbar />
                <this.props.activeRouteHandler/>
            </div>
        );
    }
});

React.renderComponent((
  <Routes location="history">
    <Route name="home" path="/" handler={App}>
      <DefaultRoute handler={Test} />
      <NotFoundRoute handler={NotFound} />
    </Route>
    <DefaultRoute handler={App} />
  </Routes>
), document.body);