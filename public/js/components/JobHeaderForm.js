var JobHeaderForm = React.createClass({

  render : function() {
    return React.createElement("div", {className : "bounty-lookup-form"},
      React.createElement("h5", {}, "Title and Describe Your Job"),
      React.createElement("input", {
        type:"text",
        value: this.props.jobTitle,
        placeholder:"Title...",
        className:"form-control",
        id:"bounty-title-input",
        onChange:this.props.updateDetails}),
      React.createElement("textarea", {
        placeholder:"Description of your job...",
        value: this.props.jobDescription,
        className:"form-control mt-2",
        id:"bounty-description-input",
        onChange:this.props.updateDetails}),
      React.createElement("h5", {className:"mt-2"}, "To help people see your job, pick a category for it"),
      React.createElement("select", {
        className:"form-control",
        id:"bounty-category-input",
        value: this.props.jobCategory,
        onChange:this.props.handleCategory},
        React.createElement("option", {value:"General"}, "General"),
        React.createElement("option", {value:"T Shirt Printing"}, "T Shirt Printing"),
        React.createElement("option", {value:"Sticker Printing"}, "Sticker Printing"),
        React.createElement("option", {value:"Software Outsourcing"}, "Software Outsourcing"),
        React.createElement("option", {value:"Growth Marketing"}, "Growth Marketing"),
        React.createElement("option", {value:"Design"}, "Design"),
        React.createElement("option", {value:"Content Creation"}, "Content Creation"),
        React.createElement("option", {value:"Translation"}, "Translation")
      )
    );
  }

});
