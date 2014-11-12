var React = require('react/addons');
var BreadCrumbs = require('../navigation/breadcrumbs.jsx');
var Github = require('../../api/github.js');

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

var Milestone = React.createClass({
    getInitialState: function () {
        return { loading: true, issues: [] };
    },
    componentDidMount: function () {
        this.loadIssues();
    },
    loadIssues: function (organisation, repository) {
        var component = this;
        this.setState({ loading: true, issues: [] });

        Github.getMilestoneIssues(this.props.organisation, this.props.repository, this.props.milestone.number)
            .then(function(result) {
                if(component.isMounted()) {
                    if(!result.success)
                    {
                        alert("Error connecting to github api: " + result.data.message);
                        return;
                    }
                    var issues = result.data.map(function(i) {
                        return {
                            number: i.number,
                            state: i.state,
                            title: i.title,
                            labels: i.labels,
                            body: i.body,
                            comments: i.comments,
                            assignee_avatar: i.assignee ? i.assignee.avatar_url : null
                        };
                    });
                    component.setState({ loading: false, issues: issues});
                }
            }, function (error) {
                console.log("github error:");
                console.log(error);
            });
    },

    render: function () {
        var data = this.props.milestone;
        var totalIssues = data.openIssues + data.closedIssues;
        var percentComplete = data.totalIssues === 0 ? 0 : (data.closedIssues / totalIssues) * 100;
        var percentCompleteCss = percentComplete + "%";

        var progressbar = data.number === "none" ? null : (
            <div className="progress">
                <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow={percentComplete} aria-valuemin="0" aria-valuemax="100" style={{width: percentCompleteCss}} >
                {this.props.milestone.closedIssues} / {totalIssues}
                </div>
            </div>
        );

        var issues = [];

        if(this.state.loading) {
            issues = [<li>Loading Issues...</li>];
        } else {
            issues = this.state.issues.map(function(issue) {
                return <Issue key={issue.number} title={issue.title} assignee={issue.assignee_avatar} labels={issue.labels} comments={issue.comments} closed={issue.state == "closed"} />;
            });
        }

        return (
            <div className="issues-container__column">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h2 className="panel-title">{this.props.milestone.title}</h2>
                    </div>
                    <div className="panel-body">
                        {progressbar}
                        {this.props.milestone.description}
                    </div>
                    <ul className="list-group">
                        {issues}
                    </ul>
                </div>
            </div>
        );
    }
});

var Issue = React.createClass({
    render: function () {
        var tags = [];
        var cx = React.addons.classSet;
        var itemClasses = cx({
            'list-group-item': true,
            'list-group-item--done': this.props.closed
        });

        if(this.props.labels) {
            tags = this.props.labels.map(function(label) {
                var bg = "#" + label.color;
                return (<span className="label" style={{background: bg}}>{label.name}</span>);
            });
        }

        return (
            <li className={itemClasses}>
                <a href='#' className="issue">
                    <h5 className="issue__title">{this.props.title}</h5>
                    { this.props.assignee ? <p className="issue__assignee"><img src={this.props.assignee} /></p> : null }
                    <p className="issue__tags">
                        {tags}
                        <span className="label label-default"><span className="glyphicon glyphicon-comment"></span> {this.props.comments}</span>
                    </p>
                </a>
            </li>
        );
    }
});