var React = require('react/addons');

//passed list of events as props?
module.exports= React.createClass({
    render: function() {
        var events = this.props.events;
        var heading = this.props.heading;

        var eventNodes = events.filter(e => {
            return EventFormatters[e.event] !== undefined;
        }).map(e => {
            var icon = EventIcons[e.event];
            var format = EventFormatters[e.event](e);
            var heading = format.heading;
            var body = format.body;

            return (
                <TimelineItem icon={icon} title={heading} body={body} />
            );
        });

        return (
            <div class="timeline-container">
                <h4>{heading}</h4>
                <ul className="timeline">
                    {eventNodes}
                </ul>
            </div>
        );
    }
});

var TimelineItem = React.createClass({
    render: function() {
        console.log("Rendering item");
        var iconClass = this.props.icon;
        var title = this.props.title;
        var body = this.props.body;
        console.log(body);
        return (
            <li className="timeline-inverted">
                <div className="timeline-badge default">
                    <i className={iconClass}></i>
                </div>
                <div className="panel panel-default timeline-panel">
                    <div className="panel-heading">
                        <h5 className="panel-title timeline-title">
                            {title}
                        </h5>
                    </div>
                    { body ? 
                    <div className = "panel-body timeline-body">
                        {body}
                    </div>
                    :
                    null }
                </div>
            </li>
        );

    }
});

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
        'closed': 
            e => { return {
                    heading: "Issue Closed",
                    body: null
                };
            },
        'reopened':
            e => { return {
                    heading: "Issue Re-opened",
                    body: null
                };
            },
        'merged':
            e => { return {
                    heading: "Pull request merged",
                    body: null
                };
            },
        'referenced':
            e => { return {
                    heading: "This issue was referenced in a commit",
                    body: <p>
                            <h5>Commit #123123123</h5>
                            Commit message
                          </p>
                };
            },
        'mentioned':
            e => { return {
                    heading: "Mentioned in a comment"
                };
            },
        'assigned':
            e => { return {
                    heading: "Assigned to XXXX"
                };
            },        
        'unassigned':
            e => { return {
                    heading: "Unassigned"
                };
            },
        'milestoned':
            e => { return {
                    heading: "Added to milestone XXX"
                };
            },
        'demilestoned':
            e => { return {
                    heading: "Removed from milestone"
                };
            },
        'labeled':
            e => { return {
                    heading: "Label XXX added"
                };
            },
        'unlabeled':
            e => { return {
                    heading: "Label XXX removed"
                };
            },
        'renamed':
            e => { return {
                    heading: "Title Changed"
                };
            },
        'locked':
            e => { return {
                    heading: "Issue Locked"
                };
            },
        'head_ref_deleted':
            e => { return {
                    heading: "Not Implemented"
                };
            },
        'head_ref_restored':
            e => { return {
                    heading: "Not Implemented"
                };
            },
};