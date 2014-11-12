var React = require('react');
var BreadCrumbs = require('../navigation/breadcrumbs.jsx');
module.exports = React.createClass({
    getInitialState: function () {
        return {
            loading: true,
            milestones: []
        };
    },
    render: function () {
        return (
            <div>
                <BreadCrumbs organisation={this.props.params.organisation} repository={this.props.params.repository}/>
                <h1>Repo Screen</h1>
            </div>
        );
    }
});

var milestone = React.createClass({
    getInitialState: function () {

    },
    componentDidMount: function () {

    },
    render: function () {

    }
});

var issue = React.createClass({

});