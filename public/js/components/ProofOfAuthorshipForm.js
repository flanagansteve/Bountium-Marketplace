var PoAForm = React.createClass({

  getInitialState : function() {
    return {
      selectedPoA : "none"
    }
  },

  handlePoA : function(e) {
    this.setState({selectedPoA : e.target.value})
  },

  render : function() {
    return React.createElement("div", {className:"col-6"},
      React.createElement("h6", {}, "Proof of Authorship"),
      React.createElement("small", {}, "How will people know who completed your job?"),
      React.createElement("select", {className:"form-control", onChange:this.handlePoA},
        React.createElement("option", {default:true}, "Choose an authorship assessment"),
        React.createElement("option", {value:"Time of Completion Prediction"}, "Time of Completion Prediction"),
        React.createElement("option", {value:"Cryptography"}, "Cryptographic Signature to Prove ID"),
        React.createElement("option", {value:"Photo Evidence"}, "Community Assessed via Timestamped Photo with user ID"),
        React.createElement("option", {value:"Verbal Description"}, "Community Assessed via Verbal Description"),
        React.createElement("option", {value:"Poster Approved"}, "Manual Choice by the Poster")
      ),
      React.createElement("div", {},
        (
          this.state.selectedPoA == "none" &&
          React.createElement("small", {className:"text-center text-secondary"}, "Choose a proof of authorship mechanism")
        ),
        (
          this.state.selectedPoA == "Time of Completion Prediction" &&
          React.createElement("small", {className:"text-center text-secondary"}, "you chose api threshold")
        ),
        (
          this.state.selectedPoA == "Cryptography" &&
          React.createElement("small", {className:"text-center text-secondary"}, "you chose secret")
        ),
        (
          this.state.selectedPoA == "Photo Evidence" &&
          React.createElement("small", {className:"text-center text-secondary"}, "you chose photo evidence")
        ),
        (
          this.state.selectedPoA == "Verbal Description" &&
          React.createElement("small", {className:"text-center text-secondary"}, "you chose verbal description")
        ),
        (
          this.state.selectedPoA == "Poster Approved" &&
          React.createElement("small", {className:"text-center text-secondary"}, "you chose manual approval")
        )
      )
    );
  }
});
