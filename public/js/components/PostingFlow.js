var PostingFlow = React.createClass({

  getInitialState : function() {
    return {
      step : 0,
      keyValPairs : [],
      jobTitle : "",
      jobDescription : "",
      jobCategory : "General"
    }
  },

  pushKeyValPair : function(key, val) {
    var newPairsList = this.state.keyValPairs;
    newPairsList.push({key:key, val:val});
    this.setState({keyValPairs:newPairsList});
  },

  addKeyValPair : function() {
    var key = document.getElementById("bounty-key-input").value;
    var val = document.getElementById("bounty-val-input").value;
    this.pushKeyValPair(key, val);
    document.getElementById("bounty-key-input").value = "";
    document.getElementById("bounty-val-input").value = "";
  },

  deletePair : function(e) {
    var kvp = this.state.keyValPairs;
    kvp.splice(e.target.id, 1);
    this.setState({keyValPairs:kvp});
  },

  editPair : function(e) {
    document.getElementById("bounty-key-input").value = this.state.keyValPairs[e.target.id].key;
    document.getElementById("bounty-val-input").value = this.state.keyValPairs[e.target.id].val;
    this.deletePair(e)
  },

  renderKeyValPairs : function(pair, i) {
    return React.createElement("div", {key:i, className:"mb-1"},
      React.createElement("input", {className:"col-9 col-lg-5", value:"Label: " + pair.key, disabled:true}),
      React.createElement("input", {className:"col-9 col-lg-5 mb-3 mb-lg-0", value:"Data: " + pair.val, disabled:true}),
      React.createElement("button", {className:"btn btn-info ml-2", id:i, onClick:this.editPair}, "Edit"),
      React.createElement("button", {className:"btn btn-danger ml-2", id:i, onClick:this.deletePair}, "X")
    );
  },

  shirtTemplate : function() {
    this.pushKeyValPair("Artwork (on transparent background)", "Click edit to specify");
    this.pushKeyValPair("Image of desired shirt", "Click edit to specify");
    this.pushKeyValPair("Artwork dimensions", "Click edit to specify");
    this.pushKeyValPair("Link to svg file of CMYK:", "Click edit to specify");
    this.pushKeyValPair("Quantity", "Click edit to specify");
    this.pushKeyValPair("Size", "Click edit to specify");
    this.pushKeyValPair("Blank Information, or Link to Blank", "Click edit to specify");
    this.pushKeyValPair("Due Date", "Click edit to specify");
    this.pushKeyValPair("Poster contact info", "Click edit to specify");
  },

  nextStep : function() {
    this.setState({step:this.state.step + 1})
  },

  lastStep : function() {
    this.setState({step:this.state.step - 1})
  },

  updateDetails : function() {
    this.setState({jobTitle : document.getElementById("bounty-title-input").value});
    this.setState({jobDescription : document.getElementById("bounty-description-input").value});
    this.setState({jobCategory : document.getElementById("bounty-category-input").value});
  },

  handleCategory : function(e) {
    this.updateDetails()
    if (e.target.value != this.state.jobCategory) {
      switch(e.target.value) {
        case "T Shirt Printing":
          if (!this.state.keyValPairs.length !== 9)
            this.shirtTemplate();
          break;
        default:
          // do nothing
      }
    }
  },

  sendJSONBounty : function() {
    var toSend = {};
    // title, description, and category:
    toSend.Title = this.state.jobTitle;
    toSend.Description = this.state.jobDescription;
    toSend.Category = this.state.jobCategory;
    for (let i = 0; i < this.state.keyValPairs.length; i++)
      toSend[this.state.keyValPairs[i].key] = this.state.keyValPairs[i].val;
    this.sendToAssessor(stringToBytes(JSON.stringify(toSend)));
  },

  sendToAssessor : function(bytes) {
    this.props.assessor.submit(bytes, (err, res) => {
        if(err)
          console.error(err);
        else {
          var confirmSubmission = this.props.assessor.RequestReceived((err, res) => {
            if (err)
              console.error(err);
            else {
              if (res.args.sender == userAccount) {
                alert("Success - review your bounty below.");
                this.props.getBountyById(res.args.bountyID);
              }
            }
          })
          alert("Your job posting is being processed. If you'd like to make sure it processed correctly, wait a bit and it will show up below.");
        }
      }
    );
  },

  sendBounty : function() {
    if (this.props.dataType == "string" || this.props.dataType == "jsonObj")
      this.sendToAssessor(stringToBytes(document.getElementById("bounty-info-input").value));
    else if (this.props.dataType == "uint")
      this.sendToAssessor(intToBytes(document.getElementById("bounty-info-input").value));
  },

  render : function() {
    if (this.state.step == 0) {
      return React.createElement("div", {className:""},
        React.createElement(JobHeaderForm, {
          jobTitle : this.state.jobTitle,
          jobDescription : this.state.jobDescription,
          jobCategory : this.state.jobCategory,
          updateDetails : this.updateDetails,
          handleCategory : this.handleCategory
        }),
        React.createElement("button", {onClick:this.nextStep, className:"btn btn-primary mt-2"}, "→")
      );
    } else if (this.state.step == 1) {
      return React.createElement("div", {className:""},
        React.createElement(JobDetailsForm, {
          sendBounty : this.sendBounty,
          dataType : this.props.dataType,
          keyValPairs : this.state.keyValPairs,
          renderKeyValPairs : this.renderKeyValPairs,
          addKeyValPair : this.addKeyValPair
        }),
        React.createElement("div", {className:"mt-2"},
          React.createElement("button", {onClick:this.lastStep, className:"btn btn-primary mr-1"}, "←"),
          React.createElement("button", {onClick:this.nextStep, className:"btn btn-primary"}, "→")
        )
      );
    }
    return React.createElement("div", {className:""},
      React.createElement("h5", {}, "Configure your job's evaluation"),
      React.createElement("p", {}, "Workers and suppliers on Bountium are more likely to complete jobs with clear, fair standards for completion - choose one of our tools for evaluating your job, or set up your own if need be. Using one of the recommended methods will help your job get more attention."),
      React.createElement("div", {className:"container row"},
        React.createElement(PoCForm, {}),
        React.createElement(PoAForm, {}),
      ),
      React.createElement("div", {className:"mt-2"},
        React.createElement("button", {onClick:this.lastStep, className:"btn btn-primary mr-1"}, "←"),
        React.createElement("button", {onClick:this.sendJSONBounty, className:"btn btn-primary"}, "Post Job")
      )
    );
  }

});
