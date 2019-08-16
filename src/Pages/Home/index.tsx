import * as React from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Checkbox,
  Container,
  Segment,
  Loader,
  Dimmer
} from "semantic-ui-react";
import { inject, observer } from "mobx-react";
const style = require("./styles.scss");

@inject("rootStore")
@observer
class Home extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      question_categories: [],
      game_name: "",
      selected_question_sets: [],
      modalOpen: false
    };
  }

  async componentDidMount() {
    this.props.rootStore.gameStore.getGames();
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

  onChangeName(event) {
    this.setState({ ...this.state, game_name: event.target.value });
  }

  async onCreateClick() {}

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

  async handleGameStart(id) {}

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
        <Segment>
          <Dimmer active={this.props.rootStore.gameStore.loading}>
            <Loader>Loading</Loader>
          </Dimmer>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell># Players</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.rootStore.gameStore.games.map(x => {
                return (
                  <Table.Row key={x.id}>
                    <Table.Cell>{x.name}</Table.Cell>
                    <Table.Cell>{x.players.count}</Table.Cell>
                    <Table.Cell>{x.state}</Table.Cell>
                    <Table.Cell>
                      {x.players.data
                        .map(y => y.id)
                        .includes(this.props.rootStore.userStore.profile.id) ? (
                        <div>
                          <Button primary>Enter</Button>
                          <Button secondary>Leave</Button>
                        </div>
                      ) : x.state == "Created" ? (
                        <div>
                          <Button priamry>Join</Button>
                        </div>
                      ) : null}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Segment>
      </div>
    );
  }
}

export default Home;
