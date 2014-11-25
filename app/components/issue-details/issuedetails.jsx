/** @jsx React.DOM */
var React = require('react/addons'),
    BootstrapModalMixin = require('./modalmixin.jsx'),
    Timeline = require('./timeline.jsx'),
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
            console.log("EVENTS::::",parts[1]);
            var mixedEvents = parts[1].data.concat(parts[2].data.map(
                                                c => {
                                                    //make comments look something like normal events
                                                    c.event = "comment";
                                                    c.actor = c.user;
                                                    return c;
                                                }))
                                            .sort((x,y) => 
                                                        new Date(x.created_at) -
                                                        new Date(y.created_at));

            this.setState({ loading: false, issueData: parts[0].data, events: mixedEvents });
        }.bind(this));
    },
    render: function() {
        var s = this.state;
        var buttons = [{ type: "primary", text: "Close Issue" }];
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

        var text = JSON.stringify(s.issueData,null," ");
        var events = JSON.stringify(s.events,null," ");
        var comments = JSON.stringify(s.comments, null, " ");
        console.log("Rendering issue details. Loading:", s.loading);

        var bodyText = "No Description Given";
        if(s.issueData !== undefined && s.issueData.body !== "")
            bodyText = s.issueData.body;

        var body = s.loading ?
                    (
                        <div className="progress" style={{"width": "40%", "margin": "auto"}}>
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}} />
                        </div>
                    ) : (
                        <div>
                            <p>{bodyText}</p>
                            <Timeline issueEvents={s.events} heading="Activity"/>
                        </div>
                    );

        return <div className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 class="modal-title">{title}</h4>
              </div>
              <div className="modal-body">
                {body}
              </div>
              { !s.loading ? 
              <div className="modal-footer">
                {buttons}
              </div>
              : null }
            </div>
          </div>
        </div>;
    }
});

 
