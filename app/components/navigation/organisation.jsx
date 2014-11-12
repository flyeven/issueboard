var React = require("react");
var Router = require('react-router');
var Link = Router.Link;
var Github = require('../../api/github.js');
var BreadCrumbs = require('../navigation/breadcrumbs.jsx');

module.exports = React.createClass({
    getInitialState: function () {
        //get organisation(s) data
        return {
            loading: true,
            organisations: []
        };
    },
    componentDidMount: function() {
        console.log("MOUNTING ORG LIST");
        var component = this;

        //load organisations from github

        Github.getOrganisations()
            .then(function(result) {
                if(component.isMounted()) {
                    if(!result.success)
                    {
                        alert("Error connecting to github api: " + result.data.message);
                        return;
                    }

                    var orgs = result.data.map(function(org) {
                        return {
                            name: org.login,
                            avatar_url: org.avatar_url
                        };
                    });

                    component.setState({ loading: false, organisations: orgs});
                }
            }, function (error) {
                console.log("github error:");
                console.log(error);
            });
    },
    render: function () {
        if(this.state.loading)
            return <p>Loading Organisations...</p>;

        var targetOrg = this.props.params.organisation;
        var organisations = this.state.organisations.filter(function(org) { return org.name === targetOrg || targetOrg === undefined; }).map(function(org) {
            return <Organisation key={org.name} organisationName={org.name} />;
        });

        return (
            <div>
                <BreadCrumbs organisation={targetOrg} />
                <ul>
                    {organisations}
                </ul>
            </div>
        );
    }
});

var Organisation = React.createClass({
    propTypes: {
        organisationName: React.PropTypes.string.isRequired,
    },
    getInitialState: function() {
        return { loading: true, repositories: [] };
    },
    componentDidMount: function() {
        //load organisations from github
        var component = this;
        Github.getOrganisationRepositories(this.props.organisationName)
            .then(function(result) {

                if(component.isMounted())
                {
                    if(!result.success)
                    {
                        alert("Error connecting to github api: " + result.data.message);
                        return;
                    }

                    var repos = result.data.map(function(repo) {
                        return {
                            name: repo.name,
                            description: repo.description,
                            issues: repo.open_issues_count
                        };
                    });

                    component.setState({ loading: false, repositories: repos});
                }
            }, function (error) {
                console.log("github error:");
                console.log(error);
            });
    },
    render: function () {
        var content = <p>Loading repositories...</p>;

        if(!this.state.loading)
        {
            content = <RepositoryList organisation={this.props.organisationName} repositories={this.state.repositories} />;
        }

        return (
            <div>

                <h3><Link to="organisation" params={{organisation: this.props.organisationName}}>{this.props.organisationName}</Link></h3>
                {content}
            </div>
        );
    }
});

var RepositoryList = React.createClass({
    propTypes: {
        organisation: React.PropTypes.string.isRequired,
        repositories: React.PropTypes.array.isRequired
    },
    render: function () {
        var component = this;
        var lines = this.props.repositories.map(function(repo) {
            var url = "/" + component.props.organisation + "/" + repo.name;
            return (
                <li key={repo.name}><Link to={url}>{repo.name}</Link></li>
            );
        });
        return (
            <ul>
                {lines}
            </ul>
        );
    }
});