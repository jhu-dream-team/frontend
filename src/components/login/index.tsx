import * as React from "react";
import { inject, observer } from "mobx-react";
const style = require("./styles.scss");

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
      <div className={style["login_page"]}>
        <div className={style["login_box"]}>
          <p className={style["login_title"]}>Please login</p>
          <input
            className={style["login_input"]}
            value={values.username}
            placeholder={"Username"}
            onChange={event => this.handleUsername(event)}
          />
          <input
            className={style["login_input"]}
            type="password"
            placeholder={"Password"}
            value={values.password}
            onChange={event => this.handlePassword(event)}
          />
          {error != null ? (
            <p className={style["login_error"]}>Error: {error}</p>
          ) : null}
          <button
            className={style["login_button"]}
            type="submit"
            onClick={event => this.onSubmit(event)}
          >
            Login
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
