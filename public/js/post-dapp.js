// TODO render the debuggingInvalidAddress when we get error: invalid address
  // The element is ready, the issue is actually figuring out where in the code
  // to render the element so that it shows up when the error happens...
  // the console.error() doesnt give a line number
// TODO let users drag pairs around to reorder them

incentiviserABI = web3.eth.contract([{"constant":true,"inputs":[],"name":"oracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"bountyID","type":"uint256"}],"name":"settle","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"bountyID","type":"uint256"}],"name":"fund","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bounties","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_oracle","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]);

assessorABI = web3.eth.contract([{"constant": true,"inputs": [{"name": "bountyID","type": "uint256"}],"name": "viewBountyInfo","outputs": [{"name": "bountyInfo","type": "bytes"},{"name": "infoType","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "bountyID","type": "uint256"}],"name": "completed","outputs": [{"name": "completed_","type": "bool"},{"name": "completer","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "bountyID","type": "uint256"},{"name": "claim","type": "bytes"}],"name": "respond","outputs": [{"name": "received","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "data","type": "bytes"}],"name": "submit","outputs": [{"name": "received","type": "bool"},{"name": "bountyID","type": "uint256"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": false,"name": "bountyID","type": "uint256"},{"indexed": false,"name": "sender","type": "address"}],"name": "RequestReceived","type": "event"}]);

incentiviser = null;
assessor = null;

liveMarketAddr = "0xfce2e8c52578026ddaa24899921586591bb73fca";
testMarketAddr = "0xe748d6628cb4f0e87c48509b227b82f831411733";

// TODO we can probably dynamically look at error #2 and ensure they included the 0x
// TODO which catch() does this go in?
// Is the user on the right network (ropsten vs mainnet)?
// did the user include 0x in the address?
// Did they mis type the address?
var debuggingInvalidAddress =
  React.createElement("div", {},
    React.createElement("p", {}, "Uh oh! We couldn't communicate with that smart contract address from your web3 client. It may be a couple things:"),
    React.createElement("ul", {},
      React.createElement("li", {}, "Are you on the correct network? If you're trying to use the test market, you must be on Ropsten - click on Metamask to switch. If you're trying to use the live market, you must be on the main network."),
      React.createElement("li", {}, "Did you include the initial 0x of the market's address, type in the whole address, and type it correctly?"),
      React.createElement("li", {}, "Are you sure the address you used points to a market contract, and not some other contract or another Ethereum user?")
    ),
    React.createElement("p", {}, "If none of these help, please, ",
      React.createElement("a", {href:"https://gitlab.com/bountium/bountium-marketplace/issues/new"}, "report this issue"),
    " and we will get back to you as soon as possible."
    )
  );

window.addEventListener('load', async () => {
  ReactDOM.render(
    React.createElement(Header, {}),
    document.getElementById("header")
  );
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
  if (location.search.includes("custom"))
    ReactDOM.render(
      React.createElement(Dashboard, {incentAddr:"0x"}, userAccount),
      document.getElementById("dashboard")
    );
  else if (location.search.includes("market=0x"))
    renderPostingInterface(location.search.substring(location.search.indexOf("market=") + "market=".length, location.search.indexOf("market=") + "market=".length + 42));
  else
    renderPostingInterface(liveMarketAddr);
}

function renderPostingInterface(marketAddress) {
  // presuming its a valid incent addr... TODO
  incentiviser = incentiviserABI.at(marketAddress);
  incentiviser.oracle((err, res) => {
    if (err) {
      if (err.message.include("invalid address")) {
        ReactDOM.render(
          debuggingInvalidAddress,
          document.getElementById("dashboard")
        );
      } else {
        console.error(err);
      }
    } else {
      assessor = assessorABI.at(res);
      assessor.viewBountyInfo(0, (err, res) => {
        if (!err) {
          ReactDOM.render(
            React.createElement(PostingInterface, {dataType:res[1]}),
            document.getElementById("dashboard")
          );
        } else {
          // No bounties have been set for this market. TODO how, then, do we get
          // its data type? Just presuming a string for now...
          if (err.message.includes("not a base 16")) {
            ReactDOM.render(
              React.createElement(PostingInterface, {dataType:"string"}),
              document.getElementById("dashboard")
            );
          } else {
            console.error(err);
          }
        }
      });
    }
  });
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
    return React.createElement("div", {},
      React.createElement("div", {className:"col-12"},
        React.createElement("h3", {}, "Find a market for your job"),
        React.createElement("div", {className:"mb-2"},
          React.createElement("p", {}, "Example market on Ropsten at: ",
            React.createElement("a", {href:"/post/?market=" + testMarketAddr}, testMarketAddr)
          ),
          React.createElement("p", {}, "Suggested main market on Mainnet at: ",
            React.createElement("a", {href:"/post/?market=" + liveMarketAddr}, liveMarketAddr)
          ),
          React.createElement("label", {for:"incentiviser-addr-input"}, "Look market up by address"),
          React.createElement("input", {type:"text", className:"form-control col-6", id:"incentiviser-addr-input", placeholder:"0x123..."}),
          React.createElement("button", {onClick:this.setIncentAddr, className:"btn btn-primary mt-2"}, "Lookup market")
        ),
        React.createElement("div", {className:"incentiviser-search-form"},
          React.createElement("label", {for:"incentiviser-keyword-input"}, "Look market up by keyword"),
          React.createElement("input", {type:"text", className:"form-control col-6", id:"incentiviser-keyword-input", placeholder:"ie, \"Delivery\""}),
          React.createElement("button", {onClick:this.lookupIncentByKeyword, className:"btn btn-primary mt-2"}, "Lookup market")
        )
        // TODO show either most popular incents in table here, or search results
      )
    );
  }
});

