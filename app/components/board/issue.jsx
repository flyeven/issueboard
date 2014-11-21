var React = require('react/addons');
var Router = require('react-router');

module.exports = React.createClass({
    mixins: [Router.Navigation, Router.CurrentPath],
    render: function () {
        var tags = [];
        var cx = React.addons.classSet;
        var itemClasses = cx({
            'issue': true,
            'list-group-item': true,
            'list-group-item--done': this.props.closed,
            'issue__has-assignee': this.props.assignee
        });

        if(this.props.labels) {
            tags = this.props.labels.map(function(label) {
                var bg = "#" + label.color;
                return (<span className="label" style={{background: bg}}>{label.name}</span>);
            });
        }

        return (
            <li onClick={this.showDetails} className={itemClasses} draggable="true" onDrag={this.drag} onDragStart={this.dragStart} onDragEnd={this.dragEnd} >
                <h5 className="issue__title">{this.props.title}</h5>
                { this.props.assignee ? <p className="issue__assignee"><img src={this.props.assignee} /></p> : null }
                <p className="issue__tags">
                    <span className="label label-default"><span className="glyphicon glyphicon-comment"></span> {this.props.comments}</span>
                    {tags}
                </p>
            </li>
        );
    },
    drag: function (event) {
        event.dataTransfer.setData("text", event.target.id);
    },
    dragStart: function (event) {
        setTimeout(function() { 
            var el = this.getDOMNode();
            el.classList.add('list-group-item--dragging'); 
        }.bind(this), 0);
    },
    dragEnd: function (event) {
        var el=this.getDOMNode();
        el.classList.remove('list-group-item--dragging');
    },
    showDetails: function () {
        this.transitionTo(this.getCurrentPath() + "/" + this.props.number);
    }
});