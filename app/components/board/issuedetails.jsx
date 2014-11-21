/** @jsx React.DOM */
var React = require('react/addons'),
    BootstrapModalMixin = require('./modalmixin.jsx'),
    Github = require('../../api/github.js');

module.exports = React.createClass({
    mixins: [BootstrapModalMixin],
    getInitialState: function() {
        return { loading: true };
    },
    componendDidMount: function () {
        console.log('mounting');
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
                    <strong>{s.issue.title}</strong>;

        var body = s.loading ?
                    (
                        <div className="progress" style={{"width": "40%", "margin": "auto"}}>
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}} />
                        </div>
                    ) : (
                        <h1>Some issue</h1>
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

 
