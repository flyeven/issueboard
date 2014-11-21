var React = require('react/addons');
var Issue = require('./issue.jsx');
var Github = require('../../api/github.js');

module.exports = React.createClass({
    getInitialState: function () {
        return { dragOver: 0 };
    },
    dragOver: function (event) {
        event.preventDefault();
    },
    dragEnter: function (event) {
        event.preventDefault();
        this.setState({dragOver: this.state.dragOver + 1});
    },
    dragLeave: function (event) {
        this.setState({dragOver: this.state.dragOver - 1});
    },
    drop: function (event) {
        this.setState({dragOver: 0});
    },
    render: function () {
        var p = this.props,
            s = this.state,

            totalIssues = p.openIssues + p.closedIssues,
            percentComplete = totalIssues === 0 ? 0 : (p.closedIssues / totalIssues) * 100,
            percentCss = percentComplete + '%',

            progressbar = p.number === "none" ? null :
                <div className="progress">
                    <div className="progress-bar progress-bar-info" 
                         role="progressbar" 
                         aria-valuenow={percentComplete} 
                         aria-valuemin="0" 
                         aria-valuemax="100"
                         style={{width: percentCss}}>

                         {p.closedIssues} / {totalIssues}

                    </div>
                </div>,

            issues = p.issues.map(i => 
                {
                    return <Issue key={i.number}
                              title={i.title}
                              assignee={i.assignee_avatar}
                              labels={i.labels}
                              comments={i.comments}
                              closed={i.state == "closed"} />;
                });

            var issuesElement = issues;
            if(!p.expanded)
            {
                issuesElement = <button className="btn btn-default show-issues" onClick={this.expand}>Show Issues</button>;
            }

        return (
            <div className="panel panel-info issues-container__column"
                 onDragOver={this.dragOver} onDragEnter={this.dragEnter} 
                 onDragLeave={this.dragLeave} onDrop={this.drop}>

                <div className="panel-heading">
                    <h2 className="panel-title">{p.title}</h2>
                </div>

                <div className="panel-body">
                    {progressbar}
                    {p.description}
                    <ul className="list-group">
                        { s.dragOver ? <li className="issue-placeholder"></li> : null }
                        {issuesElement}
                    </ul>
                </div>

            </div>
        );
    },
    expand: function() {
        var p = this.props;
        p.onExpand(p.index);
    }
});
