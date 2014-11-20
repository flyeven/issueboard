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
                //need to request all the issues for each milestone
                Promise.all(result.data.map(component.enrichMilestone))
                       .then(milestones => {
                            if(this.isMounted())
                                this.setState({ loading: false, milestones: milestones});
                        });
            }, function (error) {
                console.log("github error:", error);
                alert(error);
            });
    },
    //downloads the issues for this milestone, returns a promise
    enrichMilestone: function (m) {
        var org = this.props.params.organisation,
            repo = this.props.params.repository;

        return Github.getMilestoneIssues(org,repo,m.number)
                .then(result => {
                    return {
                        number: m.number,
                        state: m.state,
                        title: m.title,
                        description: m.description,
                        openIssues: m.open_issues,
                        closedIssues: m.closed_issues,

                        //then for each issue
                        issues: result.data.map(

                            i => {
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
                        )
                    };
                }); 
    },
    render: function () {
        var s = this.state;
        var p = this.props;

        if(s.loading) {
            return  <p>Loading repository...</p>;
        }
        var milestones = s.milestones.map(m => {
            return (
                <Milestone key={m.number}
                           title={m.title}
                           description={m.description}
                           openIssues={m.openIssues}
                           closedIssues={m.closedIssues}
                           issues={m.issues}
                           state={m.state} />
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

