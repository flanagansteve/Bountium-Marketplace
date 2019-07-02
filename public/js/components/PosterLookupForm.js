var PosterLookupForm = React.createClass({

  render : function() {
    return React.createElement("div", {className : ""},
      React.createElement("h5", {}, "Search up a bounty you already posted to see its status"),
			React.createElement("label", {for:"bounty-id-input"}, "Look a bounty up by its ID"),
			React.createElement("input", {type:"number", id:"bounty-id-input", className:"form-control mb-3"}),
			React.createElement("button", {onClick:this.props.getBounty, className:"btn btn-primary"}, "Look up")
		);
  }

});
