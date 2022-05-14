import React from 'react';
import NFTCollectionsContract from "../contracts/NFTCollections.json";
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayCollection: [],
            onLoad: true,
        }
    }
    componentDidMount = async () => {
        setTimeout(this.collection, 1000);
    }
    selectCollection = (address) => {
    }
    collection = async (e) => {
          let options = {
              fromBlock: 0,              
              toBlock: 'latest'
          };
          if(this.props.state.contractFactory){
              const collectionCreated = await this.props.state.contractFactory.getPastEvents('NFTCollectionCreated', options);
              if(collectionCreated.length > 0){
                for(const cc of collectionCreated){            
                  const nftCollectionInstance = new this.props.state.web3.eth.Contract(
                      NFTCollectionsContract.abi, cc.returnValues._collectionAddress,
                  );
                  const nftTransfer = await nftCollectionInstance.getPastEvents('Transfer', options);
                  let firstUri;
                  if(nftTransfer.length > 0){
                    firstUri = await nftCollectionInstance.methods.tokenURI(nftTransfer[0].returnValues.tokenId).call();
                  }
                  this.setState({
                    arrayCollection: this.state.arrayCollection.concat([{
                      name: cc.returnValues._collectionName, 
                      address: cc.returnValues._collectionAddress, 
                      url: (firstUri) ? `https://gateway.pinata.cloud/ipfs/${firstUri}` : ''
                    }])
                  })
                }

              }
          }
          this.setState({onLoad: false});
      }
    render()  {
      return (
        <div className="mt-3">
          <h1>Collections</h1>
          {(this.state.onLoad)
            ? <Container>
                <Spinner animation="border" variant="info" />
              </Container>
            : <Container className="container-card">
              {this.state.arrayCollection.map((collection, index) => (
                <Link key={index} className="link-collection m-2" to={`/collection/${collection.address}`}>
                  <Card bg={'light'} text={'dark'}>
                    <Card.Header>{collection.name}</Card.Header>
                    <Card.Img className='card-collection' variant="top" src={collection.url} />
                  </Card>
                  </Link>
              ))}
            </Container>}
        </div>
      );
    }
}