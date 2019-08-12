var Bounty = React.createClass({

  // converts a JSON pair of key : imageUrl to a div with the label and rendered img
  keyValToImgDiv : function(labelAndUrl, key) {
    return React.createElement("div", {key:key},
      React.createElement("p", {}, labelAndUrl[0]),
      React.createElement("img", {src:labelAndUrl[1], className:"supplier-instructions-img"}),
      React.createElement("p", {}, "Link to downloadable image: ", React.createElement("a", {href:labelAndUrl[1]}, labelAndUrl[1]))
    );
  },

  strToP : function(str, key) {
    return React.createElement("p", {key:key}, str);
  },

  fund : function() {
    incentiviser.fund.sendTransaction(
      this.props.bounty.bountyID,
      {from:userAccount, value : web3.toWei(document.getElementById("wei-to-send").value, 'ether')},
      (err, res) => {
      if(err)
        console.error(err);
      else {
        alert("Your funding is being sent. If you'd like, wait for the transaction to confirm in your wallet and refresh the page to see the new bounty balance");
      }
    });
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
        if (err.message.includes("expected")) {
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
  		bountyInstructions = React.createElement("div", {}, imgsArr.map(this.keyValToImgDiv), instructionsArr.map(this.strToP));
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
				React.createElement("p", {}, "Payment Available: " + this.props.bounty.bounty + " wei"),
				React.createElement("p", {}, "Relevant data/instructions: " + bountyData)
			);
    if (this.props.bounty.completed) {
      return React.createElement("div", {className:"col-12"},
    		React.createElement("p", {}, "Bounty id: " + this.props.bounty.bountyID),
    		React.createElement("p", {}, "Bounty Available: " + this.props.bounty.bounty + " wei"),
    		bountyInstructions,
    		React.createElement("p", {}, "Completed: Yes, by " + this.props.bounty.completer),
    		React.createElement("button", {onClick:this.settle, className:"btn btn-primary"}, "Pay out")
    	);
    }
    return React.createElement("div", {className:"col-12"},
      React.createElement("p", {}, "Order id: " + this.props.bounty.bountyID),
      React.createElement("p", {}, "Payment Available: " + this.props.bounty.bounty + " wei"),
      bountyInstructions,
      React.createElement("p", {}, "Completed: No"),
      React.createElement("legend", {}, "Fund this bounty to hasten its completion"),
      React.createElement("label", {htmlFor:"wei-to-send"}, "Amount to send, in Ether"),
      React.createElement("input", {id:"wei-to-send", className:"form-control col-4"}),
      React.createElement("button", {className:"btn btn-primary mt-2", onClick:this.fund}, "Fund")
    );
  }
});

function bytesToString(bytes) {
  var bytes = "" + bytes;
  var result = '';
  for (var i = 0; i < bytes.length; i+=2)
    if (bytes.substr(i, 2) != "00" && bytes.substr(i, 2) != "0x")
    	result += String.fromCharCode(parseInt(bytes.substr(i, 2), 16));
  return result;
}
