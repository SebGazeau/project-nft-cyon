import React from 'react';
import SwapToken from './SwapToken';
export default class About extends React.Component {
    constructor(props) {
        super(props);
    }
    render()  {
      return (
        <div>
          <SwapToken address={this.props.state.accounts[0]} instance={this.props.state.contract}/>
        </div>
      );
    }
  }