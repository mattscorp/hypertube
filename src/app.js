import React, { Component } from "react";
import Form from "./form.js";
import "./styles.css";

class App extends Component {
  onSubmit = fields => {
    console.log(fields);
  };

  render() {
    return (
      <div className="App">
        <Form onSubmit={fields => this.onSubmit(fields)} />
      </div>
    );
  }
}
export default App;
