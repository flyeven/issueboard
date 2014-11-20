var React = require('react/addons');
var BreadCrumbs = require('../navigation/breadcrumbs.jsx');
var Github = require('../../api/github.js');
var Milestone = require('./milestone.jsx');
var NULL_MILESTONE =   
    {
        number: "none",
        state: "open",
        title: "Unassigned Issues",
        description: "This is the backlog of issues with no milestone assigned",
        open_issues: 0,
        closed_issues: 0
    };


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
    loadRepo: function () {
        var org = this.props.params.organisation,
            repo = this.props.params.repository;

        var component = this;
        this.setState({ loading: true, milestones: [] });

        Github.getMilestones(org, repo)
            .then(result => {
                //we always want the "no milestone" column first
                result.data.unshift(NULL_MILESTONE);
                
                var milestones = result.data.map(component.createMilestone);
                this.setState({ loading: false, milestones: milestones});

                //download issues for the expanded milestones
                milestones.map((m,i) => {
                    if(m.expanded)
                        this.expandMilestone(i);
                });
            }, function (error) {
                console.log("github error:", error);
                alert(error);
            });
    },
    //downloads the issues for this milestone, returns a promise
    createMilestone: function (m) {
        return { 
            number: m.number,
            state: m.state,
            title: m.title,
            description: m.description,
            openIssues: m.open_issues,
            closedIssues: m.closed_issues,
            expanded: m.state === 'open',
            issues: []
        };
    },
    render: function () {
        var s = this.state;
        var p = this.props;

        if(s.loading) {
            return  <p>Loading repository...</p>;
        }
        var milestones = s.milestones.map(function(m,i) {
            return (
                <Milestone key={i}
                           index={i}
                           number={m.number}
                           title={m.title}
                           description={m.description}
                           openIssues={m.openIssues}
                           closedIssues={m.closedIssues}
                           issues={m.issues}
                           state={m.state}
                           expanded={m.expanded}
                           onExpand={this.expandMilestone} />
            );
        }, this);

        return (
            <div>
                <BreadCrumbs organisation={this.props.params.organisation} repository={this.props.params.repository}/>
                <div className="issues-container">
                    {milestones}
                </div>
            </div>
        );
    },
    expandMilestone: function(index) {
        console.log("expanding index", index);
        var org = this.props.params.organisation,
            repo = this.props.params.repository;
        var milestones = this.state.milestones;
        var milestone = milestones[index];

        return Github.getMilestoneIssues(org,repo,milestone.number)
            .then(result => {
                milestone.issues = result.data.map(this.mapIssue);
                milestone.expanded = true;
                milestones[index] = milestone;
                this.setState({ milestones: milestones });
            });
    },
    mapIssue: function(i) {
        return {
            number: i.number,
            state: i.state,
            title: i.title,
            labels: i.labels,
            body: i.body,
            comments: i.comments,
            assignee_avatar: i.assignee ?
                             i.assignee.avatar_url :
                             null //TODO: some placeholder?
        };
    }
});