var PostingInterface = React.createClass({

  getInitialState : function() {
    return {
      viewedBounty : {
        bounty : 0,
        bountyID : -1,
        bountyData : null,
        completed : false,
        completer : "0x"
      }
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
    this.getBountyById(document.getElementById("bounty-id-input").value);
  },

  render : function() {
    var mainMarket = incentiviser.address == liveMarketAddr;
    var testMarket = incentiviser.address == testMarketAddr;
    var hr = React.createElement("hr", {});
    var headerText = React.createElement("h3", {onClick:this.undisplayBounty}, "Welcome to a ", React.createElement("a", {href:"#"}, "Custom Market"));
    if (mainMarket) {
      headerText = React.createElement("h3", {onClick:this.undisplayBounty}, "Welcome to the ", React.createElement("a", {href:"#"}, "Live Market"));
    } else if (testMarket) {
      headerText = React.createElement("h3", {onClick:this.undisplayBounty}, "Welcome to the ", React.createElement("a", {href:"#"}, "Test Market"));
    }
    var header = React.createElement("div", {},
      React.createElement("div", {className:"nav navbar-collapse mx-auto"},
        headerText,
        React.createElement("br", {className:"d-md-none"}),
        React.createElement("a", {className:"btn btn-secondary float-right nav-item ml-auto", href:"/post/?custom"}, "Search for Custom Market"),
        (!testMarket && React.createElement("a", {className:"btn btn-primary float-right nav-item", href:"/post/?market=" + testMarketAddr}, "Go to Test Market")),
        (!mainMarket && React.createElement("a", {className:"btn btn-info float-right nav-item", href:"/post/?market=" + liveMarketAddr}, "Go to Live Market"))
      ),
      hr
    );
    if (this.state.viewedBounty.bountyID == -1)
      return React.createElement("div", {className:"container-fluid"},
        header,
        React.createElement("div", {className:"col-12"},
          React.createElement(PostingFlow, {
            dataType : this.props.dataType,
            getBountyById : this.getBountyById,
            assessor : assessor
          }),
          hr,
          React.createElement(PosterLookupForm, {getBounty : this.getBounty})
        )
      )
    return React.createElement("div", {className:"container-fluid"},
			header,
			React.createElement(Bounty, {bounty:this.state.viewedBounty}),
      React.createElement("button", {onClick:this.undisplayBounty, className:"btn btn-info float-right"}, "Post another job")
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

window.alert = function(text) {
  ReactDOM.render(
    React.createElement(BootstrapAlert, {text:text}),
    document.getElementById("workflow-container")
  );
}
