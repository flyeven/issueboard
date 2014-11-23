/** @jsx React.DOM */
var React = require('react/addons'),
    BootstrapModalMixin = require('./modalmixin.jsx'),
    Github = require('../../api/github.js');

module.exports = React.createClass({
    mixins: [BootstrapModalMixin],
    getInitialState: function() {
        return { loading: true };
    },
    componentDidMount: function () {
        var p = this.props;
        console.log('mounting');
        var parts = [
            Github.getIssue(p.organisation, p.repository, p.number),
            Github.getIssueEvents(p.organisation, p.repository, p.number),
            Github.getIssueComments(p.organisation, p.repository, p.number)
        ];
        Promise.all(parts).then(function(parts) {
            //want to merge events and comments into one stream

            //while filtering out certain event types

            this.setState({ loading: false, issueData: parts[0], events: parts[1], comments: parts[2]});
        }.bind(this));
    },
    //these should all return a dom element describing the event
    eventFormatters: {
        'closed': 
            e => { return null; }, //issue closed
         'reopened':
            e => { return null; }, //issue reopened
         'merged':
            e => { return null; }, //pull request merged
         'referenced':
            e => { return null; }, //from a commit
         'mentioned':
            e => { return null; }, //in another issue
         'assigned':
            e => { return null; }, //to an actor, by an actor
         'unassigned':
            e => { return null; }, //by an actor
         'milestoned':
            e => { return null; }, //by an actor
         'demilestoned':
            e => { return null; }, //by an actor
         'labelled':
            e => { return null; }, //by an actor
         'unlabelled':
            e => { return null; }, //by an actor
         'renamed':
            e => { return null; }, //by an actor
         'locked':
            e => { return null; }, //by an actor
         'head_ref_deleted':
            e => { return null; }, //for a pull req, by an actor
         'head_ref_restored':
            e => { return null; }, //for a pull req, by an actor
    },
    render: function() {
        var s = this.state;
        var buttons = [];
        if(this.props.buttons !== undefined)
        {
            buttons = this.props.buttons.map(function(button) {
                      return <button type="button" className={'btn btn-' + button.type} onClick={button.handler}>
                        {button.text}
                      </button>;
                    });
        }
    
        var title = s.loading ? 
                    <strong>Loading Issue...</strong> : 
                    <strong>{s.issueData.title}</strong>;

        console.log("ISSUE DATA IN RENDER",s.issueData);
        var text = JSON.stringify(s.issueData,null," ");
        var events = JSON.stringify(s.events,null," ");
        var comments = JSON.stringify(s.comments, null, " ");
        console.log(text);
        var body = s.loading ?
                    (
                        <div className="progress" style={{"width": "40%", "margin": "auto"}}>
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}} />
                        </div>
                    ) : (
                        <div>
                            <pre>{text}</pre>
                            <pre>{events}</pre>
                            <pre>{comments}</pre>
                        </div>
                    );

        return <div className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                {this.renderCloseButton()}
                {title}
              </div>
              <div className="modal-body">
                {body}
              </div>
              <div className="modal-footer">
                {buttons}
              </div>
            </div>
          </div>
        </div>;
    }
});

 
