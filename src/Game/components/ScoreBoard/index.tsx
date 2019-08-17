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
const styles = require("./styles.scss");

@inject("rootStore")
@observer
class ScoreBoard extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Segment className={styles["scoreboard"]}>
        <Dimmer active={this.props.rootStore.gameStore.loading.game}>
          <Loader>Loading</Loader>
        </Dimmer>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Player Name</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!this.props.rootStore.gameStore.loading.game &&
            this.props.rootStore.gameStore.game != null ? (
              this.props.rootStore.gameStore.game.scores.data
                .filter(
                  x => x.round == this.props.rootStore.gameStore.game.round
                )
                .map(x => {
                  return (
                    <Table.Row key={x.id}>
                      <Table.Cell>
                        {x.owner.firstName + " " + x.owner.lastName}
                      </Table.Cell>
                      <Table.Cell>{x.value}</Table.Cell>
                    </Table.Row>
                  );
                })
            ) : (
              <Table.Row>
                <Table.Cell>Loading...</Table.Cell>
                <Table.Cell>Loading...</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Segment>
    );
  }
}

export default ScoreBoard;
