import * as React from "react";
import { Menu } from "semantic-ui-react";

export default class Header extends React.Component<any, any> {
  state = { activeItem: "home" };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;

    return (
      <Menu secondary>
        <Menu.Item
          name="home"
          active={activeItem === "home"}
          onClick={this.handleItemClick}
        />
      </Menu>
    );
  }
}
