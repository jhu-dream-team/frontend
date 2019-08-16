import * as React from "react";
import * as validatejs from "validate.js";
import { Container, Button, Form, Icon } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
const style = require("./styles.scss");

@inject("rootStore")
@observer
class Login extends React.Component<any, any> {
  private validation;

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      email_errorMessage: "",
      password_errorMessage: ""
    };
    this.validation = {
      email: {
        presence: { message: "^required" },
        length: { minimum: 1, message: "^required" },
        email: { message: "^Must be a valid email" }
      },
      password: {
        presence: { message: "^required" },
        length: { minimum: 8, message: "^Must be at least 8 characters long" }
      }
    };
  }

  updateField(fieldName, value) {
    let errorMessages = validatejs.single(value, this.validation[fieldName]);
    const errorMessage = errorMessages ? errorMessages[0] : "";
    this.setState({
      [fieldName]: value,
      [`${fieldName}_errorMessage`]: errorMessage
    });
    return !!errorMessage;
  }

  submitForm = () => {
    const anyErrors = [
      this.updateField("email", this.state.email),
      this.updateField("password", this.state.password)
    ].some(res => res);

    if (!anyErrors) {
      this.props.rootStore.authStore.login({
        email: this.state.email,
        password: this.state.password,
        history: this.props.history
      });
    }
  };

  render() {
    return (
      <div className={style["login_page"]}>
        <Container>
          <Form className={style["login_box"]}>
            <Form.Input
              fluid
              icon
              iconPosition="left"
              placeholder="Email"
              error={!!this.state.email_errorMessage}
            >
              <Icon name="at" />
              <input
                name="email"
                onChange={event =>
                  this.updateField("email", event.target.value)
                }
              />
            </Form.Input>
            {!!this.state.email_errorMessage && (
              <p className={style["login_error"]}>
                {this.state.email_errorMessage}
              </p>
            )}
            <Form.Input
              fluid
              icon
              iconPosition="left"
              placeholder="Password"
              type="password"
              loading={this.props.rootStore.authStore.loading}
              error={!!this.state.password_errorMessage}
            >
              <Icon name="lock" />
              <input
                name="password"
                onChange={event =>
                  this.updateField("password", event.target.value)
                }
              />
            </Form.Input>
            {!!this.state.password_errorMessage && (
              <p className={style["login_error"]}>
                {this.state.password_errorMessage}
              </p>
            )}
            <Button
              circular
              fluid
              disabled={
                this.state.email_errorMessage.length > 0 ||
                this.state.password_errorMessage.length > 0 ||
                this.state.email.length == 0 ||
                this.state.password.length == 0
              }
              style={{
                backgroundColor: "#230871",
                marginTop: 30,
                color: "#fff"
              }}
              onClick={this.submitForm}
              loading={this.props.loginLoading}
            >
              Login
            </Button>
            {this.props.rootStore.authStore.errors.length > 0 && (
              <p className={style["login_error"]}>
                {this.props.rootStore.authStore.errors[0]}
              </p>
            )}
          </Form>
        </Container>
      </div>
    );
  }
}

export default Login;
