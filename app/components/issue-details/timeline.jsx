var React = require('react/addons');

//passed list of events as props?
module.exports= React.createClass({
    render: function() {
        var issueEvents = this.props.issueEvents;
        var heading = this.props.heading;

        console.log("RENDERING TIMELINE");

        var eventList = issueEvents.filter(e => {
           
            //only if this is a supported event type for the timeline
            var filter = EventFormatters[e.event] !== undefined;
            console.log("FORMATTER:", e.event, filter);
            return filter;
        }).reduce((s,e) => {
            console.log("REDUCING", e.event);
            if(e.commit_id !== undefined)
            {
                e.commits = [ { id: e.commit_id, created_at: e.created_at } ];
            }

            //merge consecutive commit things
            if(s.length > 0 && e.event === "referenced" && s[s.length - 1].event === "referenced")
            {
                s[s.length - 1].commits.add({ id: e.commit_id, created_at: e.created_at });
                //just return, don't add a new entry for this
                return s;
            }
            s.push(e);
            return s;
        }, []);

        var eventNodes = eventList.map(e => {
            console.log(e.event);
            if(e.event === "assigned"){
                console.log(e);
                console.log(e.actor.login, e.assignee.login);
            }
            if(e.event === "comment")
            {
                return <Comment event={e} />;
            } else {
                return <TimelineItem event={e} />;
            }
        }
        );

        return (

            <div className="timeline-container">
                <h4>{heading}</h4>
                <ul className="timeline">
                    {eventNodes}
                </ul>
            </div>
        );
    }
});

var Comment = React.createClass({
    render: function() {
        var e = this.props.event;
        var iconClass = EventIcons[e.event];
        var body = EventFormatters[e.event](e).body;
        console.log(iconClass, body);
        return (
            <li className="timeline-comment">
                <div className="timeline-badge info">
                    <i className={iconClass}></i>
                </div>
                <div className="panel panel-info">
                    <div className="panel-heading">
                        <h3 className="panel-title">
                        Someone commented
                        </h3>
                    </div>
                    <div className="panel-body">
                        {body}
                    </div>
                </div>
            </li>
        );
    }
});

var TimelineItem = React.createClass({
    render: function() {

        var e = this.props.event;
        var type = this.props.pullRequest ? 
                    "pull request" :
                    "issue";

        var iconClass = EventIcons[e.event];

        var body = EventFormatters[e.event](e, type).body;
        console.log(iconClass, body);
        var badge = getTimelineBadge(e);
        return (
            <li>
                {getTimelineBadge(e)}
                <p><strong>{e.actor.login}&nbsp;</strong>{body}</p>
            </li>
        );
    }
});

function getTimelineBadge(e) {
    if(e.actor !== undefined) {
        if(e.actor.avatar_url !== undefined &&
           e.actor.avatar_url !== "")
        {
            return (
                <img className="timeline-avatar" src={e.actor.avatar_url} ></img>
            );
        } else {
            var iconClass = EventIcons[e.event];
            return (                
                <div className="timeline-badge default">
                    <i className={iconClass}></i>
                </div>
            );
        }
    }

}

//these map the various event types to icon
var EventIcons = {
         'closed': 'glyphicon glyphicon-ok',
         'reopened': 'glyphicon glyphicon-repeat',
         'merged': 'glyphicon glyphicon-ok',
         'referenced': 'glyphicon glyphicon-comment',
         'mentioned': 'glyphicon glyphicon-bookmark',
         'assigned': 'glyphicon glyphicon-user',
         'unassigned': 'glyphicon glyphicon-user',
         'milestoned': 'glyphicon glyphicon-flag',
         'demilestoned': 'glyphicon glyphicon-flag',
         'labeled': 'glyphicon glyphicon-tag',
         'unlabeled': 'glyphicon glyphicon-tag',
         'renamed': 'glyphicon glyphicon-pencil',
         'locked': 'glyphicon glyphicon-lock',
         'head_ref_deleted': 'glyphicon glyphicon-info',
         'head_ref_restored': 'glyphicon glyphicon-info',
         'comment': 'glyphicon glyphicon-comment'
};

//these map the various event types to a description
var EventFormatters = {
        'comment': (e,issueType) => {
            console.log("formatting comment", e);
            return {
                body: e.body
            };
        },
        'closed': 
            (e,issueType) => {
                return {
                    body: `closed this ${ issueType }`
                };
            },
        'reopened':
            (e,issueType) => { return {
                    body: `reopened this ${ issueType }`
                };
            },
        'merged':
            e => { return {
                    body: "merged this pull request"
                };
            },
        'referenced':
            (e,issueType) => { return {
                    heading: "added some commits",
                };
            },
        'mentioned':
            (e,issueType) => { return {
                    body: `reopened this ${ issueType }`
                };
            },
        'assigned':
            (e,issueType) => { return {
                    body: ( <span>assigned this { issueType } to <strong>{ e.assignee.login }</strong></span> )
                };
            },        
        'unassigned':
            (e,issueType) => { return {
                    body: ( <span>assigned this { issueType }</span> )
                };
            },
        'milestoned':
            (e,issueType) => { return {
                    body: ( <span>added this { issueType } to milestone <strong>{ e.milestone.title }</strong></span> )
                };
            },
        'demilestoned':
            (e,issueType) => { return {
                    body: ( <span>removed this { issueType } from milestone <strong>{ e.milestone.title }</strong></span> )
                };
            },
        'labeled':
            (e,issueType) => { 
                var bg = "#" + e.label.color;
                var label = <span className="label" style={{background: bg}}>{e.label.name}</span>;
                return {
                    body: ( <span>added label {label}</span> )
                };
            },
        'unlabeled':
            (e,issueType) => { 
                var bg = "#" + e.label.color;
                var label = <span className="label" style={{background: bg}}>{e.label.name}</span>;
                return {
                    body: ( <span>removed label {label}</span> )
                };
            },
        'renamed':
            (e,issueType) => { return {
                    body: <span>changed title to {e.issue.title}</span>
                };
            },
        'locked':
            (e,issueType) => { return {
                    body: `locked this ${ issueType }`
                };
            },
        'head_ref_deleted':
            (e,issueType) => { return {
                    body: "Not Implemented"
                };
            },
        'head_ref_restored':
            (e,issueType) => { return {
                    body: "Not Implemented"
                };
            },
};