import React from 'react';
import NFTCollectionsContract from "../contracts/NFTCollections.json";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default class UserCollection extends React.Component {
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
      if(this.props.state.contractMaster){
        const nftCollDeployedNetwork = NFTCollectionsContract.networks[this.props.state.networkId];
          const collectionCreated = await this.props.state.contractFactory.getPastEvents('NFTCollectionCreated', options);
          if(collectionCreated.length > 0){
            for(const cc of collectionCreated){   
              if(cc.returnValues._creator.toLowerCase() === this.props.state.accounts[0].toLowerCase()){
                const nftCollectionInstance = new this.props.state.web3.eth.Contract(
                    NFTCollectionsContract.abi, cc.returnValues._collectionAddress,
                );
                console.log(nftCollectionInstance)
                this.setState({
                  arrayCollection: this.state.arrayCollection.concat([
                    {name: cc.returnValues._collectionName, address: cc.returnValues._collectionAddress}
                  ])
                })
              }    
            }

          }
      }
  }
    render()  {
      return (
        <div>
          <Container className="container-card">
              {this.state.arrayCollection.map((collection, index) => (
                <div key={index} className="link-collection pointer-collection m-2" onClick={() => {this.props.selectCollection(collection.address)}}>
                  <Card bg={'light'} text={'dark'}>
                  <Card.Header>{collection.name}</Card.Header>
                    <Card.Body>
                      <Card.Title>coming soon</Card.Title>
                      <Card.Text>

                      </Card.Text>
                    </Card.Body>
                  </Card>
                  </div>
              ))}
            </Container>
            
        </div>
      );
    }
  }
