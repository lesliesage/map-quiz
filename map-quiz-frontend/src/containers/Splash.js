import React, { Component } from "react";
import FormContainer from './FormContainer'

class Splash extends Component {

  render() {
    return <div>Splash Here
      {this.props.hid ? console.log(true) : 
      <FormContainer />
      }
    </div>;
  }
}

export default Splash;