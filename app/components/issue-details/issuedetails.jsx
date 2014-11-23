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
            
            this.setState({ loading: false, issueData: parts[0].data, events: parts[1].data, comments: parts[2].data});
        }.bind(this));
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
                            <Timeline events={s.events} heading="Activity"/>
                            <pre>{text}</pre>
                            <pre>{events}</pre>
                            <pre>{comments}</pre>
                        </div>
                    );

        return <div className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <h3>{title}</h3>
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

 
