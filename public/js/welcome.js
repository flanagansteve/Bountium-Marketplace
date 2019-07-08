// TODO better welcome screen
// TODO header with welcome logo
window.addEventListener('load', async () => {
  ReactDOM.render(
    React.createElement(Header, {}),
    document.getElementById("header")
  );
  ReactDOM.render(
    React.createElement("div", {className:"welcome-user-options"},
      React.createElement("h1", {}, "Welcome to the Bountium Marketplace"),
      React.createElement("p", {}, "Here, you'll find requests for orders awaiting your completion, as well as tools to make your own requests. Most requests on this marketplace are automatically generated using ", React.createElement("a", {href:"https://gitlab.com/bountium/bountium-smart-contract-infrastructure/tree/master/DAO"}, "Bountium powered DAOs"), ", cutting-edge technology that makes running a business easier than ever before."),
      React.createElement("p", {}, "The Bountium Marketplace uses smart contracts to make sure all jobs are processed fairly and automatically. To use these, you'll need to install ",
      React.createElement("a", {href : "https://metamask.io"}, "Metamask.")),
      React.createElement("p", {}, "To use the example marketplaces, set Metamask to the Ropsten test network."),
      React.createElement("div", {className:"row"},
        React.createElement("a", {href:"./post/", className:"link-unstyled col-sm-6"},
          React.createElement("div", {className:"card bg-primary text-white"},
            React.createElement("div", {className:"card-body"},
              React.createElement("h5", {className:"card-title"}, "Need to get something done?"),
              React.createElement("p", {className:"card-text"}, "Post a job and let our global network of suppliers and workers do it right.")
            )
          )
        ),
        React.createElement("a", {href:"./work/", className:"link-unstyled col-sm-6"},
          React.createElement("div", {className:"card bg-info text-white"},
            React.createElement("div", {className:"card-body"},
              React.createElement("h5", {className:"card-title"}, "Want to make some money?"),
              React.createElement("p", {className:"card-text"}, "Access a world of fair and open revenue opportunities, across a variety of industries")
            )
          )
        )
      )
    ),
    document.getElementById("dashboard")
  );
});
