var React = require("react");

module.exports = React.createClass({
    render: function() {
        return ( 
            <div className="jumbotron">
                <h1>Not Found :(</h1>
                <p>The page you are looking for was not found ...</p>
                <p>Please return to the homepage to continue using Issue Board</p>
                <p><Link for="home" className="btn btn-primary btn-lg" role="button">Return home</Link></p>
            </div> 
        );
    }
});