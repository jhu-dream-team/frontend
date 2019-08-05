import * as React from 'react';
import * as socket_io from 'socket.io-client';
import Login from "../login";
import { Socket } from 'net';
const style = require("./styles.scss");

class Home extends React.Component<any, any> {
    private socket

    constructor(props){
        super(props);
        this.state = {
            connected: false,
            message: "",
            messages: [],
	    test_var: ""
        }
        this.socket = socket_io("http://localhost:5000")
        this.socket.on('connect', () => {
            this.setState({...this.state, connected: this.socket.connected})
        })
        this.socket.on('connected', (msg) => {
            this.setState({...this.state, messages: this.state.messages.concat([msg])})
        })
        this.socket.on('disconnect', () => {
            this.setState({...this.state, connected: this.socket.connected, messages: this.state.messages.concat(["Client disconnected"])})
        })
        this.socket.on('message', (msg) => {
            console.log(msg)
            this.setState({
                ...this.state,
                messages: this.state.messages.concat([msg])
            })
            console.log(this.state)
        })
    }

    onChangeMessage(message){
        this.setState({
            ...this.state,
            message: message.target.value
        })
        console.log(this.state)
    }

    message(){
        this.socket.emit('message', this.state.message)
        this.setState({
            ...this.state,
            messages: this.state.messages.concat([this.state.message]),
            message: ""
        })
    }

    handleTestVar(value){
	this.setState({
		...this.state,
		test_var: value
	})
    }

    render() {
        return (
          <div>
            <h1 className={style['title']}> Welcome to Wheel of Jeopardy {this.state.test_var} </h1>
	    <Login handleTestVar={(value) => this.handleTestVar(value)} />
            {this.state.connected ? (
                <div>
                    <input onChange={(event) => this.onChangeMessage(event)}/>
                    <button onClick={() => this.message()}>Message</button>
                </div>
            )
            : null}
            {this.state.messages.map((msg, idx) => <li key={idx}>{msg}</li>)}
          </div>
        );
    }
}

export default Home;
