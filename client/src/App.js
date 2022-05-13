import React, { Component } from "react";
import Web3 from "web3";
import 'bootstrap/dist/css/bootstrap.min.css';
import MasterContract from "./contracts/Master.json";
import CYONTokenContract from "./contracts/CYONToken.json";
import NFTFactoryContract from "./contracts/NFTCollectionFactory.json";
// import getWeb3 from "./getWeb3";
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
import UserProfile from "./Components/UserProfile";
import CreateNFT from "./Components/CreateNFT";
import CreateCollection from "./Components/CreateCollection";
import Button from 'react-bootstrap/Button';
class App extends Component {
    state = { 
      storageValue: 0, 
      web3: null, 
      accounts: null, 
      contractMaster: null, 
      contractCYON: null,
      contractFactory: null,
      networkId: '1652446396140', 
    };
    componentDidMount = async () => {
        window.ethereum.on('connect', (connectInfo) =>{
            console.log('eth connection')
            const key = Object.keys(connectInfo);
            if(key.length > 0 && key[0] === 'chainId'){
                this.connect();
            }
        });
        window.ethereum.on('accountsChanged', () => {
            window.location.reload();
        });
    }
    connect = async ()=>{
        let web3;
        try {
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                } catch (error) {
                    console.error(error);
                }
            } else if (window.web3) {
                web3 = window.web3;
            } else {
                const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
                web3 = new Web3(provider);
            }
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            console.log('networkId', networkId);
            const masterDeployedNetwork = MasterContract.networks[networkId];
            const CYONDeployedNetwork = CYONTokenContract.networks[networkId];
            const NFTFactoryNetwork = NFTFactoryContract.networks[networkId];
            const masterInstance = new web3.eth.Contract(
                MasterContract.abi,
                masterDeployedNetwork && masterDeployedNetwork.address,
            );
            const cyonInstance = new web3.eth.Contract(
              CYONTokenContract.abi,
              CYONDeployedNetwork && CYONDeployedNetwork.address,
            );
            const factoryInstance = new web3.eth.Contract(
              NFTFactoryContract.abi,
              NFTFactoryNetwork && NFTFactoryNetwork.address,
            );
            console.log('masterInstance',masterInstance);
            this.setState({ 
              web3, 
              accounts, 
              contractMaster: masterInstance, 
              contractCYON: cyonInstance, 
              contractFactory: factoryInstance,
              networkId: networkId 
            });
        } catch (error) {
            console.error(error);
        }
    }

  render() {
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
                      {/* <Link className="nav-link" to="/about">About</Link> */}
                      <NavDropdown title={
                          <div className="pull-left">
                              <img className="nav-dropdown-img" 
                                  src={window.location.origin + '/logo192.png'} 
                                  alt="user pic"
                              />
                          </div>
                        } 
                        id="basic-nav-dropdown">
                        <Link className="dropdown-item" to="/profile">Profile</Link>
                        <Link className="dropdown-item" to="/create-nft">Create NFT</Link>
                        <Link className="dropdown-item" to="/create-collection">Create Collection</Link>
                      </NavDropdown>
                  </Nav>
                  {this.state.networkId}
                      <Button className="" onClick={this.connect}>Connect</Button>
                </Navbar.Collapse>

              </Container>
            </Navbar>
            <Routes>
              <Route path="/about"  element={<About state={this.state} />}/>
              <Route path="/profile"  element={<UserProfile state={this.state} />}/>
              <Route path="/create-nft"  element={<CreateNFT state={this.state} />}/>
              <Route path="/create-collection" element={<CreateCollection state={this.state} />}/>
              <Route path="/collection/:address"  element={<CollectionDetails state={this.state} />}/>
              <Route path="/collection/nft/:address/:id"  element={<NFTDetails state={this.state} />}/>
              <Route path="/users" element={<Users />}/>
              <Route path="/" element={<Home state={this.state}/>} />
            </Routes>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
