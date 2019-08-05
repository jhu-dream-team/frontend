import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from "../home";
import Login from "../login";

class App extends React.Component<any, any> {
    constructor(props){
        super(props);
    }

    render() {
        return (
          <div>
            <Switch>
		<Route exact path="/" component={Home}/>
                <Route path="/login" component={Login} />
	    </Switch>
          </div>
        );
    }
}

export default App;
