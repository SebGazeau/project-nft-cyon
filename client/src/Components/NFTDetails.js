import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NFTCollectionsContract from "../contracts/NFTCollections.json";
import Figure from 'react-bootstrap/Figure'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
export default class NFTDetails extends React.Component {
    address = window.location.pathname.split('/')[3]
    tokenID = window.location.pathname.split('/')[4]
    constructor(props) {
        super(props);
        this.state = {
            NFTDetails: {},
        }
    }
    componentDidMount = async () => {
        // window.addEventListener('load', () =>{
            console.log('for nft', this.props)
            // setTimeout(this.nftCollection, 3000)
            this.nftDetails();
    }
    makeOffer = () => {
        console.log('make offer')
    }
    buyNow = () => {
        console.log('buy now')
    }
    nftDetails = async (e) =>{
        let options = {
            fromBlock: 0,              
            toBlock: 'latest'
        };
        console.log('collection', this.props)
        if(this.props.state.contractFactory){
          const nftCollDeployedNetwork = NFTCollectionsContract.networks[this.props.state.networkId];
          const nftCollectionInstance = new this.props.state.web3.eth.Contract(
              NFTCollectionsContract.abi, this.address,
          );
          console.log(nftCollectionInstance)
          const NFTCreated = await nftCollectionInstance.getPastEvents('NFTCreated', options);
            // const collectionCreated = await this.props.state.contractFactory.getPastEvents('NFTCollectionCreated', options);
            const cc = NFTCreated.find(nft => nft.returnValues._tokenID == this.tokenID)
            // if(NFTCreated.length > 0){
            //   for(const cc of NFTCreated){            
                console.log('cc', cc)
                const firstUri = await nftCollectionInstance.methods.tokenURI(cc.returnValues._tokenID).call();
                console.log('firstUri', firstUri)
                this.setState({
                  NFTDetails: {
                    name: cc.returnValues._collectionData.name, 
                    tokenAddress: cc.returnValues._collectionData.tokenAddress, 
                    description: cc.returnValues._collectionData.description, 
                    tag: cc.returnValues._collectionData.tag, 
                    price: cc.returnValues._collectionData.price, 
                    isAuctionable: false, // call getter auction
                    url:`https://gateway.pinata.cloud/ipfs/${firstUri}`
                  }
                })
            //   }

            // }
        }
    }
    detailPrice = () => {   
        let html;
        console.log(this.state.NFTDetails.price)
        console.log(this.state.NFTDetails.price != '0')
        console.log(parseInt(this.state.NFTDetails.price))
        if(this.state.NFTDetails.price != undefined){
            if(this.state.NFTDetails.price != '0') {
                return <>
                    <div>
                        <span>Current price : {}</span><div>{this.token()}<span>price</span></div>
                    </div>
                    <div>
                        <Button className="mx-2" onClick={this.buyNow}>Buy now</Button>
                    </div>
                </>
            }else{
                return <span>not in sell</span>
            }
        }
    }
    token = () => {
        if(this.state.NFTDetails.tokenAddress.toLowerCase() == this.store.state.contractCYON._address.toLowerCase()){
            return <span>CYON</span>
        }else{
            return <span>ETH</span>
        }
    }
    payment = () => {
        if(this.state.NFTDetails.isAuctionable){
            return <Button className="mx-2" variant="outline-primary" onClick={this.makeOffer}>Make offer</Button>
        }
    }
    historyTrading = () => {
        const hasCurrentAction = false;
        if(hasCurrentAction){
            
        }
    }
    historyPrice = () => {
        return <>
            <Card.Header>Header</Card.Header>
            <Card.Body>
                <Card.Title>Card Title </Card.Title>
                <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                </Card.Text>
            </Card.Body>
        </>
    }
    historyCurrentAuction = () => {
        return <>
            <Card.Header>Header</Card.Header>
            <Card.Body>
                <Card.Title>Card Title </Card.Title>
                <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                </Card.Text>
            </Card.Body>
        </>
    }
    render()  {
      return (
        <div>
            <Container className="mt-5 d-flex">
                <Col className="me-3">
                    <Figure>
                        <Figure.Image variant="top" src={this.state.NFTDetails.url} />
                    </Figure>
                    <Card>
                        <Card.Header>Header</Card.Header>
                        <Card.Body>
                        <Card.Title>Card Title </Card.Title>
                        <Card.Text>
                            {this.state.NFTDetails.description}
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="ms-3">
                    <h3>{this.state.NFTDetails.name}</h3>
                    <Card className="my-3">
                        <Card.Body>
                            {this.detailPrice()}

                        </Card.Body>
                    </Card>
                    <Card>
                        
                    </Card>
                </Col>

            </Container>
        </div>
      );
    }
  }