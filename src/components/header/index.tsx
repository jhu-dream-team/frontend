import * as React from "react";
import { Menu } from "semantic-ui-react";
import { inject, observer } from "mobx-react";

@inject("rootStore")
@observer
export default class Header extends React.Component<any, any> {
  state = { activeItem: "home" };

  handleItemClick = name => {
    window.location.replace("/");
    this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;

    return (
      <Menu>
        <Menu.Item
          name="home"
          active={activeItem === "home"}
          onClick={() => this.handleItemClick("home")}
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
