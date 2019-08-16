import * as React from "react";
import * as validatejs from "validate.js";
import { Form, Button, Icon, Modal, Container } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { runInThisContext } from "vm";
const style = require("./styles.scss");

@observer
@inject("rootStore")
export default class SignUp extends React.Component<any, any> {
  private validation;

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      email_errorMessage: "",
      password_errorMessage: "",
      firstName_errorMessage: "",
      lastName_errorMessage: ""
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
      },
      firstName: {
        presence: { message: "^required" },
        length: { minimum: 1, message: "^Required" }
      },
      lastName: {
        presence: { message: "^required" },
        length: { minimum: 1, message: "^Rquired" }
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
      this.updateField("password", this.state.password),
      this.updateField("firstName", this.state.firstName),
      this.updateField("lastName", this.state.lastName)
    ].some(res => res);

    if (!anyErrors) {
      this.props.rootStore.authStore.signup({
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
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
            <Form.Input
              fluid
              icon
              iconPosition="left"
              placeholder="First name"
              error={!!this.state.firstName_errorMessage}
            >
              <Icon name="lock" />
              <input
                name="firstName"
                onChange={event =>
                  this.updateField("firstName", event.target.value)
                }
              />
            </Form.Input>
            {!!this.state.firstName_errorMessage && (
              <p className={style["login_error"]}>
                {this.state.firstName_errorMessage}
              </p>
            )}
            <Form.Input
              fluid
              icon
              iconPosition="left"
              placeholder="Last name"
              error={!!this.state.lastName_errorMessage}
            >
              <Icon name="users" />
              <input
                name="lastName"
                onChange={event =>
                  this.updateField("lastName", event.target.value)
                }
              />
            </Form.Input>
            {!!this.state.lastName_errorMessage && (
              <p className={style["login_error"]}>
                {this.state.lastName_errorMessage}
              </p>
            )}
            <Button
              circular
              fluid
              loading={this.props.rootStore.authStore.loading}
              disabled={
                this.state.email_errorMessage.length > 0 ||
                this.state.password_errorMessage.length > 0 ||
                this.state.firstName_errorMessage.length > 0 ||
                this.state.lastName_errorMessage.length > 0 ||
                this.state.email.length == 0 ||
                this.state.password.length == 0 ||
                this.state.firstName.length == 0 ||
                this.state.lastName.length == 0
              }
              style={{
                backgroundColor: "#230871",
                marginTop: 30,
                color: "#fff"
              }}
              onClick={this.submitForm}
            >
              Sign-Up
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
