import * as React from "react";
import { Button, Table } from "semantic-ui-react";
import * as socket_io from "socket.io-client";
import { Socket } from "net";
import { inject, observer } from "mobx-react";
import GameService from "../../services/game";
const style = require("./styles.scss");

@observer
@inject("authStore", "userStore")
class Home extends React.Component<any, any> {
  private socket;
  private game_service;

  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      message: "",
      messages: [],
      games: []
    };
    this.socket = socket_io("http://localhost:5000");
    this.socket.on("connect", () => {
      this.setState({ ...this.state, connected: this.socket.connected });
    });
    this.socket.on("connected", msg => {
      this.setState({
        ...this.state,
        messages: this.state.messages.concat([msg])
      });
    });
    this.socket.on("disconnect", () => {
      this.setState({
        ...this.state,
        connected: this.socket.connected,
        messages: this.state.messages.concat(["Client disconnected"])
      });
    });
    this.socket.on("message", msg => {
      console.log(msg);
      this.setState({
        ...this.state,
        messages: this.state.messages.concat([msg])
      });
      console.log(this.state);
    });
    this.game_service = new GameService(
      "http://localhost:5000",
      props.authStore
    );
  }

  async componentDidMount() {
    var result = await this.game_service.get_games().catch(err => {
      console.log(err);
    });
    this.setState({ ...this.state, games: result["data"] }, () =>
      console.log(this.state)
    );
  }

  onChangeMessage(message) {
    this.setState({
      ...this.state,
      message: message.target.value
    });
    console.log(this.state);
  }

  message() {
    this.socket.emit("message", this.state.message);
    this.setState({
      ...this.state,
      messages: this.state.messages.concat([this.state.message]),
      message: ""
    });
  }

  render() {
    return (
      <div>
        <h1 className={style["title"]}> Welcome to Wheel of Jeopardy </h1>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.games.length > 0
              ? this.state.games.map(x => {
                  console.log(x);
                  return (
                    <Table.Row>
                      <Table.Cell>{x.name}</Table.Cell>
                      <Table.Cell>{x.state}</Table.Cell>
                      <Table.Cell>
                        {!x.players.includes(this.props.userStore.user_id) ? (
                          <Button>Join</Button>
                        ) : (
                          <Button>Enter</Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              : null}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default Home;
