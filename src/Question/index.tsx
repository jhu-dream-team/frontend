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
import * as dayjs from "dayjs";
import { inject, observer } from "mobx-react";
const style = require("./styles.scss");

@inject("rootStore")
@observer
class QuestionPage extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      question: "",
      suggested_answer: "",
      max_points: 0
    };
  }

  onChangeField(fieldname, event) {
    this.setState({ ...this.state, [fieldname]: event.target.value });
  }

  componentDidMount() {
    this.props.rootStore.questionCategoryStore.getQuestionCategory(
      this.props.match.params.id
    );
  }

  onCreateClick() {
    this.props.rootStore.questionCategoryStore.createQuestion(
      this.state.question,
      this.state.suggested_answer,
      this.state.max_points,
      this.props.match.params.id
    );
    this.handleModalClose();
  }

  handleModalOpen() {
    this.setState({
      ...this.state,
      modalOpen: true
    });
  }

  handleModalClose() {
    this.setState({
      modalOpen: false
    });
  }

  render() {
    return this.props.rootStore.questionCategoryStore.question_category !=
      null ? (
      <div style={{ marginLeft: "5%", marginRight: "5%" }}>
        <h1 className={style["title"]}>
          {" "}
          {
            this.props.rootStore.questionCategoryStore.question_category.name
          }{" "}
          Questions{" "}
        </h1>
        <Modal
          open={this.state.modalOpen}
          onClose={() => this.handleModalClose}
          trigger={
            this.props.rootStore.userStore.profile.id ==
            this.props.rootStore.questionCategoryStore.question_category.owner
              .id ? (
              <Button primary onClick={() => this.handleModalOpen()}>
                Create Question
              </Button>
            ) : null
          }
        >
          <Modal.Header>Create a new question</Modal.Header>
          <Modal.Content>
            <Container>
              <Form>
                <Form.Field>
                  <label>Question</label>
                  <input
                    placeholder="Please enter your question"
                    value={this.state.question}
                    onChange={event => this.onChangeField("question", event)}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Suggested Answer</label>
                  <input
                    placeholder="Please the suggested answer"
                    value={this.state.suggested_answer}
                    onChange={event =>
                      this.onChangeField("suggested_answer", event)
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <label>Max Points</label>
                  <input
                    type="number"
                    placeholder="Please enter the max points awarded"
                    value={this.state.max_points}
                    onChange={event => this.onChangeField("max_points", event)}
                  />
                </Form.Field>
                <Form.Field>
                  <Button primary onClick={() => this.onCreateClick()}>
                    Create Question
                  </Button>
                  <Button primary onClick={() => this.handleModalClose()}>
                    Cancel
                  </Button>
                </Form.Field>
              </Form>
            </Container>
          </Modal.Content>
        </Modal>
        <Segment>
          <Dimmer
            active={
              this.props.rootStore.questionCategoryStore.loading
                .question_category
            }
          >
            <Loader>Loading</Loader>
          </Dimmer>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Suggested Answer</Table.HeaderCell>
                <Table.HeaderCell>Max Points</Table.HeaderCell>
                {this.props.rootStore.userStore.profile.id ==
                this.props.rootStore.questionCategoryStore.question_category
                  .owner.id ? (
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                ) : null}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.rootStore.questionCategoryStore.question_category.questions.data.map(
                x => {
                  return (
                    <Table.Row key={x.id}>
                      <Table.Cell>{x.question}</Table.Cell>
                      <Table.Cell>{x.suggested_answer}</Table.Cell>
                      <Table.Cell>{x.max_points}</Table.Cell>
                      {this.props.rootStore.userStore.profile.id ==
                      x.owner.id ? (
                        <Table.Cell />
                      ) : null}
                    </Table.Row>
                  );
                }
              )}
            </Table.Body>
          </Table>
        </Segment>
      </div>
    ) : null;
  }
}

export default QuestionPage;
