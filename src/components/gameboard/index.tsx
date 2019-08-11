import * as React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css''
//require("./styles/index.scss");


class Gameui extends React.Component<any,any> {
  constructor(props) {
    super(props);
    this.state = {
      scoreboard:'',
      gameboarda:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      value:event.target.value
    });
  }

  onChange(i,value,tab,ev) {
    console.log(arguments);
  }

  onActive (tab) {
    console.log(arguments);
  }

  handleSubmit(event) {
    alert('submission: ' + this.state.value);
    event.preventDefault();
    //need to save submitted question and answer to db
  }

render () {
  

  return (
    <div>
      <h1> Question Wheel of Jeopardy Game </h1>
    </div>
  );
  }
}
export default Questions;
