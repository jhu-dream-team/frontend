import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Dropdown from 'react-dropdown'
//require("./styles/index.scss");


class Questions extends React.Component<any,any> {
  constructor(props) {
    super(props);
    this.state = {
      question:'',
      answer:''
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
      <h1> Question Editor </h1>
    
    <Tabs onChange={this.onChange} defaultSelectedIndex={1}>
      <Tab value="new" label="New Category" onActive={this.onActive}>New Category</Tab>
      <Tab value="edit" label="Edit Questions">Edit Questions</Tab>
        <form onSubmit={this.handleSubmit}>
          
          <br />
          <label> Question Value  </label>
          <select value={this.state.price} onChange={this.handleChange}>
            <option value="100"> $100 </option>
            <option value="100"> $200 </option>
            <option value="100"> $300 </option>
            <option value="100"> $400 </option>
            <option value="100"> $500 </option>
          </select>
          <br /><br />
          <label>Question:
          <input type='text' value={this.state.value} onChange={this.handleChange} />
          </label>
          <label>Answer:
          <input type='text' value={this.state.answer} onChange{this.handleChange} />
          </label>
          <br /><br />
          <input type="submit" value="Submit" />
        </form>
    </Tabs>
    </div>
  );
  }
}
export default Questions;
