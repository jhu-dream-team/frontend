import * as React from "react";
import { inject, observer } from "mobx-react";
//const style = require("./styles.scss");

@inject("authStore")
@observer
class Login extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleUsername(e) {
    this.props.authStore.setUsername(e.target.value);
  }

  handlePassword(e) {
    this.props.authStore.setPassword(e.target.value);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.authStore.login().then(() => this.props.history.replace("/"));
  }

  render() {
    const { error, values } = this.props.authStore;

    return (
      <div>
        <h1> Login </h1>
        <p>Username</p>
        <input
          value={values.username}
          onChange={event => this.handleUsername(event)}
        />
        <p>Password</p>
        <input
          type="password"
          value={values.password}
          onChange={event => this.handlePassword(event)}
        />
        <button type="submit" onClick={event => this.onSubmit(event)}>
          Log In
        </button>
        <p>{error}</p>
      </div>
    );
  }
}

export default Login;
