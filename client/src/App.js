import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import CYONTokenContract from "./contracts/CYONToken.json";
import getWeb3 from "./getWeb3";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'
import "./App.css";

import Home from "./Components/Home.js";
import About from "./Components/About.js";
import Users from "./Components/Users.js";
import CollectionDetails from "./Components/CollectionDetails";
import NFTDetails from "./Components/NFTDetails";
class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log('networkId', networkId);
      const deployedNetwork = CYONTokenContract.networks[networkId];
      console.log('deployedNetwork',deployedNetwork);
      const instance = new web3.eth.Contract(
        CYONTokenContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
        console.log(instance)
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // Update state with the result.
    // this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Router>
          <div>
            <Navbar bg="dark" variant="dark">
              <Container>
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                      <Link className="nav-link" to="/">Home</Link>
                      <Link className="nav-link" to="/about">About</Link>
                      <NavDropdown title={
                          <div className="pull-left">
                              <img className="nav-dropdown-img" 
                                  src={window.location.origin + '/logo192.png'} 
                                  alt="user pic"
                              />
                          </div>
                        } 
                        id="basic-nav-dropdown">
                        <Link className="dropdown-item" to="/about">Profile</Link>
                        <Link className="dropdown-item" to="/about">Create NFT</Link>
                        <Link className="dropdown-item" to="/about">Create Collection</Link>
                      </NavDropdown>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
            <Routes>
              <Route path="/about"  element={<About state={this.state} />}/>
              <Route path="/collection/:address"  element={<CollectionDetails state={this.state} />}/>
              <Route path="/collection/nft/:address"  element={<NFTDetails state={this.state} />}/>
              <Route path="/users" element={<Users />}/>
              <Route path="/" element={<Home storageValue={this.state.storageValue}/>} />
            </Routes>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
