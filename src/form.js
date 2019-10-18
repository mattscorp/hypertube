import React from "react";

export default class Form extends React.Component {
  state = {
    FirstName: "",
    LastName: "",
    Pseudo: "",
    Email: "",
    Password: "",
    ConfirmationPassword: ""
  };

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(e.target.value);
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    return (
      <form>
        <input
          name="FirstName"
          placeholder="FirstName"
          value={this.state.FirstName}
          onChange={e => this.change(e)}
        />
        <br />
        <input
          name="LastName"
          placeholder="LastName"
          value={this.state.LastName}
          onChange={e => this.change(e)}
        />
        <br />
        <input
          name="Pseudo"
          placeholder="Pseudo"
          value={this.state.Pseudo}
          onChange={e => this.change(e)}
        />
        <br />
        <input
          name="Email"
          placeholder="Email"
          value={this.state.Email}
          onChange={e => this.change(e)}
        />
        <br />
        <input
          name="Password"
          placeholder="Password"
          type="password"
          value={this.state.Password}
          onChange={e => this.change(e)}
        />
        <br />
        <input
          name="ConfirmationPassword"
          placeholder="ConfirmationPassword"
          type="password"
          value={this.state.ConfirmationPassword}
          onChange={e => this.change(e)}
        />
        <br />
        <button onClick={e => this.onSubmit(e)}>Submit</button>
      </form>
    );
  }
}
