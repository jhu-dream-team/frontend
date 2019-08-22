import * as React from "react";
import {
  Modal,
  Button,
  Input,
  Container,
  Form,
  FormField,
  Radio
} from "semantic-ui-react";
import { observer, inject } from "mobx-react";

@inject("rootStore")
@observer
export default class ChoiceModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      selected: ""
    };
  }

  onChangeSelected(id) {
    this.setState({
      selected: id
    });
  }

  onSubmitChoice() {
    this.props.rootStore.gameStore.selectCategory(this.state.selected);
  }

  render() {
    return this.props.rootStore.gameStore.wheelCategories != null ? (
      <Modal
        open={
          (this.props.rootStore.gameStore.game.sub_state == "Player Choice" &&
            this.props.rootStore.gameStore.game.players.data[
              this.props.rootStore.gameStore.game.spins %
                this.props.rootStore.gameStore.game.players.data.length
            ].id == this.props.rootStore.userStore.profile.id) ||
          (this.props.rootStore.gameStore.game.sub_state == "Opponent Choice" &&
            this.props.rootStore.gameStore.game.players.data[
              (this.props.rootStore.gameStore.game.spins + 1) %
                this.props.rootStore.gameStore.game.players.data.length
            ].id == this.props.rootStore.userStore.profile.id)
        }
      >
        <Modal.Header>
          {this.props.rootStore.gameStore.game.sub_state}
        </Modal.Header>
        <Modal.Content>
          <Container>
            <Form>
              <Form.Field>
                <label>Question Categories</label>
              </Form.Field>
              {this.props.rootStore.gameStore.game.question_categories.data
                .slice(
                  6 * (this.props.rootStore.gameStore.game.round - 1),
                  6 * this.props.rootStore.gameStore.game.round
                )
                .map(x =>
                  x.questions.data.filter(z =>
                    this.props.rootStore.gameStore.game.answers.data != null
                      ? !this.props.rootStore.gameStore.game.answers.data
                          .map(y => y.question.id)
                          .includes(z.id)
                      : false
                  ).length > 0 ? (
                    <Form.Field>
                      <Radio
                        checked={this.state.selected == x.id}
                        label={`${x.name} (${
                          x.questions.data.filter(
                            z =>
                              !this.props.rootStore.gameStore.game.answers.data
                                .map(y => y.question.id)
                                .includes(z.id)
                          ).length
                        })`}
                        onClick={() => this.onChangeSelected(x.id)}
                      />
                    </Form.Field>
                  ) : null
                )}
              <Form.Field>
                <Button
                  loading={this.props.rootStore.gameStore.loading.choice}
                  disabled={
                    this.state.selected == "" ||
                    this.props.rootStore.gameStore.loading.choice
                  }
                  onClick={() => this.onSubmitChoice()}
                  primary
                >
                  Submit
                </Button>
              </Form.Field>
            </Form>
          </Container>
        </Modal.Content>
      </Modal>
    ) : null;
  }
}
