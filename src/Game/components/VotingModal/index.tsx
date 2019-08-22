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
export default class VoteModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      answer: ""
    };
  }

  onSubmitVote(value) {
    this.props.rootStore.gameStore.submitVote(value);
  }

  render() {
    return this.props.rootStore.gameStore.game.answers != null ? (
      <Modal
        open={
          this.props.rootStore.gameStore.game.sub_state == "Voting" &&
          this.props.rootStore.gameStore.game.players.data[
            this.props.rootStore.gameStore.game.spins %
              this.props.rootStore.gameStore.game.players.data.length
          ].id != this.props.rootStore.userStore.profile.id
        }
      >
        <Modal.Header>
          Question:{" "}
          {this.props.rootStore.gameStore.game.selected_question.question} (
          {this.props.rootStore.gameStore.game.selected_question.max_points}{" "}
          points)
          <br />
          Suggested Answer:{" "}
          {
            this.props.rootStore.gameStore.game.selected_question
              .suggested_answer
          }
          Player Answer:{" "}
          {
            this.props.rootStore.gameStore.game.answers.data[
              this.props.rootStore.gameStore.game.answers.data
                .map(x => x.question.id)
                .indexOf(
                  this.props.rootStore.gameStore.game.selected_question.id
                )
            ].value
          }
        </Modal.Header>
        <Modal.Content>
          <Container>
            <Form>
              <Form.Field>
                <Button
                  loading={this.props.rootStore.gameStore.loading.vote}
                  onClick={() => this.onSubmitVote(true)}
                  primary
                >
                  Approve
                </Button>
                <Button
                  loading={this.props.rootStore.gameStore.loading.vote}
                  onClick={() => this.onSubmitVote(false)}
                  primary
                >
                  Reject
                </Button>
              </Form.Field>
            </Form>
          </Container>
        </Modal.Content>
      </Modal>
    ) : null;
  }
}
