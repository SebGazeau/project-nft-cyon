import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NFTCollectionsContract from "../contracts/NFTCollections.json";
import Figure from 'react-bootstrap/Figure'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BN from 'bn.js'
export default class NFTDetails extends React.Component {
    address = window.location.pathname.split('/')[3]
    tokenID = window.location.pathname.split('/')[4]
    constructor(props) {
        super(props);
        this.state = {
            NFTDetails: {},
            pricingForBid: 0
        }
    }
    componentDidMount = async () => {
        // window.addEventListener('load', () =>{
            console.log('for nft', this.props)
            // setTimeout(this.nftCollection, 3000)
            this.nftDetails();
    }
    handleChange = (event) => {
        console.log('change file', event.target)
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    makeOffer = () => {
        console.log('make offer')
    }
    buyNow = async () => {
        if(this.state.NFTDetails.price != 0){
            await this.props.state.contractCYON.methods.approve(this.props.state.contractMaster._address,new BN((this.state.NFTDetails.price).toString())).send({from: this.props.state.accounts[0]});
            const allowance = await this.props.state.contractCYON.methods.allowance(this.props.state.accounts[0],this.props.state.contractMaster._address).call();
            const balSender = await this.props.state.contractCYON.methods.balanceOf(this.props.state.accounts[0]).call();
            const balMaster = await this.props.state.contractCYON.methods.balanceOf(this.props.state.contractMaster._address).call();
            const res = await this.props.state.contractMaster.methods.buyNFT(this.address, this.tokenID).send({from: this.props.state.accounts[0]});
        }
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
                console.log('this.token', this.tokenID)
                console.log('returnValues._tokenID', cc.returnValues._tokenID)
                const owner = await nftCollectionInstance.methods.ownerOf(cc.returnValues._tokenID).call();
                if(owner.toLowerCase() === this.props.state.accounts[0].toLowerCase()){
                    console.log('test owner')
                }
                const firstUri = await nftCollectionInstance.methods.tokenURI(cc.returnValues._tokenID).call();
                const getPrice = await nftCollectionInstance.methods.getPrice(cc.returnValues._tokenID).call();
                // const owner = await nftCollectionInstance.methods.ownerOf(cc.returnValues._tokenID).call();
                // const owner2 = await nftCollectionInstance.methods.ownerOf(this.tokenID).call();
                // console.log('owner', owner)
                // console.log('owner2', owner2)
                const isInAuction= await this.props.state.contractMaster.methods
                    .isInAuction(this.address, cc.returnValues._tokenID)
                    .call({});
                const auction = {};
                if(isInAuction){
                  auction.isInAuction = isInAuction;
                  const checkAuctionTimeExpired= await this.props.state.contractMaster.methods
                    .checkAuctionTimeExpired(this.address, cc.returnValues._tokenID)
                    .call();
                  if(!checkAuctionTimeExpired){
                    auction.expired = false;
                    const getCurrentHighestBid= await this.props.state.contractMaster.methods
                      .getCurrentHighestBid(this.address, cc.returnValues._tokenID)
                      .call();
                    const getBiddersAmount= await this.props.state.contractMaster.methods
                      .getBiddersAmount(this.address, cc.returnValues._tokenID)
                      .call();
                    const getTotalBid = await this.props.state.contractMaster.methods
                        .getTotalBid(this.address, cc.returnValues._tokenID)
                        .call();
                    console.log('getTotalBid', getTotalBid)
                    auction.getCurrentHighestBid = getCurrentHighestBid
                    auction.getBiddersAmount = getBiddersAmount
                  }
                }
                this.setState({
                  NFTDetails: {
                    name: cc.returnValues._collectionData.name, 
                    tokenAddress: cc.returnValues._collectionData.tokenAddress, 
                    description: cc.returnValues._collectionData.description, 
                    tag: cc.returnValues._collectionData.tag, 
                    price: getPrice, 
                    auction: auction, 
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
            if(this.state.NFTDetails.price != '0' && !this.state.auction.isInAuction) {
                return <>
                    <div>
                        <span>Current price : {}</span><div><span>{(this.state.NFTDetails.price/10**18)}</span> CYON</div>
                    </div>
                    <div>

                        <Button className="mx-2" onClick={this.buyNow}>Bid</Button>
                    </div>
                </>
            }else if(this.state.NFTDetails.auction.isInAuction && !this.state.NFTDetails.auction.expired){
                return <>
                    <div>
                        <span>Current Highest Bid : {this.state.NFTDetails.auction.getCurrentHighestBid} eth</span>
                    </div>
                    <div>                        
                        <Form.Group className="mb-3 row-form" controlId="formPriceBid">
                            <Form.Label>Bid in ETH</Form.Label>
                            <Form.Control required size="sm" type="number" value={this.state.pricingForBid} name="pricingForBid" step="0.00000001" placeholder="0.00000001" onChange={this.handleChange}/>
                        </Form.Group>
                        <Button className="mx-2" onClick={this.buyNow}>Buy now</Button>
                    </div>
                </>
            }else{
                return <span>not in sell</span>
            }
        }
    }
    // token = () => {
    //     if(this.state.NFTDetails.tokenAddress.toLowerCase() == this.store.state.contractCYON._address.toLowerCase()){
    //         return <span>CYON</span>
    //     }else{
    //         return <span>ETH</span>
    //     }
    // }
    payment = () => {
        if(this.state.NFTDetails.isAuctionable){
            return <Button className="mx-2" variant="outline-primary" onClick={this.makeOffer}>Make offer</Button>
        }
    }
    historyTrading = () => {
        const hasCurrentAction = false;
        if(hasCurrentAction){
            return <>{this.historyCurrentAuction()}</>
        }else{
            return <>{this.historyPrice()}</>
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