incentiviserABI = web3.eth.contract([{"constant":true,"inputs":[],"name":"oracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"bountyID","type":"uint256"}],"name":"settle","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"bountyID","type":"uint256"}],"name":"fund","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bounties","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_oracle","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]);

assessorABI = web3.eth.contract([{"constant": true,"inputs": [{"name": "bountyID","type": "uint256"}],"name": "viewBountyInfo","outputs": [{"name": "bountyInfo","type": "bytes"},{"name": "infoType","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "bountyID","type": "uint256"}],"name": "completed","outputs": [{"name": "completed_","type": "bool"},{"name": "completer","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "bountyID","type": "uint256"},{"name": "claim","type": "bytes"}],"name": "respond","outputs": [{"name": "received","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "data","type": "bytes"}],"name": "submit","outputs": [{"name": "received","type": "bool"},{"name": "bountyID","type": "uint256"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": false,"name": "bountyID","type": "uint256"},{"indexed": false,"name": "sender","type": "address"}],"name": "RequestReceived","type": "event"}]);

incentiviser = null;
assessor = null;

liveMarketAddr = "0xfce2e8c52578026ddaa24899921586591bb73fca";
testMarketAddr = "0xe748d6628cb4f0e87c48509b227b82f831411733";

// TODO we can probably dynamically look at error #2 and ensure they included the 0x
// TODO figure out which catch() this goes in
// Is the user on the right network (ropsten vs mainnet)?
// did the user include 0x in the address?
// Did they mis type the address?
var debuggingInvalidAddress =
  React.createElement("div", {},
    React.createElement("p", {}, "Uh oh! We couldn't communicate with that smart contract address from your web3 client. It may be a couple things:"),
    React.createElement("ul", {},
      React.createElement("li", {}, "Are you on the correct network? If you're trying to use the example market, you must be on Ropsten - click on Metamask to switch. If you're trying to use the live market, you must be on the main network."),
      React.createElement("li", {}, "Did you include the initial 0x of the market's address, type in the whole address, and type it correctly? You typed in: "),// + incentiviser.address),
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
  var addr = location.search;
  if (addr.includes("market=0x")) {
		// presuming its a valid incent addr... TODO
		incentiviser = incentiviserABI.at(addr.substring(addr.indexOf("market=") + "market=".length, addr.indexOf("market=") + "market=".length + 42));
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
      	      React.createElement(WorkingDashboard,
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
        	      React.createElement(WorkingDashboard, {incentAddr:incentiviser.address}, userAccount),
        	      document.getElementById("dashboard")
        	    );
            } else {
              console.error(err);
            }
          }
        });
      }
    });
  } else {
    // Go to live market by default
    incentiviser = incentiviserABI.at(liveMarketAddr);
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
      	      React.createElement(WorkingDashboard,
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
        	      React.createElement(WorkingDashboard, {incentAddr:incentiviser.address}, userAccount),
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
}

var WorkingDashboard = React.createClass({

  getInitialState : function() {
    var name_ = "your business"
    // NOTE: to format right, the owner's name must be prepended by ", " if we have it
    var owner_ = "!"
    var mdt = "string"
    if (this.props.dataType != null)
      mdt = this.props.dataType;
    return {
      incentAddr : this.props.incentAddr,
      name : name_,
      owner : owner_,
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
    // If an incentiviser has been selected
    if (this.state.incentAddr != "0x") {
      return React.createElement("div", {},
        React.createElement("div", {className:""}, br,
          React.createElement(WorkingFeed, {dataType:this.state.marketDataType})
        )
      );
    }
    return React.createElement("div", {},
      React.createElement("div", {className:"col-12"},
        React.createElement("h3", {}, "Find a market for your job"),
        React.createElement("div", {},
          React.createElement("p", {}, "Example market on Ropsten at: ",
            React.createElement("a", {href:"/work?market=" + testMarketAddr}, testMarketAddr)
          ),
          React.createElement("p", {}, "Suggested main market on Mainnet at: ",
            React.createElement("a", {href:"/work?market=" + liveMarketAddr}, liveMarketAddr)
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

// A constant for how many jobs to query from the contract at once
// TODO experiment with different vaks and find an ideal delay tradeoff.
const jobsPerFetch = 10;

var WorkingFeed = React.createClass({

  getInitialState : function() {
    // TODO somehow determine this from the market - hardcoding as the
    // UI is developed:
    var jstf = 40;
    return {
      viewedBounty : {
        bounty : 0,
        bountyID : -1,
        bountyData : null,
        completed : false,
        completer : "0x"
      },
      jobs:[],
      jobsStillToFetch : jstf,
      minPay : 0.0,
      category : ""
    }
  },

  componentDidMount : function() {
    this.fetchJobs();
  },

  displayBounty : function(event) {
    var vq = this.state.viewedBounty;
    vq.bountyID = event.currentTarget.id;
    incentiviser.bounties(vq.bountyID, (err, res) => {
      if (err)
        console.error(err)
      else
        vq.bounty = res.c[0]
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

  undisplayBounty : function() {
    this.setState({viewedBounty:{
      bounty : 0,
      bountyID : -1,
      bountyData : null,
      completed : false,
      completer : "0x"
    }});
  },

  getJob : function(id) {
    var jobs = this.state.jobs;
    var newJob = {
      id:id
    };
    incentiviser.bounties(id, (err, res) => {
      if (err) {
        console.error(err);
        return;
      } else {
        newJob.bounty = res.c[0];
      }
    });
    assessor.completed(id, (err, res) => {
      if (err) {
        console.error(err);
        return;
      } else {
        newJob.completed = res[0];
        if (res[0])
          newJob.completer = res[1];
      }
    });
    assessor.viewBountyInfo(id, (err, res) => {
      if (err) {
        if(err.message.includes("not a base 16")) {
          newJob.bountyData = stringToBytes("No bounty set with this ID on this market");
          newJob.dataType = "string";
          jobs.push(newJob);
          this.setState({jobs:jobs});
        } else {
          console.error(err);
        }
      } else {
        newJob.bountyData = res[0];
        newJob.dataType = res[1];
        jobs.push(newJob);
        this.setState({jobs:jobs});
      }
    });
  },

  fetchJobs : function() {
    var i = 0;
    for (i; i < jobsPerFetch; i++) {
      if (this.state.jobsStillToFetch - i - 1 < 0) {
        break;
      }
      this.getJob(this.state.jobsStillToFetch - i - 1);
    }
    if (this.state.jobsStillToFetch != 0)
      this.setState({jobsStillToFetch:this.state.jobsStillToFetch-=i})
  },

  mapJobs : function(job, key) {
    // TODO how do we filter by location? just do obj contains the location? or demand
    // a location field from the poster?
    try {
      if (web3.fromWei(job.bounty, "ether") * 1.0 < this.state.minPay
          // If its a jsonObj bounty, look for a category field and handle it:
          || (
              (this.state.category != "" &&
               job.dataType === "jsonObj" &&
               !Object.keys(JSON.parse(bytesToString(job.bountyData))).some((key) => key == "category"))
               ||
              (this.state.category != "" &&
               job.dataType === "jsonObj" &&
               JSON.parse(bytesToString(job.bountyData)).category != this.state.category)
             )
          // If its a string bounty, just see if it contains category
          || (this.state.category != "" &&
              job.dataType === "string" &&
              !job.bountyData.contains(this.state.category)))
          {
        return null;
      }
    } catch (err) {
      // json error so dont bother with this job:
      return null;
    }
    // Do not show data-less bounties
    if (bytesToString(job.bountyData) === "No bounty set with this ID on this market")
      return null;
    console.log(job)
    return React.createElement("tr", {key:key, onClick:this.displayBounty, id:job.id, title:"Click on a job to see its details or submit a claim"},
      React.createElement("td", {}, "" + job.id),
      React.createElement("td", {}, "" + web3.fromWei(job.bounty, "ether") + " ETH"),
      React.createElement("td", {}, "" + job.completed),
      React.createElement("td", {}, "" + job.completer)
    )
  },

  filterJobPay : function() {
    this.setState({minPay : document.getElementById("min-pay").value})
  },

  filterJobCategory : function(e) {
    this.setState({category : e.target.value})
  },

  filterJobLocation : function(e) {
    this.setState({location : e.target.value})
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
        React.createElement("a", {className:"btn btn-secondary float-right nav-item ml-auto", href:"/work"}, "Search for Custom Market"),
        (!testMarket && React.createElement("a", {className:"btn btn-primary float-right nav-item", href:"/work?market=" + testMarketAddr}, "Go to Test Market")),
        (!mainMarket && React.createElement("a", {className:"btn btn-info float-right nav-item", href:"/work?market=" + liveMarketAddr}, "Go to Live Market"))
      ),
      hr
    );
    var feedBody = null;
    if (this.state.jobs.length == 0) {
      feedBody = React.createElement("img", {src:"/img/loading.gif"});
    } else {
      feedBody = React.createElement("table", {className:"job-feed-tbl table"},
        React.createElement("tbody", {},
          React.createElement("tr", {},
            React.createElement("th", {}, "Key"),
            React.createElement("th", {}, "Award"),
            React.createElement("th", {}, "Completed"),
            React.createElement("th", {}, "Completer"),
          ),
          this.state.jobs.map(this.mapJobs)
        )
      );
    }
    var filterByPay = React.createElement("div", {className:"form-group"},
      React.createElement("label", {className:""}, "Filter by minimum pay, in ETH"),
      React.createElement("input", {
        type:"number",
        step:0.0000000000000001,
        value:this.state.minPay,
        id:"min-pay",
        onChange:this.filterJobPay,
        className:"form-control"})
    )
    var filterByCategory = React.createElement("select", {
      className:"form-control",
      id:"bounty-category-input",
      value: this.state.category,
      onChange:this.filterJobCategory},
      React.createElement("option", {value:""}, "Any category"),
      React.createElement("option", {value:"T Shirt Printing"}, "T Shirt Printing"),
      React.createElement("option", {value:"Sticker Printing"}, "Sticker Printing"),
      React.createElement("option", {value:"Software Outsourcing"}, "Software Outsourcing"),
      React.createElement("option", {value:"Growth Marketing"}, "Growth Marketing"),
      React.createElement("option", {value:"Design"}, "Design"),
      React.createElement("option", {value:"Content Creation"}, "Content Creation"),
      React.createElement("option", {value:"Translation"}, "Translation")
    );
    var filterByLocation = React.createElement("select", {
      className:"form-control",
      id:"bounty-location-input",
      value: this.state.location,
      onChange:this.filterJobLocation},
      React.createElement("option", {value:""}, "Any location"),
      React.createElement("option", {value:"Boston"}, "Boston"),
      React.createElement("option", {value:"New York City"}, "New York City"),
      React.createElement("option", {value:"San Fransisco"}, "San Fransisco"),
      React.createElement("option", {value:"Remote"}, "Remote")
    );
    var filterForm = React.createElement("div", {},
      filterByPay,
      React.createElement("div", {className:"form-group"},
        React.createElement("label", {className:""}, "Filter by category or location"),
        filterByCategory,
        filterByLocation
      )
    )
    var returnBtn = React.createElement("button", {onClick:this.undisplayBounty, className:"btn btn-info"}, "Return to Feed");
    if (this.state.viewedBounty.bountyID == -1) {
      return React.createElement("div", {className:"container-fluid", onMouseOver:this.fetchJobs},
        header,
        filterForm,
        React.createElement("a", {href:"#", className:"job-feed col-12 link-unstyled"},
          feedBody
        )
      );
    }
    return React.createElement("div", {className:"container-fluid"},
			header,
      React.createElement(Bounty, {bounty:this.state.viewedBounty}),
      returnBtn
    );
  }
});

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

window.alert = function(text) {
  ReactDOM.render(
    React.createElement(BootstrapAlert, {text:text}),
    document.getElementById("workflow-container")
  );
}
