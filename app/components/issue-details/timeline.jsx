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
            var heading = "Something happened";
            var body = EventFormatters[e.event](e);
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
                <div className="timeline-badge info">
                    <i className={iconClass}></i>
                </div>
                <div className="panel panel-default timeline-panel">
                    <div className = "timeline-body">
                        <h5 className="timeline-title">
                            {title}
                        </h5>
                        {body}
                    </div>
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
            e => { return null; }, //issue closed
        'reopened':
            e => { return <p>Not implemented</p>; }, //issue reopened
        'merged':
            e => { return <p>Not implemented</p>; }, //pull request merged
        'referenced':
            e => { return <p>Not implemented</p>; }, //from a commit
        'mentioned':
            e => { return <p>Not implemented</p>; }, //in another issue
        'assigned':
            e => { return <p>Not implemented</p>; }, //to an actor, by an actor
        'unassigned':
            e => { return <p>Not implemented</p>; }, //by an actor
        'milestoned':
            e => { return <p>Not implemented</p>; }, //by an actor
        'demilestoned':
            e => { return <p>Not implemented</p>; }, //by an actor
        'labeled':
            e => { return <p>Not implemented</p>; }, //by an actor
        'unlabeled':
            e => { return <p>Not implemented</p>; }, //by an actor
        'renamed':
            e => { return <p>Not implemented</p>; }, //by an actor
        'locked':
            e => { return <p>Not implemented</p>; }, //by an actor
        'head_ref_deleted':
            e => { return <p>Not implemented</p>; }, //for a pull req, by an actor
        'head_ref_restored':
            e => { return <p>Not implemented</p>; }, //for a pull req, by an actor
};