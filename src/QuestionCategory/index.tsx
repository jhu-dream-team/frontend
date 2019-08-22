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
class QuestionCategoryPage extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      category_name: ""
    };
  }

  onChangeName(event) {
    this.setState({ ...this.state, category_name: event.target.value });
  }

  componentDidMount() {
    this.props.rootStore.questionCategoryStore.getQuestionCategories();
  }

  onCreateClick() {
    this.props.rootStore.questionCategoryStore.createQuestionCategory(
      this.state.category_name
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
    return (
      <div style={{ marginLeft: "5%", marginRight: "5%" }}>
        <h1 className={style["title"]}> My Question Categories </h1>
        <Modal
          open={this.state.modalOpen}
          onClose={() => this.handleModalClose}
          trigger={
            <Button primary onClick={() => this.handleModalOpen()}>
              Create Question Category
            </Button>
          }
        >
          <Modal.Header>Create a new question category</Modal.Header>
          <Modal.Content>
            <Container>
              <Form>
                <Form.Field>
                  <label>Name</label>
                  <input
                    placeholder="Name"
                    value={this.state.category_name}
                    onChange={event => this.onChangeName(event)}
                  />
                </Form.Field>
                <Form.Field>
                  <Button primary onClick={() => this.onCreateClick()}>
                    Create Question Category
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
            active={this.props.rootStore.questionCategoryStore.loading.list}
          >
            <Loader>Loading</Loader>
          </Dimmer>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell># Questions</Table.HeaderCell>
                <Table.HeaderCell>Last Updated</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.rootStore.questionCategoryStore.question_categories.map(
                x => {
                  return (
                    <Table.Row key={x.id}>
                      <Table.Cell>{x.name}</Table.Cell>
                      <Table.Cell>{x.questions.count}</Table.Cell>
                      <Table.Cell>
                        {dayjs(parseInt(x.updatedAt)).format(
                          "MM-DD-YYYY h:mm:ss a"
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          onClick={() =>
                            this.props.rootStore.questionCategoryStore.enterQuestionCategory(
                              x.id
                            )
                          }
                          primary
                        >
                          View
                        </Button>
                        {x.owner.id ==
                        this.props.rootStore.userStore.profile.id ? (
                          <Button color={"red"}>Delete</Button>
                        ) : null}
                      </Table.Cell>
                    </Table.Row>
                  );
                }
              )}
            </Table.Body>
          </Table>
        </Segment>
      </div>
    );
  }
}

export default QuestionCategoryPage;
