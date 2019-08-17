import * as React from "react";
import { Menu } from "semantic-ui-react";
import { inject, observer } from "mobx-react";

@inject("rootStore")
@observer
export default class Header extends React.PureComponent<any, any> {
  render() {
    console.log(this.props.rootStore.routingStore);
    return (
      <Menu>
        <Menu.Item
          name="home"
          active={this.props.rootStore.routingStore.location.pathname.includes(
            "home"
          )}
          onClick={() => this.props.rootStore.routingStore.replace("/")}
        >
          Home
        </Menu.Item>
        {this.props.rootStore.authStore.isAuthenticated ? (
          <Menu.Item
            name="logout"
            onClick={() => localStorage.removeItem("token")}
          >
            Logout
          </Menu.Item>
        ) : null}
      </Menu>
    );
  }
}
