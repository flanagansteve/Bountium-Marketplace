// TODO better welcome screen
// TODO header with welcome logo
window.addEventListener('load', async () => {
  ReactDOM.render(
    React.createElement("div", {className:"welcome-user-options"},
      React.createElement("h1", {}, "Welcome to PitterPatter"),
      React.createElement("h3", {}, "PitterPatter is still very much unfinished, but feel free to poke around and send feedback to: steveflanagan@protonmail.com"),
      React.createElement("p", {}, "PitterPatter is the best place to find work and find workers online. We nurture marketplaces for all kinds of work, and ensure jobs are awarded meritocratically and completed to every last poster's expectations. We're built, with love, on Bountium."),
      React.createElement("p", {}, "PitterPatter uses smart contracts to make sure all jobs are processed fairly and automatically. To use these, and PitterPatter, you'll need to install ",
      React.createElement("a", {href : "https://metamask.io"}, "Metamask.")),
      React.createElement("p", {}, "To use the example marketplaces, set Metamask to the Ropsten test network."),
      React.createElement("p",{}, React.createElement("a", {href:"./post.html"}, "Post a job")),
      React.createElement("p",{}, React.createElement("a", {href:"./work.html"}, "Find jobs"))
    ),
    document.getElementById("dashboard")
  );
});
