var React = require("react");
var Router = require('react-router');
var Link = Router.Link // yes

module.exports = React.createClass({
    render: function() {
        return ( 
            <nav className="navbar navbar-default" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header">
                          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                          </button>
                          <Link to="home" className="navbar-brand">IssueBoard</Link>
                    </div>
                </div>
            </nav>
        );
    }
});