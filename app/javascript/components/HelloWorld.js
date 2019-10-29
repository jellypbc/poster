import React from "react"
import PropTypes from "prop-types"

class HelloWorld extends React.Component {
  render () {
  	var style = {
  		color: 'red'
  	}
  	
    return (
      <React.Fragment>
        <h1 style={style}>Greeting: {this.props.greeting}</h1>
      </React.Fragment>
    );
  }
}

HelloWorld.propTypes = {
  greeting: PropTypes.string
};
export default HelloWorld
