import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NFTCollectionsContract from "../contracts/NFTCollections.json";
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
export default class CollectionDetails extends React.Component {
    address = window.location.pathname.split('/')[2]
    constructor(props) {
        super(props);
        this.state = {
          arrayNFT: [],
        }
    }
    componentDidMount = async () => {
      // window.addEventListener('load', () =>{
          console.log('for nft', this.props)
          // setTimeout(this.nftCollection, 3000)
          this.nftCollection();
  }
    nftCollection = async (e) =>{
        let options = {
            fromBlock: 0,              
            toBlock: 'latest'
        };
        console.log('collection', this.props.state)
        if(this.props.state.contractFactory){
          const nftCollDeployedNetwork = NFTCollectionsContract.networks[this.props.state.networkId];
          const nftCollectionInstance = new this.props.state.web3.eth.Contract(
              NFTCollectionsContract.abi, this.address,
          );
          console.log(nftCollectionInstance)
          const NFTCreated = await nftCollectionInstance.getPastEvents('NFTCreated', options);
            // const collectionCreated = await this.props.state.contractFactory.getPastEvents('NFTCollectionCreated', options);
            if(NFTCreated.length > 0){
              for(const cc of NFTCreated){            
                console.log('cc', cc)
                const firstUri = await nftCollectionInstance.methods.tokenURI(cc.returnValues._tokenID).call();
                console.log('firstUri', firstUri)
                this.setState({
                  arrayNFT: this.state.arrayNFT.concat([{
                    tokenID: cc.returnValues._tokenID,
                    name: cc.returnValues._collectionData.name, 
                    tokenAddress: cc.returnValues._collectionData.tokenAddress, 
                    description: cc.returnValues._collectionData.description, 
                    tag: cc.returnValues._collectionData.tag, 
                    price: cc.returnValues._collectionData.price, 
                    isAuctionable: cc.returnValues._collectionData.isAuctionable, 
                    url:`https://gateway.pinata.cloud/ipfs/${firstUri}`
                  }])
                })
              }

            }
        }
    
    }
    render()  {
      return (
        <div>
            <h1>One Collection {this.address}</h1>
            <Container className="container-card">
              {this.state.arrayNFT.map((nft, index) => (
                <Link key={index} className="link-collection m-2" to={`/collection/nft/${this.address}/${nft.tokenID}`}>
                  <Card bg={'light'} text={'dark'}>
                    <Card.Header>{nft.name}</Card.Header>
                    <Card.Img variant="top" src={nft.url} />
                    {/* <Card.Body>
                      <Card.Title>{variant} Card Title </Card.Title>
                      <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                      </Card.Text>
                    </Card.Body> */}
                  </Card>
                </Link>
              ))}
            </Container>
        </div>
      );
    }
  }