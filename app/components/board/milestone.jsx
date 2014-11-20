var React = require('react/addons');
var Issue = require('./issue.jsx');
var Github = require('../../api/github.js');

module.exports = React.createClass({
    getInitialState: function () {
        return { loading: true, issues: [], dragOver: 0 };
    },
    componentDidMount: function () {
        this.loadIssues();
    },
    loadIssues: function (organisation, repository) {
        var component = this;
        this.setState({ loading: true, issues: [], dragOver: 0 });

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
    dragOver: function (event) {
        event.preventDefault();
    },
    dragEnter: function (event) {
        event.preventDefault();
        this.setState({dragOver: this.state.dragOver + 1});
    },
    dragLeave: function (event) {
        this.setState({dragOver: this.state.dragOver - 1});
    },
    drop: function (event) {
        this.setState({dragOver: 0});
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

        var dragIssue;
        if(this.state.dragOver > 0)
        {
            dragIssue = <li className="issue-placeholder"></li>;
        }

        return (
                <div className="panel panel-info issues-container__column" onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave} onDrop={this.drop}>
                    <div className="panel-heading">
                        <h2 className="panel-title">{this.props.milestone.title}</h2>
                    </div>
                    <div className="panel-body">
                        {progressbar}
                        {this.props.milestone.description}
                        <ul className="list-group">
                            {dragIssue}
                            {issues}
                        </ul>
                    </div>
                </div>
        );
    }
});
