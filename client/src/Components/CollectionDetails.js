import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NFTCollectionsContract from "../contracts/NFTCollections.json";
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Spinner from 'react-bootstrap/Spinner'
export default class CollectionDetails extends React.Component {
    address = window.location.pathname.split('/')[2]
    constructor(props) {
        super(props);
        this.state = {
          arrayNFT: [],
          filter: '',
          onLoad: true,
        }
    }
    componentDidMount = async () => {
      // window.addEventListener('load', () =>{
          console.log('for nft', this.props)
          // setTimeout(this.nftCollection, 3000)
          this.nftCollection();
  }
  changeFilter = (val) => {
    console.log(val)
    this.setState({
      arrayNFT: [],
      filter:val
    })
    this.nftCollection();
};
    nftCollection = async (e) =>{
        let options = {
            fromBlock: 0,              
            toBlock: 'latest'
        };
        console.log('collection', this.props.state)
        if(this.props.state.contractFactory){
          const nftCollectionInstance = new this.props.state.web3.eth.Contract(
              NFTCollectionsContract.abi, this.address,
          );
          const NFTCreated = await nftCollectionInstance.getPastEvents('NFTCreated', options);
            // const collectionCreated = await this.props.state.contractFactory.getPastEvents('NFTCollectionCreated', options);
            if(NFTCreated.length > 0){
              for(const cc of NFTCreated){    
                console.log(this.state.filter)        
                console.log(cc.returnValues._collectionData.tag)        
                if(this.state.filter === '' || this.state.filter === cc.returnValues._collectionData.tag){
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
      this.setState({onLoad: false});
    }
    render()  {
      return (
        <div>
            <h1>One Collection {this.address}</h1>
            <Container>
              <Nav variant="pills" defaultActiveKey="one">
                {[
                  {id:'primary', name:'Primary'},
                  {id:'secondary', name:'Secondary'},
                  {id:'success', name:'Success'},
                  ].map((variant, index) => (<Nav.Item key={index}><Nav.Link onClick={() => this.changeFilter(variant.id)}>{variant.name}</Nav.Link> </Nav.Item>))}
              </Nav>
            </Container>
            {(this.state.onLoad)
              ? <Container>
                  <Spinner animation="border" variant="info" />
                </Container>
              : <Container className="container-card">
                {this.state.arrayNFT.map((nft, index) => (
                  <Link key={index} className="link-collection m-2" to={`/collection/nft/${this.address}/${nft.tokenID}`}>
                    <Card bg={'light'} text={'dark'}>
                      <Card.Header>{nft.name}</Card.Header>
                      <Card.Img className='card-collection' variant="top" src={nft.url} />
                    </Card>
                  </Link>
                ))}
              </Container>
            }
        </div>
      );
    }
  }