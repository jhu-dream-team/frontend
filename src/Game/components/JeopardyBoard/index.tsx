import * as React from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Checkbox,
  Container,
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
            flexDirection: "column"
          }}
        >
          {this.props.rootStore.gameStore.game != null
            ? [
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: 6
                  }}
                >
                  {this.props.rootStore.gameStore.game.question_categories.data
                    .slice(
                      6 * (this.props.rootStore.gameStore.game.round - 1),
                      6 * this.props.rootStore.gameStore.game.round
                    )
                    .map(x => (
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
                    ))}
                </div>,
                [...Array(5).keys()].map(x => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: 6,
                      marginBottom: 6
                    }}
                  >
                    {this.props.rootStore.gameStore.game.question_categories.data
                      .slice(
                        6 * (this.props.rootStore.gameStore.game.round - 1),
                        6 * this.props.rootStore.gameStore.game.round
                      )
                      .map(y => (
                        <div
                          style={{
                            padding: 16,
                            backgroundColor:
                              y.id ==
                              this.props.rootStore.gameStore.game
                                .selected_question.id
                                ? "yellow"
                                : "white",
                            borderColor: "black",
                            borderRadius: 4,
                            borderWidth: 1,
                            borderStyle: "solid",
                            marginLeft: 8,
                            marginRight: 8,
                            minWidth: 125
                          }}
                        >
                          <p>{100 * x}</p>
                        </div>
                      ))}
                  </div>
                ))
              ]
            : null}
        </div>
      </Segment>
    );
  }
}

export default JeopardyBoard;
