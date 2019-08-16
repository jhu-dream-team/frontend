import * as React from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Checkbox,
  Container
} from "semantic-ui-react";
import { inject, observer } from "mobx-react";
@inject("rootStore")
@observer
export default class QuestionCategorySelector extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      selected_question_category: "",
      question_categories: [
        {
          id: 1,
          name: "Mock Question Category 1",
          questions: {
            count: 5
          }
        },
        {
          id: 2,
          name: "Mock Question Category 2",
          questions: {
            count: 6
          }
        },
        {
          id: 3,
          name: "Mock Question Category 3",
          questions: {
            count: 7
          }
        }
      ]
    };
  }
  
   async componentDidMount() {
    console.log(this.props.gameId);
    this.props.rootStore.gameStore.getGame(this.props.gameId);
    console.log(this.props.rootStore.gameStore.game);
  }

  onChangeCheckbox(id) {
    this.setState({...this.state, selected_question_category: id});
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
  
   render() {
    return (
      <Modal
      open={this.state.modalOpen}
      onClose={() => this.handleModalClose}
      trigger={
        <Button primary onClick={() => this.handleModalOpen()}>
          Show Category Selection
        </Button>
      }
    >
      <Modal.Header>Create a new game</Modal.Header>
      <Modal.Content>
        <Container>
          <Form>
            <Form.Field>
              <label>Question Sets</label>
            </Form.Field>
            {this.state.question_categories.map(x => (
              <Form.Field>
                <Checkbox
                  checked={this.state.selected_question_categories.includes(x.id)}
                  label={x.name + "(" + x.questions.count + ")"}
                  onClick={() => this.onChangeCheckbox(x.id)}
                />
              </Form.Field>
            ))}
            <Form.Field>
              <Button
                primary
              >
                Select
              </Button>
              <Button
                secondary
              >
                Cancel
              </Button>
            </Form.Field>
          </Form>
        </Container>
      </Modal.Content>
    </Modal>
    );
  }
}
