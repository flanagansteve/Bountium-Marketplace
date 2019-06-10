// TODO catch invalid address errors and suggest:
  // Is the user on the right network (ropsten vs mainnet)?
  // did the user include 0x in the address?
  // Did they mis type the address?
// TODO incorporate registrar
  // for keyword search
  // just a table of popular ones to choose from
// TODO let a submitter set up a profile with their name + history. perhaps
// set them up with a contract?
// TODO post-dapp and work-dapp should import the BountyReview/Submission react
// classes from another file to keep them in sync
// TODO let users drag pairs around to reorder them

incentiviserABI = web3.eth.contract([{"constant":true,"inputs":[],"name":"oracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"bountyID","type":"uint256"}],"name":"settle","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"bountyID","type":"uint256"}],"name":"fund","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bounties","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_oracle","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]);

assessorABI = web3.eth.contract([{"constant": true,"inputs": [{"name": "bountyID","type": "uint256"}],"name": "viewBountyInfo","outputs": [{"name": "bountyInfo","type": "bytes"},{"name": "infoType","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "bountyID","type": "uint256"}],"name": "completed","outputs": [{"name": "completed_","type": "bool"},{"name": "completer","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "bountyID","type": "uint256"},{"name": "claim","type": "bytes"}],"name": "respond","outputs": [{"name": "received","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "data","type": "bytes"}],"name": "submit","outputs": [{"name": "received","type": "bool"},{"name": "bountyID","type": "uint256"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": false,"name": "bountyID","type": "uint256"},{"indexed": false,"name": "sender","type": "address"}],"name": "RequestReceived","type": "event"}]);

incentiviser = null;
assessor = null;

liveMarketAddr = "0xfce2e8c52578026ddaa24899921586591bb73fca";
testMarketAddr = "0xe748d6628cb4f0e87c48509b227b82f831411733";

window.addEventListener('load', async () => {
  // check for metamask
  if(typeof web3 !== 'undefined') {
    await ethereum.enable();
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  try {
    userAccount = web3.eth.accounts[0];
    updateInterface();
    var accountInterval = setInterval(function() {
      if (web3.eth.accounts[0] !== userAccount) {
        userAccount = web3.eth.accounts[0];
        updateInterface();
      }
    }, 100);
  } catch (e) {
    console.error(e);
  }
});

function updateInterface() {
	document.getElementById("workflow-container").innerHTML = "";
  var addr = location.search;
  if (addr.includes("market=0x")) {
		// presuming its a valid incent addr... TODO
		incentiviser = incentiviserABI.at(addr.substring(addr.indexOf("market=") + "market=".length, addr.indexOf("market=") + "market=".length + 42));
    incentiviser.oracle((err, res) => {
      if (err)
        console.error(err)
      assessor = assessorABI.at(res);
      assessor.viewBountyInfo(0, (err, res) => {
        if (!err) {
    			ReactDOM.render(
    	      React.createElement(Dashboard,
              {
                incentAddr:incentiviser.address,
                dataType:res[1]
              }, userAccount
            ),
    	      document.getElementById("dashboard")
    	    );
        } else {
          // No bounties have been set for this market. TODO how, then, do we get
          // its data type? Just presuming a string for now...
          if (err.message.includes("not a base 16")) {
            ReactDOM.render(
      	      React.createElement(Dashboard, {incentAddr:incentiviser.address}, userAccount),
      	      document.getElementById("dashboard")
      	    );
          } else {
            console.error(err);
          }
        }
      });
    });
  } else {
    ReactDOM.render(
      React.createElement(Dashboard, {incentAddr:"0x"}, userAccount),
      document.getElementById("dashboard")
    );
  }
}

var Dashboard = React.createClass({

  getInitialState : function() {
    var mdt = "string"
    if (this.props.dataType != null)
      mdt = this.props.dataType;
    return {
      incentAddr : this.props.incentAddr,
      marketDataType : mdt
    }
  },

  setIncentAddr : function() {
    // TODO handle "invalid incent addr" error
    incentiviser = incentiviserABI.at(document.getElementById("incentiviser-addr-input").value);
    incentiviser.oracle((err, res) => {
      if (err)
        console.error(err)
      assessor = assessorABI.at(res);
      // get bounty data type
      assessor.viewBountyInfo(0, (err, res) => {
        if (!err) {
          this.setState({marketDataType:res[1]});
          this.setState({incentAddr:document.getElementById("incentiviser-addr-input").value});
        } else {
          // No bounties have been set for this market. TODO how, then, do we get
          // its data type? Just presuming a string for now...
          if (err.message.includes("not a base 16")) {
            this.setState({incentAddr:document.getElementById("incentiviser-addr-input").value});
          } else {
            console.error(err);
          }
        }
      })
    });
  },

  lookupIncentByKeyword : function() {
    // TODO
  },

  render : function() {
    var br = React.createElement("br", {});
    if (this.state.incentAddr != "0x") {
      return React.createElement("div", {},
        React.createElement("div", {className:""}, br,
          React.createElement(IncentiviserOverview, {dataType:this.state.marketDataType})
        )
      );
    }
    return React.createElement("div", {},
      React.createElement("div", {className:"col-12"},
        React.createElement("h3", {}, "Find a market for your job"),
        React.createElement("div", {},
          React.createElement("p", {}, "Example market on Ropsten at: ",
            React.createElement("a", {href:"/post.html?market=" + testMarketAddr}, testMarketAddr)
          ),
          React.createElement("p", {}, "Suggested main market on Mainnet at: ",
            React.createElement("a", {href:"/post.html?market=" + liveMarketAddr}, liveMarketAddr)
          ),
          React.createElement("label", {for:"incentiviser-addr-input"}, "Look market up by address"),
          br,
          React.createElement("input", {type:"text", className:"form-control col-6", id:"incentiviser-addr-input", placeholder:"0x123..."}),
          br,
          React.createElement("button", {onClick:this.setIncentAddr, className:"btn btn-primary"}, "Lookup market")
        ), br,
        React.createElement("div", {className:"incentiviser-search-form"},
          React.createElement("label", {for:"incentiviser-keyword-input"}, "Look market up by keyword"),
          br,
          React.createElement("input", {type:"text", className:"form-control col-6", id:"incentiviser-keyword-input", placeholder:"ie, \"Delivery\""}),
          br,
          React.createElement("button", {onClick:this.lookupIncentByKeyword, className:"btn btn-primary"}, "Lookup market")
        )
        // TODO show either most popular incents in table here, or search results
      )
    );
  }
});

var IncentiviserOverview = React.createClass({

  getInitialState : function() {
    return {
      viewedBounty : {
        bounty : 0,
        bountyID : -1,
        bountyData : null,
        completed : false,
        completer : "0x"
      },
      keyValPairs : []
    }
  },

  undisplayBounty : function() {
    this.setState({viewedBounty:{
      bounty : 0,
      bountyID : -1,
      bountyData : null,
      completed : false,
      completer : "0x"
    }});
  },

  sendBounty : function() {
    if (this.props.dataType == "string" || this.props.dataType == "jsonObj")
      this.sendToAssessor(stringToBytes(document.getElementById("bounty-info-input").value));
    else if (this.props.dataType == "uint")
      this.sendToAssessor(uintToBytes(document.getElementById("bounty-info-input").value));
  },

  getBountyById : function(id) {
    var vq = this.state.viewedBounty;
    vq.bountyID = id;
    incentiviser.bounties(vq.bountyID, (err, res) => {
      if (err)
        console.error(err)
      else
        vq.bounty = res
    });
    assessor.completed(vq.bountyID, (err, res) => {
      if (err) {
        console.error(err)
      } else {
        vq.completed = res[0];
        if (res[0])
          vq.completer = res[1];
      }
    });
		assessor.viewBountyInfo(vq.bountyID, (err, res) => {
			if (err) {
				if(err.message.includes("not a base 16")) {
					vq.bountyData = stringToBytes("No bounty set with this ID on this market");
					vq.dataType = "string";
					this.setState({viewedBounty:vq});
				} else {
					console.error(err);
				}
			} else {
        vq.bountyData = res[0];
        vq.dataType = res[1];
        this.setState({viewedBounty:vq});
      }
		});
  },

  getBounty : function() {
    var vq = this.state.viewedBounty;
    vq.bountyID = document.getElementById("bounty-id-input").value;
    incentiviser.bounties(vq.bountyID, (err, res) => {
      if (err)
        console.error(err)
      else
        vq.bounty = res
    });
    assessor.completed(vq.bountyID, (err, res) => {
      if (err) {
        console.error(err)
      } else {
        vq.completed = res[0];
        if (res[0])
          vq.completer = res[1];
      }
    });
		assessor.viewBountyInfo(vq.bountyID, (err, res) => {
			if (err) {
				if(err.message.includes("not a base 16")) {
					vq.bountyData = stringToBytes("No bounty set with this ID on this market");
					vq.dataType = "string";
					this.setState({viewedBounty:vq});
				} else {
					console.error(err);
				}
			} else {
        vq.bountyData = res[0];
        vq.dataType = res[1];
        this.setState({viewedBounty:vq});
      }
		});
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

  editPair : function(e) {
    document.getElementById("bounty-key-input").value = this.state.keyValPairs[e.target.id].key;
    document.getElementById("bounty-val-input").value = this.state.keyValPairs[e.target.id].val;
    var kvp = this.state.keyValPairs;
    kvp.splice(e.target.id, 1);
    this.setState({keyValPairs:kvp});
  },

  renderKeyValPairs : function(pair, i) {
    return React.createElement("div", {key:i},
      React.createElement("input", {className:"col-5", value:"Label: " + pair.key, disabled:true}),
      React.createElement("input", {className:"col-5", value:"Data: " + pair.val, disabled:true}),
      React.createElement("button", {className:"btn btn-info", id:i, onClick:this.editPair}, "Edit"),
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

  sendJSONBounty : function() {
    // TODO there's likely a way to actually create the JSON obj as a state var
    // and replace the following loop with toString(). This works for now tho:
    var toSend = "{";
    for (let i = 0; i < this.state.keyValPairs.length; i++) {
      toSend += "\"" + this.state.keyValPairs[i].key +
                "\":\"" + this.state.keyValPairs[i].val + "\",";
    }
    // remove last comma:
    toSend = toSend.substring(0, toSend.length - 1);
    toSend += "}"
    this.sendToAssessor(stringToBytes(toSend));
  },

  sendToAssessor : function(bytes) {
    assessor.submit(bytes, (err, res) => {
        if(err)
          console.error(err);
        else {
          var confirmSubmission = assessor.RequestReceived((err, res) => {
            if (err)
              console.error(err);
            else {
              if (res.args.sender == userAccount) {
                alert("Success - review your bounty below.");
                this.getBountyById(res.args.bountyID);
              }
            }
          })
          alert("Your job posting is being processed. If you'd like to make sure it processed correctly, wait a bit and it will show up below.");
        }
      }
    );
  },

  render : function() {
    var mainMarket = incentiviser.address == liveMarketAddr;
    var testMarket = incentiviser.address == testMarketAddr;
    var hr = React.createElement("hr", {});
    var headerText = React.createElement("h3", {onClick:this.undisplayBounty}, "Welcome to market: ", React.createElement("a", {href:"#"}, "Custom Market"));
    if (mainMarket) {
      headerText = React.createElement("h3", {onClick:this.undisplayBounty}, "Welcome to market: ", React.createElement("a", {href:"#"}, "The Live Market"));
    } else if (testMarket) {
      headerText = React.createElement("h3", {onClick:this.undisplayBounty}, "Welcome to market: ", React.createElement("a", {href:"#"}, "The Test Market"));
    }
    var header = React.createElement("div", {},
      React.createElement("div", {className:"nav navbar-collapse mx-auto"},
        headerText,
        React.createElement("br", {className:"d-md-none"}),
        React.createElement("a", {className:"btn btn-secondary float-right nav-item ml-auto", href:"/post.html"}, "Search for Custom Market"),
        (!testMarket && React.createElement("a", {className:"btn btn-primary float-right nav-item", href:"/post.html?market=" + testMarketAddr}, "Go to Test Market")),
        (!mainMarket && React.createElement("a", {className:"btn btn-info float-right nav-item", href:"/post.html?market=" + liveMarketAddr}, "Go to Live Market"))
      ),
      hr
    );
		var br = React.createElement("br", {});
    var lookupForm = React.createElement("div", {className : "bounty-lookup-form"},
      React.createElement("h5", {}, "Search up a bounty you already posted to see its status"),
			React.createElement("label", {for:"bounty-id-input"}, "Look a bounty up by its ID"),
			br,
			React.createElement("input", {type:"number", id:"bounty-id-input", className:"form-control"}),
			br,
			React.createElement("button", {onClick:this.getBounty, className:"btn btn-primary"}, "Look up")
		);
		var submissionForm;
    // TODO handle other marketDataTypes
    if (this.props.dataType == "string")
      submissionForm = React.createElement("div", {className : "bounty-lookup-form"},
  			React.createElement("h5", {}, "Submit a new bounty with string instructions to this incentiviser market"),
  			br,
  			React.createElement("input", {type:"text", id:"bounty-info-input", className:"form-control", placeholder:"Instructions here..."}),
  			br,
  			React.createElement("button", {onClick:this.sendBounty, className:"btn btn-primary"}, "Post Job")
  		);
    else if (this.props.dataType == "uint")
      submissionForm = React.createElement("div", {className : "bounty-lookup-form"},
        React.createElement("h5", {}, "Submit a new bounty with integer data to this incentiviser market"),
        br,
        React.createElement("label", {for:"bounty-info-input"}, "Data:"),
        br,
        React.createElement("input", {type:"number", id:"bounty-info-input"}),
        br,
        React.createElement("button", {onClick:this.sendBounty, className:"btn btn-primary"}, "Post Job")
      );
    else if (this.props.dataType == "jsonObj")
      submissionForm = React.createElement("div", {className : "bounty-lookup-form"},
  			React.createElement("h5", {}, "Add pairs of labels & data to your heart's desire"),
  			React.createElement("p", {for:"bounty-info-input"}, "Workers will use this to accomplish your task"),
        React.createElement("p", {}, React.createElement("a", {href:"#", onClick:this.shirtTemplate}, "Use our printing order template to make your request even easier to complete!")),
        React.createElement("div", {className:"container-fluid", id:"key-val-input"},
          this.state.keyValPairs.map(this.renderKeyValPairs),
    			React.createElement("input", {type:"text", id:"bounty-key-input", className:"col-6", placeholder:"Instruction Parameter Label"}),
    			React.createElement("input", {type:"text", id:"bounty-val-input", className:"col-6", placeholder:"Instruction Parameter Value"}),
    			br, br,
          React.createElement("button", {onClick:this.addKeyValPair, className:"btn btn-secondary"}, "Add Data"),
  			), br,
  			React.createElement("button", {onClick:this.sendJSONBounty, className:"btn btn-primary"}, "Post Job")
      );
    var forms = React.createElement("div", {className:"col-12"}, submissionForm, hr, lookupForm);
    if (this.state.viewedBounty.bountyID == -1)
      return React.createElement("div", {className:"container-fluid"},
				header,
				forms
      );
    return React.createElement("div", {className:"container-fluid"},
			header,
			React.createElement(BountyReview, {bounty:this.state.viewedBounty}),
      React.createElement("button", {onClick:this.undisplayBounty, className:"btn btn-info float-right"}, "Post another job")
    );
  }
});

var BountyReview = React.createClass({

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
              dataObj[key].substr(dataObj[key].length - 5) == ".jpeg"
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
  			bountyData = bytesToInt(this.props.bounty.bountyData);
  		bountyInstructions = React.createElement("p", {}, "Relevant data/instructions: " + bountyData);
  	}
		var input = React.createElement("input", {type:"number", className:"form-control", id:"bounty-response-input"});
		if (this.props.bounty.dataType == "string" || this.props.bounty.dataType == "jsonObj") {
			input = React.createElement("input", {type:"text", className:"form-control", placeholder:"Follow this market's instructions to submit evidence of completion", id:"bounty-response-input"});
		} else {
			bountyData = bytesToInt(this.props.bounty.bountyData);
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
      React.createElement("p", {}, "Amount to send, in Ether"),
      React.createElement("input", {id:"wei-to-send"}),
      React.createElement("button", {className:"btn btn-primary", onClick:this.fund}, "Fund")
    );
  }
});

function intToBytes(int) {
  var result = Math.abs(int).toString(16);
  while(result.length < 64)
    result = "0" + result;
  return "0x" + result;
}

function stringToBytes(string) {
  var result = '';
  for (var i=0; i<string.length; i++)
    result += ''+string.charCodeAt(i).toString(16);
	while (result.length < 64)
		result += "0"
  return "0x" + result;
}

function bytesToString(bytes) {
  var bytes = "" + bytes;
  var result = '';
  for (var i = 0; i < bytes.length; i+=2)
    if (bytes.substr(i, 2) != "00" && bytes.substr(i, 2) != "0x")
    	result += String.fromCharCode(parseInt(bytes.substr(i, 2), 16));
  return result;
}

function bytesToInt(bytes) {
	return Number(bytes);
}

window.alert = function(text) {
  ReactDOM.render(
    React.createElement("div", {className:"alert alert-warning alert-dismissible fade show", role:"alert", id:"to-dismiss"},
      text,
      React.createElement("button", {
        type:"button",
        className:"close",
        dataDismiss:"alert",
        ariaLabel:"Close",
        onClick:function() { document.getElementById("to-dismiss").remove() }
      }, React.createElement("span", {ariaHidden:"true"}, "x"))
    ),
    document.getElementById("workflow-container")
  );
}
