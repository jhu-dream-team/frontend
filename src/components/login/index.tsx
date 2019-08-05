import * as React from 'react';
//const style = require("./styles.scss");

class Login extends React.Component<any, any> {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    onChangeInput(input_type, message){
	if(input_type == "username"){
        	this.setState({
            		...this.state,
            		username: message.target.value
        	}, () => console.log(this.state))
	} else {
		this.setState({
			...this.state,
			password: message.target.value
		}, () => console.log(this.state))
	}
    }

    render() {
        return (
          <div>
            <h1> Login </h1>
	    <p>Username</p>
            <input value={this.state.username} onChange={(event) => this.onChangeInput("username", event)}/>
	    <p>Password</p>
            <input type="password" value={this.state.passsword} onChange={(event) => this.onChangeInput("password", event)}/>
          </div>
        );
    }
}

export default Login;
