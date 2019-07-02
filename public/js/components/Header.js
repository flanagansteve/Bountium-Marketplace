var Header = React.createClass({

  render : function() {
    worklink = window.location.href.includes("/post/?market") ? window.location.href.replace("/post", "/work") : "/work"
    postlink = window.location.href.includes("/work/?market") ? window.location.href.replace("/work", "/post") : "/post"
    return React.createElement("header", {className:"navbar navbar-expand"},
        React.createElement("a", {href:"/", className:"navbar-brand mr-0 mr-md-2"},
          "Home"
        ),
        React.createElement("div", {className:"col-11 mx-auto"},
          React.createElement("ul", {className:"nav navbar-collapse"},
            React.createElement("li", {className:"nav-item ml-auto"}, React.createElement("a", {href:worklink, className:"nav-link"}, "Fulfill Orders")),
            React.createElement("li", {className:"nav-item"}, React.createElement("a", {href:postlink, className:"nav-link"}, "Post Orders")),
            React.createElement("li", {className:"nav-item"}, "Built on ", React.createElement("a", {href:"http://bountium.org"}, "Bountium"))
          )
        )
      );
  }

});
