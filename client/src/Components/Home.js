import React from 'react';
import Web3 from "web3";
import NFTCollectionsContract from "../contracts/NFTCollections.json";
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayCollection: [],
        }
    }
    componentDidMount = async () => {
        // window.addEventListener('load', () =>{
            console.log('for call', this.props)
            setTimeout(this.collection, 3000)
            // await ;
        // })
    }
    changeFilter = (event) => {
        const filter = event.target.dataset.rrUiEventKey;
        console.log('event', event.target.dataset.rrUiEventKey)
    };
    selectCollection = (address) => {
      
        console.log('address -', address);
      // this.navigate({to:`/collection/${address}`})
      // history.push(`/collection/${address}`)
    }
    collection = async (e) => {
          let options = {
              fromBlock: 0,              
              toBlock: 'latest'
          };
          console.log('collection', this.props.state)
          if(this.props.state.contractFactory){
            const nftCollDeployedNetwork = NFTCollectionsContract.networks[this.props.state.networkId];
              const collectionCreated = await this.props.state.contractFactory.getPastEvents('NFTCollectionCreated', options);
              if(collectionCreated.length > 0){
                for(const cc of collectionCreated){            
                  const nftCollectionInstance = new this.props.state.web3.eth.Contract(
                      NFTCollectionsContract.abi, cc.returnValues.collectionAddress,
                  );
                  console.log(nftCollectionInstance)
                  this.setState({
                    arrayCollection: this.state.arrayCollection.concat([
                      {name: cc.returnValues._NFTName, address: cc.returnValues._collectionAddress}
                    ])
                  })
                }

              }
          }
      }
    render()  {
      return (
        <div className="mt-3">
          <Container>
            <Nav variant="pills" defaultActiveKey="one">
              <Nav.Item>
                <Nav.Link eventKey="one">Active</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='two' onClick={this.changeFilter}>Option 2</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                  Disabled
                </Nav.Link>
              </Nav.Item>
            </Nav>
            {/* <Button onClick={this.collection}>click</Button> */}
          </Container>
            <h1>Collections</h1>
            <Container className="container-card">
              {this.state.arrayCollection.map((collection, index) => (
                <Link key={index} className="link-collection m-2" to={`/collection/${collection.address}`}>
                  <Card bg={'light'} text={'dark'}>
                    <Card.Header>{collection.name}</Card.Header>
                    <Card.Body onClick={() => {this.selectCollection('address')}}>
                      <Card.Title>coming soon</Card.Title>
                      <Card.Text>
                      coming soon
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  </Link>
              ))}
            </Container>
        </div>
      );
    }
}