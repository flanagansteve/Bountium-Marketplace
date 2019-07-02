var JobDetailsForm = React.createClass({

  // TODO maybe convert all the key val pair stuff to go here?

  render : function() {
    if (this.props.dataType == "string")
      return React.createElement("div", {className : "bounty-lookup-form"},
  			React.createElement("h5", {}, "Submit a new bounty with string instructions to this incentiviser market"),
  			React.createElement("input", {type:"text", id:"bounty-info-input", className:"form-control", placeholder:"Instructions here..."}),
  			React.createElement("button", {onClick:this.props.sendBounty, className:"btn btn-primary"}, "Post Job")
  		);
    else if (this.props.dataType == "uint")
      return React.createElement("div", {className : "bounty-lookup-form"},
        React.createElement("h5", {}, "Submit a new bounty with integer data to this incentiviser market"),
        React.createElement("label", {for:"bounty-info-input"}, "Data:"),
        React.createElement("input", {type:"number", id:"bounty-info-input"}),
        React.createElement("button", {onClick:this.props.sendBounty, className:"btn btn-primary"}, "Post Job")
      );
    else if (this.props.dataType == "jsonObj")
      return React.createElement("div", {className : "bounty-lookup-form"},
  			React.createElement("h5", {}, "Add pairs of labels & data to your heart's desire"),
  			React.createElement("p", {for:"bounty-info-input"}, "Workers will use this to accomplish your task"),
        React.createElement("div", {className:"container-fluid", id:"key-val-input"},
          this.props.keyValPairs.map(this.props.renderKeyValPairs),
    			React.createElement("input", {type:"text", id:"bounty-key-input", className:"col-5", placeholder:"Instruction Parameter Label"}),
    			React.createElement("input", {type:"text", id:"bounty-val-input", className:"col-5", placeholder:"Instruction Parameter Value"}),
          React.createElement("button", {onClick:this.props.addKeyValPair, className:"btn btn-info"}, "Add Data"),
  			)
      );
  }

});
