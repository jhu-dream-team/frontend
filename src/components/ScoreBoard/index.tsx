import * as React from 'react';

class ScoreBoard extends React.Component<any, any> {

    constructor(props){
        super(props);
        this.state = {
	  error: null,
	  isLoaded: false,
	  items:[]
        };
     }	

    componentDidMount(){
	fetch("http://localhost:5000/games")
	  .then(res => res.json())
	  .then((result) => {
	      this.setState({
		isLoaded: true,
		items: result
	       });
	     },
	     (error) => {
	       this.setState({
	         isLoaded: true,
		 error
	       });
	     }
     }
	

    render() {
	const { error, isLoaded, items } = this.state;
	if (error){
	   return <div>Error: {error.message}</div>;
	}else if (!isLoaded){
	   return <div> Loading...</div>;
	}else{
          return (
	   <ul>
	     {items.map(item => (
		<li key={item.id}>
		  {item.id}{item.score}
		</li>
	     ))}
	   </ul>
	 );
	}
       }
     }

export default ScoreBoard;
