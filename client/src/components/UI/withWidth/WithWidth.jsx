import React from "react";

function withWidth(HOC) {
	
	return class extends React.Component{
		
		state = {
			innerWidth: 0
		}
		
		componentDidMount() {
			window.addEventListener("resize", this.changeWindow)
		}
		componentWillUnmount() {
			return window.removeEventListener("resize", this.changeWindow)
		}
		
		changeWindow = (e)=>{
			this.setState({ innerWidth: window.innerWidth})
		}
		
		render(){
			return  <HOC innerWidth={this.state.innerWidth} {...this.props} />
		}
		
	}
}

export default withWidth;