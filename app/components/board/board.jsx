var React = require('react/addons');
var BreadCrumbs = require('../navigation/breadcrumbs.jsx');
var Github = require('../../api/github.js');
var Milestone = require('./milestone.jsx');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            loading: true,
            milestones: []
        };
    },
    componentWillChangeProps: function (props) {
        this.loadRepo(this.props.params.organisation, this.props.params.repository);
    },
    componentDidMount: function () {
        this.loadRepo(this.props.params.organisation, this.props.params.repository);
    },
    loadRepo: function (organisation, repository) {
        var component = this;
        this.setState({ loading: true, milestones: [] });

        Github.getMilestones(organisation, repository)
            .then(function(result) {
                if(component.isMounted()) {
                    if(!result.success)
                    {
                        alert("Error connecting to github api: " + result.data.message);
                        return;
                    }
                    var milestones = result.data.map(function(m) {
                        return {
                            number: m.number,
                            state: m.state,
                            title: m.title,
                            description: m.description,
                            openIssues: m.open_issues,
                            closedIssues: m.closed_issues
                        };
                    });
                    //we always want the "no milestone" column first
                    milestones.unshift(
                        {
                            number: "none",
                            state: "open",
                            title: "Unassigned Issues",
                            description: "This is the backlog of issues with no milestone assigned",
                            openIssues: 0,
                            closedIssues: 0
                        }
                    );
                    component.setState({ loading: false, milestones: milestones});
                }
            }, function (error) {
                console.log("github error:");
                console.log(error);
            });
    },
    render: function () {
        if(this.state.loading) {
            return  <p>Loading repository...</p>;
        }
        var component = this;
        var milestones = this.state.milestones.map(function (m) {
            return (
                <Milestone key={m.number} organisation={component.props.params.organisation} repository={component.props.params.repository} milestone={m} />
            );
        });

        return (
            <div>
                <BreadCrumbs organisation={this.props.params.organisation} repository={this.props.params.repository}/>
                <div className="issues-container">
                    {milestones}
                </div>
            </div>
        );
    }
});

