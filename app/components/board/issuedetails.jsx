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
        Github.getIssue(p.organisation, p.repository, p.number)
        .then(function(result) {
            console.log("ISSUE RESULT",result);
            console.log(this.setState);
            this.setState({ loading: false, issueData: result.data });
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
        
        console.log("WOFTAM", s.loading);
        var title = s.loading ? 
                    <strong>Loading Issue...</strong> : 
                    <strong>{s.issueData.title}</strong>;

        console.log("ISSUE DATA IN RENDER",s.issueData);
        var text = JSON.stringify(s.issueData,null," ");
        console.log(text);
        var body = s.loading ?
                    (
                        <div className="progress" style={{"width": "40%", "margin": "auto"}}>
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}} />
                        </div>
                    ) : (
                        <pre>{text}</pre>
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

 
