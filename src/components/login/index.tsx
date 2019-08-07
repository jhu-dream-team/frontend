import * as React from "react";
import { Container, Button, Form } from "semantic-ui-react";
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
        <Container>
          <Form className={style["login_box"]}>
            <Form.Field>
              <label>Username</label>
              <input
                className={style["login_input"]}
                value={values.username}
                placeholder={"Username"}
                onChange={event => this.handleUsername(event)}
              />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input
                className={style["login_input"]}
                type="password"
                placeholder={"Password"}
                value={values.password}
                onChange={event => this.handlePassword(event)}
              />
            </Form.Field>
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
          </Form>
        </Container>
      </div>
    );
  }
}

export default Login;
