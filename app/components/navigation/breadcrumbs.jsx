var React = require("react");
var Router = require('react-router');
var Link = Router.Link;


module.exports = React.createClass({
    propTypes: {
        organisation: React.PropTypes.string,
        repository: React.PropTypes.string
    },
    render: function() {
        var linkNodes = [];

        linkNodes.push(<li><Link to="home">Home</Link></li>);

        if(this.props.organisation !== undefined)
            linkNodes.push(<li><Link to="organisation" params={{organisation: this.props.organisation}}>{this.props.organisation}</Link></li>);
        
        if(this.props.repository !== undefined)
            linkNodes.push(<li><Link to="board" params={{organisation: this.props.organisation, repository: this.props.repository}}>{this.props.repository}</Link></li>);

        if(this.props.issue !== undefined)
            linkNodes.push(<li><Link to="issue" params={{organisation: this.props.organisation, repository: this.props.repository, issue: this.props.issue }}>Issue #{this.props.issue}</Link></li>);

        return (
            <ol className="breadcrumb">
                    {linkNodes}
            </ol>
        );
    }
});