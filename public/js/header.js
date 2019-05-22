var Header = React.createClass({

  render : function() {
    return React.createElement("header", {className:"navbar navbar-expand"},
        React.createElement("a", {href:"./", className:"navbar-brand mr-0 mr-md-2"},
          "PitterPatter"
        ),
        React.createElement("div", {className:"col-10 mx-auto"},
          React.createElement("ul", {className:"nav navbar-collapse"},
            React.createElement("li", {className:"nav-item ml-auto"}, React.createElement("a", {href:"./work.html", className:"nav-link"}, "Work")),
            React.createElement("li", {className:"nav-item"}, React.createElement("a", {href:"./post.html", className:"nav-link"}, "Post Jobs")),
            React.createElement("li", {className:"nav-item"}, "Built on ", React.createElement("a", {href:"http://bountium.org"}, "Bountium"))
          )
        )
      );
  }

});

window.onload = function() {
  ReactDOM.render(
    React.createElement(Header, {}),
    document.getElementById("header")
  );
}
