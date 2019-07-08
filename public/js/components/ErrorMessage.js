// TODO we can probably dynamically look at error #2 and ensure they included the 0x
// TODO which catch() does this go in?
// Is the user on the right network (ropsten vs mainnet)?
// did the user include 0x in the address?
// Did they mis type the address?
var ErrorMessage = React.createClass({

  render : function() {
    if (this.props.invalidAddress)
      return React.createElement("div", {className:"jumbotron"},
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
    return React.createElement("div", {className:"jumbotron"},
      React.createElement("p", {}, "We're sorry - an error we don't recognise occurred. Post this experience in our ",
        React.createElement("a", {href:"https://www.reddit.com/r/Bountium/submit?selftext=true"}, "forum"),
        " or ",
        React.createElement("a", {href:"https://gitlab.com/bountium/bountium-marketplace/issues/new"}, "issue tracker"),
        " to make sure it gets fixed."
      )
    );
  }

});
