import * as React from "react";
import {
  Modal,
  Button,
  Input,
  Container,
  Form,
  FormField
} from "semantic-ui-react";
import { observer, inject } from "mobx-react";

@inject("rootStore")
@observer
export default class AnswerModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      answer: ""
    };
  }

  onChangeAnswer(event) {
    this.setState({
      answer: event.target.value
    });
  }

  onSubmitAnswer() {
    this.props.rootStore.gameStore.submitAnswer(this.state.answer);
  }

  render() {
    return this.props.rootStore.gameStore.game.selected_question != null ? (
      <Modal
        open={
          this.props.rootStore.gameStore.game.sub_state == "Answering" &&
          this.props.rootStore.gameStore.game.players.data[
            this.props.rootStore.gameStore.game.spins %
              this.props.rootStore.gameStore.game.players.data.length
          ].id == this.props.rootStore.userStore.profile.id
        }
      >
        <Modal.Header>
          Question:{" "}
          {this.props.rootStore.gameStore.game.selected_question.question} (
          {this.props.rootStore.gameStore.game.selected_question.max_points}{" "}
          points)
        </Modal.Header>
        <Modal.Content>
          <Container>
            <Form>
              <Form.Field>
                <input
                  placeholder="Please enter your answer"
                  value={this.state.answer}
                  onChange={event => this.onChangeAnswer(event)}
                />
              </Form.Field>
              <Form.Field>
                <Button
                  loading={this.props.rootStore.gameStore.loading.answer}
                  disabled={
                    this.state.answer.length < 1 ||
                    this.props.rootStore.gameStore.loading.answer
                  }
                  onClick={() => this.onSubmitAnswer()}
                  primary
                >
                  Submit Answer
                </Button>
              </Form.Field>
            </Form>
          </Container>
        </Modal.Content>
      </Modal>
    ) : null;
  }
}
