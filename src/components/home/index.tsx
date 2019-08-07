import * as React from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Checkbox,
  Container
} from "semantic-ui-react";
import * as socket_io from "socket.io-client";
import { Socket } from "net";
import { inject, observer } from "mobx-react";
import GameService from "../../services/game";
import QuestionService from "../../services/question";
import { isObject } from "mobx/lib/internal";
const style = require("./styles.scss");

@observer
@inject("authStore", "userStore")
class Home extends React.Component<any, any> {
  private socket;
  private game_service;
  private question_service;

  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      message: "",
      messages: [],
      games: [],
      question_categories: [],
      game_name: "",
      selected_question_sets: [],
      modalOpen: false
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
    });
    this.game_service = new GameService(
      "http://localhost:5000",
      props.authStore
    );
    this.question_service = new QuestionService(
      "http://localhost:5000",
      props.authStore
    );
  }

  async componentDidMount() {
    var result = await this.game_service.get_games().catch(err => {
      console.log(err);
    });
    var question_categories = await this.question_service
      .get_categories()
      .catch(err => {
        console.log(err);
      });
    this.setState({
      ...this.state,
      games: result["data"],
      question_categories: question_categories["data"]
    });
  }

  onChangeMessage(message) {
    this.setState({
      ...this.state,
      message: message.target.value
    });
  }

  onChangeCheckbox(id) {
    var index = this.state.selected_question_sets.indexOf(id);
    var nextState = Object.assign({}, this.state);
    if (index !== -1) {
      nextState.selected_question_sets.splice(index, 1);
    } else {
      nextState.selected_question_sets.push(id);
    }
    this.setState(nextState);
  }

  message() {
    this.socket.emit("message", this.state.message);
    this.setState({
      ...this.state,
      messages: this.state.messages.concat([this.state.message]),
      message: ""
    });
  }

  onChangeName(event) {
    this.setState({ ...this.state, game_name: event.target.value });
  }

  async onCreateClick() {
    var result = await this.game_service
      .create_game(this.state.game_name, this.state.selected_question_sets)
      .catch(err => console.log(err));
    var games = this.state.games;
    games.push(result);
    this.setState({
      ...this.state,
      games: games,
      modalOpen: false
    });
  }

  handleModalOpen() {
    this.setState({
      ...this.state,
      modalOpen: true
    });
  }

  handleModalClose() {
    this.setState({
      ...this.state,
      modalOpen: false
    });
  }

  goToGame(id) {
    this.props.history.replace("/game/" + id);
  }

  async handleGameStart(id) {
    var result = await this.game_service
      .start_game(id)
      .catch(err => console.log(err));
    var games = this.state.games;
    for (var game in games) {
      if (games[game].id == id) {
        games[game].state = "STARTED";
      }
    }
    this.setState(
      {
        ...this.state,
        games: games
      },
      () => console.log(this.state)
    );
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <h1 className={style["title"]}> Welcome to Wheel of Jeopardy </h1>
        <Modal
          open={this.state.modalOpen}
          onClose={() => this.handleModalClose}
          trigger={
            <Button primary onClick={() => this.handleModalOpen()}>
              Create Game
            </Button>
          }
        >
          <Modal.Header>Create a new game</Modal.Header>
          <Modal.Content>
            <Container>
              <Form>
                <Form.Field>
                  <label>Name</label>
                  <input
                    placeholder="Name"
                    value={this.state.game_name}
                    onChange={event => this.onChangeName(event)}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Question Sets</label>
                </Form.Field>
                {this.state.question_categories.map(x => (
                  <Form.Field>
                    <Checkbox
                      checked={this.state.selected_question_sets.includes(x.id)}
                      onClick={() => this.onChangeCheckbox(x.id)}
                      label={x.name + "(" + x.questions.length + ")"}
                    />
                  </Form.Field>
                ))}
                <Form.Field>
                  <Button
                    primary
                    disabled={
                      this.state.selected_question_sets.length < 1 ||
                      this.state.game_name.length < 1
                    }
                    onClick={() => this.onCreateClick()}
                  >
                    Create Game
                  </Button>
                </Form.Field>
              </Form>
            </Container>
          </Modal.Content>
        </Modal>
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
                  return (
                    <Table.Row key={x.id}>
                      <Table.Cell>{x.name}</Table.Cell>
                      <Table.Cell>{x.state}</Table.Cell>
                      <Table.Cell>
                        {!x.players.includes(this.props.userStore.user_id) ? (
                          <Button>Join</Button>
                        ) : x.state == "STARTED" ? (
                          <Button onClick={() => this.goToGame(x.id)}>
                            Enter
                          </Button>
                        ) : x.owner == this.props.userStore.user_id ? (
                          <Button
                            primary
                            onClick={() => this.handleGameStart(x.id)}
                          >
                            Start
                          </Button>
                        ) : null}
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
