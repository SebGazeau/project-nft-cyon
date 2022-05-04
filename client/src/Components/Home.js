import React from 'react';
export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    render()  {
      return (
        <div>
            <h1>Good to Go!</h1>
            <p>Your Truffle Box is installed and ready.</p>
            <h2>Smart Contract Example</h2>
            <p>
            If your contracts compiled and migrated successfully, below will show
            a stored value of 5 (by default).
            </p>
            <p>
            Try changing the value stored on <strong>line 42</strong> of App.js.
            </p>
            <div>The stored value is: {this.props.storageValue}</div>
        </div>
      );
    }
  }