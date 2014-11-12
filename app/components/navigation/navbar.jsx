var React = require("react");
var Router = require('react-router');
var Link = Router.Link;

module.exports = React.createClass({
    propTypes: {
        loggedIn: React.PropTypes.bool.isRequired,
        userName: React.PropTypes.string
    },
    render: function() {
        var userWidget = <SignInWidget userName={this.props.userName} />;
        if(this.props.loggedIn)
            userWidget = <SignOutWidget />;

        return (
            <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#site-nav">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">Issues</a>
                    </div>
                    {userWidget}
                </div>
            </nav>
        );
    }
});

var SignInWidget = React.createClass({
    render: function () {
        return (
            <div className="collapse navbar-collapse" id="site-nav">
                <ul className="nav navbar-nav navbar-right">
                    <li><a href="#"><span className="glyphicon glyphicon-log-in"></span> Sign In</a></li>
                </ul>
            </div>
        );
    }
});

var SignOutWidget = React.createClass({
    propTypes: {
        userName: React.PropTypes.string.isRequired
    },
    render: function () {
        return (
            <div className="collapse navbar-collapse" id="site-nav">
                <ul className="nav navbar-nav navbar-right">
                    <li><a href="#"><span className="glyphicon glyphicon-log-out"></span> Sign Out</a></li>
                </ul>
                <p className="nav navbar-nav navbar-right navbar-text">You are signed in as {this.props.userName}.</p>
            </div>
            );
    }
});

