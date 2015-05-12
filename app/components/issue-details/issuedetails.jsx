/** @jsx React.DOM */
var React = require('react/addons'),
    BootstrapModalMixin = require('./modalmixin.jsx'),
    BreadCrumbs = require('../navigation/breadcrumbs.jsx'),
    Timeline = require('./timeline.jsx'),
    Github = require('../../api/github.js'),
    Marked = require('marked');

Marked.setOptions({
  renderer: new Marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

module.exports = React.createClass({
    //mixins: [BootstrapModalMixin],
    getInitialState: function() {
        return { loading: true };
    },
    componentDidMount: function () {
        var p = this.props;
        var params = this.props.params;

        console.log('mounting');
        var parts = [
            Github.getIssue(params.organisation, params.repository, params.issue),
            Github.getIssueEvents(params.organisation, params.repository, params.issue),
            Github.getIssueComments(params.organisation, params.repository, params.issue)
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
        var params = this.props.params;
    
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

        var rendered = Marked(bodyText);

        var body = s.loading ?
                    (
                        <div className="progress" style={{"width": "40%", "margin": "auto"}}>
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}} />
                        </div>
                    ) : (
                        <div>
                            <div dangerouslySetInnerHTML={{__html: rendered }}></div>
                            <Timeline issueEvents={s.events} heading="Activity"/>
                        </div>
                    );

        return  <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <BreadCrumbs organisation={params.organisation} repository={params.repository} issue={params.issue} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <h1>{title}</h1>
                            <p>rcknight opened this issue X days ago - 0 comments</p>
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-default">Edit</button>
                            <button className="btn btn-primary">New Issue</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            {body}
                        </div>
                    </div>

                </div>
        ;
    }
});

 
