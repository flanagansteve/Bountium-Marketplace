var PoCForm = React.createClass({

  getInitialState : function() {
    return {
      selectedPoC : "none"
    }
  },

  handlePoC : function(e) {
    this.setState({selectedPoC : e.target.value})
  },

  render : function() {
    return React.createElement("div", {className:"col-6"},
      React.createElement("h6", {}, "Proof of Completion"),
      React.createElement("small", {}, "How will people know your job got completed correctly?"),
      React.createElement("select", {className:"form-control", onChange:this.handlePoC},
        React.createElement("option", {default:true}, "Choose a completion assessment"),
        React.createElement("option", {value:"API Threshold"}, "Automatically Assessed using an API"),
        React.createElement("option", {value:"Secret"}, "Automatically Assessed using a secret"),
        React.createElement("option", {value:"Photo Evidence"}, "Community Assessed via Photo Evidence"),
        React.createElement("option", {value:"Verbal Description"}, "Community Assessed via Verbal Description"),
        React.createElement("option", {value:"Poster Approved"}, "Manual Approval by the Poster")
      ),
      React.createElement("div", {},
        (
          this.state.selectedPoC == "none" &&
          React.createElement("small", {className:"text-center text-secondary"}, "Choose a proof of completion mechanism")
        ),
        (
          this.state.selectedPoC == "API Threshold" &&
          React.createElement("small", {className:"text-center text-secondary"}, "you chose api threshold")
        ),
        (
          this.state.selectedPoC == "Secret" &&
          React.createElement("small", {className:"text-center text-secondary"}, "you chose secret")
        ),
        (
          this.state.selectedPoC == "Photo Evidence" &&
          React.createElement("small", {className:"text-center text-secondary"}, "you chose photo evidence")
        ),
        (
          this.state.selectedPoC == "Verbal Description" &&
          React.createElement("small", {className:"text-center text-secondary"}, "you chose verbal description")
        ),
        (
          this.state.selectedPoC == "Poster Approved" &&
          React.createElement("small", {className:"text-center text-secondary"}, "you chose manual approval")
        )
      )
    );
  }

});
