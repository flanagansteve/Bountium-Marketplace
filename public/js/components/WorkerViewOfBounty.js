var Bounty = React.createClass({

  submit : function() {
		var response = null;
		if (this.props.bounty.dataType == "string" || this.props.bounty.dataType == "jsonObj")
			response = stringToBytes(document.getElementById("bounty-response-input").value);
		else
			response = intToBytes(document.getElementById("bounty-response-input").value);
    assessor.respond(
      this.props.bounty.bountyID,
      response,
      function(err, res) {
        if (err)
          console.error(err)
        alert("Your response is on its way! Come back later and look the bounty up again to see if it was marked as completed.")
      }
    )
  },

  keyValToImgDiv : function(labelAndUrl, key) {
    return React.createElement("div", {key:key},
      React.createElement("p", {}, labelAndUrl[0]),
      React.createElement("img", {src:labelAndUrl[1], className:"supplier-instructions-img"}),
      React.createElement("p", {}, "Link to downloadable image: ", React.createElement("a", {href:labelAndUrl[1]}, labelAndUrl[1]))
    );
  },

  render : function() {
  	var bountyInstructions = null;
  	if (this.props.bounty.dataType == "jsonObj") {
      var dataObj;
      var imgsArr = [];
  		var instructionsArr = [];
  		try {
        dataObj = JSON.parse(bytesToString("" + this.props.bounty.bountyData));
      } catch (err) {
        console.error(err);
        if (err.message.includes("expected") || err.message.includes("unterminated")) {
          instructionsArr.push("The poster of this bounty has sent malformed instruction data and we can't display it well. Here is the raw instruction data:");
          instructionsArr.push(bytesToString("" + this.props.bounty.bountyData));
        }
      }
  		for (var key in dataObj) {
  			if (dataObj.hasOwnProperty(key)) {
          try {
            // if one of the params is an image url, render properly
            if (
              dataObj[key].substr(dataObj[key].length - 4) == ".jpg" ||
              dataObj[key].substr(dataObj[key].length - 4) == ".png" ||
              dataObj[key].substr(dataObj[key].length - 5) == ".jpeg" ||
              dataObj[key].substr(dataObj[key].length - 4) == ".svg"
            ) {
              imgsArr.push([key, dataObj[key]]);
            } else {
      				instructionsArr.push(key + " : " + dataObj[key]);
            }
          } catch (e) {
            instructionsArr.push(key + " : " + dataObj[key]);
          }
  			}
  		}
  		bountyInstructions = React.createElement("div", {},
        imgsArr.map(this.keyValToImgDiv),
        instructionsArr.map((str, key) => React.createElement("p", {key:key}, str))
      );
  	} else {
  		var bountyData = null;
  		if (this.props.bounty.dataType == "string")
  			bountyData = bytesToString("" + this.props.bounty.bountyData);
  		else
  			bountyData = Number(this.props.bounty.bountyData);
  		bountyInstructions = React.createElement("p", {}, "Relevant data/instructions: " + bountyData);
  	}
		var input = React.createElement("input", {type:"number", className:"form-control", id:"bounty-response-input"});
		if (this.props.bounty.dataType == "string" || this.props.bounty.dataType == "jsonObj") {
			input = React.createElement("input", {type:"text", className:"form-control", placeholder:"Follow this market's instructions to submit evidence of completion", id:"bounty-response-input"});
		} else {
			bountyData = Number(this.props.bounty.bountyData);
		}
		if (bountyData == "No bounty set with this ID on this market")
			return React.createElement("div", {className:"col-12"},
				React.createElement("p", {}, "Order id: " + this.props.bounty.bountyID),
        React.createElement("p", {}, "Bounty Available: " + web3.fromWei(this.props.bounty.bounty, "ether") + " ETH"),
				React.createElement("p", {}, "Relevant data/instructions: " + bountyData)
			);
    if (this.props.bounty.completed)
      return React.createElement("div", {className:"col-12"},
    		React.createElement("p", {}, "Bounty id: " + this.props.bounty.bountyID),
    		React.createElement("p", {}, "Bounty Available: " + web3.fromWei(this.props.bounty.bounty, "ether") + " ETH"),
    		bountyInstructions,
    		React.createElement("p", {}, "Completed: Yes, by " + this.props.bounty.completer),
    		React.createElement("button", {onClick:this.settle, className:"btn btn-primary"}, "Pay out")
    	);
    return React.createElement("div", {className:"col-12"},
      React.createElement("p", {}, "Order id: " + this.props.bounty.bountyID),
      React.createElement("p", {}, "Bounty Available: " + web3.fromWei(this.props.bounty.bounty, "ether") + " ETH"),
      bountyInstructions,
      React.createElement("p", {}, "Completed: No"),
      React.createElement("div", {className:"bounty-response-form"},
        React.createElement("label", {for:"bounty-response-input"}, "Submit a response to this bounty"),
        React.createElement("br", {}),
				input,
        React.createElement("br", {}),
				React.createElement("button", {onClick:this.submit, className:"btn btn-primary"}, "Submit")
      )
    );
  }
});

function intToBytes(int) {
  var result = Math.abs(int).toString(16);
  while(result.length < 64)
    result = "0" + result;
  return "0x" + result;
}
