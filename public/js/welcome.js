// TODO better welcome screen
// TODO header with welcome logo
window.addEventListener('load', async () => {
  ReactDOM.render(
    React.createElement("div", {className:"welcome-user-options"},
      React.createElement("h1", {}, "Welcome to the Bountium Marketplace"),
      React.createElement("p", {}, "Here, you'll find requests for orders awaiting your completion, as well as tools to make your own requests. Most requests on this marketplace are automatically generated using ", React.createElement("a", {href:"https://gitlab.com/bountium/bountium-smart-contract-infrastructure/tree/master/DAO"}, "Bountium powered DAOs"), ", cutting-edge technology that makes running a business easier than ever before."),
      React.createElement("p", {}, "The Bountium Marketplace uses smart contracts to make sure all jobs are processed fairly and automatically. To use these, you'll need to install ",
      React.createElement("a", {href : "https://metamask.io"}, "Metamask.")),
      React.createElement("p", {}, "To use the example marketplaces, set Metamask to the Ropsten test network."),
      React.createElement("a", {className:"btn btn-primary", href:"./post.html"}, "Post an Order"),
      React.createElement("a", {className:"btn btn-info float-right", href:"./work.html"}, "Fulfill Orders"),
    ),
    document.getElementById("dashboard")
  );
});
