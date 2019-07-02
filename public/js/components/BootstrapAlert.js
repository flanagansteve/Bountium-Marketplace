var BootstrapAlert = React.createClass({

  render : function() {
    return React.createElement("div", {className:"alert alert-warning alert-dismissible fade show", role:"alert", id:"to-dismiss"},
      this.props.text,
      React.createElement("button", {
        type:"button",
        className:"close",
        dataDismiss:"alert",
        ariaLabel:"Close",
        onClick:function() { document.getElementById("to-dismiss").remove() }
      }, React.createElement("span", {ariaHidden:"true"}, "x"))
    );
  }
});
