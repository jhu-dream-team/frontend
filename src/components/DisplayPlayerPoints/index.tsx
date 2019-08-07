import * as React from 'react';
import {inject, observer} from 'mobx-react';

@inject("authStore")
@observer

class DisplayPlayerPoints extends React.Component<any, any> {
	constructor(props){
	super(props);
        	this.state = {
			tableData: ''	
		};
		this.getHeaders = this.getHeaders.bind(this);
		this.getRows = this.getRows.bind(this);
		this.getKeys = this.getKeys.bind(this);
	}

	componentDidMount(){
		this._getData();	
	}

	getkeys = function(){
		return Object.keys(this.props.data[0]);
	}
	getHeaders = function(){
		var keys = this.getKeys();
		return keys.map((key, index)=>{
			return <th key={key}> {key.toUpperCase()} </th>
		})
	}
	getRows = function(){
		var items = this.props.data;
		var keys = this.getkeys();
		return items.map((row, index)=>{
			return <tr key={index}>
				<RenderRow key ={index} data={row} keys={keys}/>
				</tr>
		})
	} 

    _getData = () => {
	fetch("http://127.0.0.1:5000/games")
	     .then(response => {
		if(response.ok){
			return response;
		}else {
		  throw Error(response.statusText);
	      })
   	     .then(response => response.json())
	     .then(json =>{
		console.log(json);
		this.setState({tableData: json.data})


    render() {
    	 return (
		<div>
			<table>
				<thead>
					<tr>{this.getHeaders()}</tr>
				</thead>
				<tbody>
					{this.getRows()}
				</tbody>
			</table>
		</div>
       );
    }
 }

const RenderRow = (props) =>{
	return props.keys.map((props, index) => {
		return <td key= {props.data[key]}>{props.data[key]}</td>
	})
}
export default DisplayPlayerPoints;
