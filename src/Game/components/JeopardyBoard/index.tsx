import * as React from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Checkbox,
  Container,
  Popup,
  Segment,
  Dimmer,
  Loader
} from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { relative } from "path";

@inject("rootStore")
@observer
class JeopardyBoard extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Segment style={{ marginLeft: 16, marginTop: 32 }}>
        <Dimmer active={this.props.rootStore.gameStore.loading.game}>
          <Loader>Loading</Loader>
        </Dimmer>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          {this.props.rootStore.gameStore.game != null
            ? this.props.rootStore.gameStore.game.question_categories.data
                .slice(
                  6 * (this.props.rootStore.gameStore.game.round - 1),
                  6 * this.props.rootStore.gameStore.game.round
                )
                .map(x => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <div
                      style={{
                        padding: 16,
                        borderColor: "black",
                        borderRadius: 4,
                        borderWidth: 1,
                        borderStyle: "solid",
                        marginLeft: 8,
                        marginRight: 8,
                        minWidth: 125
                      }}
                    >
                      <p>{x.name}</p>
                    </div>
                    {x.questions.data
                      .sort((a, b) => (a.max_points > b.max_points ? 1 : -1))
                      .map(y =>
                        this.props.rootStore.gameStore.game.selected_question
                          .id == y.id ? (
                          <Popup
                            content={`${y.question}`}
                            trigger={
                              <div
                                style={{
                                  padding: 16,
                                  backgroundColor:
                                    y.id ==
                                    this.props.rootStore.gameStore.game
                                      .selected_question.id
                                      ? "yellow"
                                      : this.props.rootStore.gameStore.game
                                          .answers.data != null &&
                                        this.props.rootStore.gameStore.game.answers.data
                                          .map(z => z.question.id)
                                          .includes(y.id)
                                      ? "grey"
                                      : "white",
                                  borderColor: "black",
                                  borderRadius: 4,
                                  borderWidth: 1,
                                  borderStyle: "solid",
                                  marginLeft: 8,
                                  marginRight: 8,
                                  marginTop: 8,
                                  marginBottom: 8,
                                  minWidth: 125
                                }}
                              >
                                {y.max_points}
                              </div>
                            }
                          />
                        ) : (
                          <div
                            style={{
                              padding: 16,
                              backgroundColor:
                                y.id ==
                                this.props.rootStore.gameStore.game
                                  .selected_question.id
                                  ? "yellow"
                                  : this.props.rootStore.gameStore.game.answers
                                      .data != null &&
                                    this.props.rootStore.gameStore.game.answers.data
                                      .map(z => z.question.id)
                                      .includes(y.id)
                                  ? "grey"
                                  : "white",
                              borderColor: "black",
                              borderRadius: 4,
                              borderWidth: 1,
                              borderStyle: "solid",
                              marginLeft: 8,
                              marginRight: 8,
                              marginTop: 8,
                              marginBottom: 8,
                              minWidth: 125
                            }}
                          >
                            <p>{y.max_points}</p>
                          </div>
                        )
                      )}
                  </div>
                ))
            : null}
        </div>
      </Segment>
    );
  }
}

export default JeopardyBoard;
