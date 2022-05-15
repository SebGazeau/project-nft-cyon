import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NFTCollectionsContract from "../contracts/NFTCollections.json";
import Figure from 'react-bootstrap/Figure'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup'
import BN from 'bn.js'
export default class NFTDetails extends React.Component {
    options = {
        fromBlock: 0,              
        toBlock: 'latest'
    };
    address = window.location.pathname.split('/')[3]
    tokenID = window.location.pathname.split('/')[4]
    constructor(props) {
        super(props);
        this.state = {
            NFTDetails: {},
            pricingForBid: 0,
            oldBid: 0,
            historyBid: [],
        }
    }
    componentDidMount = async () => {
        console.log('for nft', this.props)
        this.nftDetails();
    }
    handleChange = (event) => {
        let { name, value } = event.target;
        // if(name === 'pricingForBid'){
        //     value = (value) ? parseInt(value) : 0
        // }
        this.setState({
            [name]: value
        });
    }
    withdraw =async () => {
        const res = await this.props.state.contractMaster.methods.withdrawRefund(this.address, this.tokenID).send({from: this.props.state.accounts[0]});
    }
    forceUpdateHandler = ()=>{
        this.forceUpdate();
    };
    makeOffer = async () => {
        console.log('make offer')
        if(this.state.pricingForBid != 0){
            const res = await this.props.state.contractMaster.methods.bid(this.address, this.tokenID).send({from: this.props.state.accounts[0], value: (this.state.pricingForBid*10**18)});
            console.log(res)
            this.forceUpdateHandler();
        }
    }
    buyNow = async () => {
        if(this.state.NFTDetails.price != 0){
            await this.props.state.contractCYON.methods.approve(this.props.state.contractMaster._address,new BN((this.state.NFTDetails.price).toString())).send({from: this.props.state.accounts[0]});
            const allowance = await this.props.state.contractCYON.methods.allowance(this.props.state.accounts[0],this.props.state.contractMaster._address).call();
            const balSender = await this.props.state.contractCYON.methods.balanceOf(this.props.state.accounts[0]).call();
            const balMaster = await this.props.state.contractCYON.methods.balanceOf(this.props.state.contractMaster._address).call();
            const res = await this.props.state.contractMaster.methods.buyNFT(this.address, this.tokenID).send({from: this.props.state.accounts[0]});
            const origin = window.location.origin;
            window.location.href = `${origin}/profile`;
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
                    .call();
                const auction = {};
                auction.isInAuction = isInAuction;
                if(isInAuction){
                  const checkAuctionTimeExpired= await this.props.state.contractMaster.methods
                    .checkAuctionTimeExpired(this.address, cc.returnValues._tokenID)
                    .call();
                  if(!checkAuctionTimeExpired){
                    auction.expired = false;
                    const getCurrentHighestBid= await this.props.state.contractMaster.methods
                      .getCurrentHighestBid(this.address, cc.returnValues._tokenID)
                      .call();
                    const getCurrentHighestBidder= await this.props.state.contractMaster.methods
                      .getCurrentHighestBidder(this.address, cc.returnValues._tokenID)
                      .call();
                    const getBiddersAmount= await this.props.state.contractMaster.methods
                      .getBiddersAmount(this.address, cc.returnValues._tokenID)
                      .call();
                    const getTotalBid = await this.props.state.contractMaster.methods
                        .getTotalBid(this.address, cc.returnValues._tokenID)
                        .call({from: this.props.state.accounts[0]});
                    console.log('getTotalBid', getTotalBid)
                    this.setState({oldBid: getTotalBid});
                    auction.getCurrentHighestBid = getCurrentHighestBid
                    auction.getCurrentHighestBidder = getCurrentHighestBidder
                    auction.getBiddersAmount = getBiddersAmount
                  }
                }
                const HighestBidIncreased = await this.props.state.contractMaster.getPastEvents('HighestBidIncreased', this.options);
                if(HighestBidIncreased.length > 0) {
                    for(const HBI of HighestBidIncreased){
                        console.log('hbi', HBI)
                        this.setState({historyBid: this.state.historyBid.concat([HBI.returnValues._newBid])})
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
    isCurrentHighestBidder = () => {
        return this.state.NFTDetails.getCurrentHighestBidder.toLowerCase() === this.props.state.accounts[0].toLowerCase()
    }
    detailPrice = () => {   
        let html;
        if(this.state.NFTDetails.price != undefined){
            if(this.state.NFTDetails.price != '0' && !this.state.NFTDetails.auction.isInAuction) {
                return <>
                    <div>
                        <span>Current price : {}</span><div><span>{(this.state.NFTDetails.price/10**18)}</span> CYON</div>
                    </div>
                    <div>

                        <Button className="mx-2" onClick={this.buyNow}>Buy now</Button>
                    </div>
                </>
            }else if(this.state.NFTDetails.auction.isInAuction && !this.state.NFTDetails.auction.expired){
                return <>
                    <div>
                        {(this.isCurrentHighestBidder) 
                            ? <span>you're the Current Highest Bidder with {(this.state.NFTDetails.auction.getCurrentHighestBid/10**18)} eth</span> 
                            : <span>Current Highest Bid : {(this.state.NFTDetails.auction.getCurrentHighestBid/10**18)} eth</span>}
                    </div>
                    <div>                        
                        <Form.Group className="mb-3 row-form" controlId="formPriceBid">
                            <Form.Label>Bid in ETH</Form.Label>
                            <Form.Control required size="sm" type="number" value={this.state.pricingForBid} name="pricingForBid" step="0.00000001" placeholder="0.00000001" onChange={this.handleChange}/>
                        </Form.Group>
                        <div>
                            {(this.state.oldBid > 0 && !this.isCurrentHighestBidder) 
                                ? <span>your total old bid is {(this.state.oldBid/10**18)}</span> 
                                : <span></span>}
                        </div>
                        <div>
                            {this.canWithdraw()}
                            <Button className="mx-2" onClick={this.makeOffer}>Bid</Button>
                        </div>
                    </div>
                </>
            }else{
                return <span>not in sell</span>
            }
        }
    }
    canWithdraw = () => {
        if(this.state.oldBid > 0 && !this.isCurrentHighestBidder){
            return <Button className="mx-2" onClick={this.withdraw}>Withdraw total old bid</Button>
        }
    }
    payment = () => {
        if(this.state.NFTDetails.isAuctionable){
            return <Button className="mx-2" variant="outline-primary" onClick={this.makeOffer}>Make offer</Button>
        }
    }
    historyTrading = () => {
        if(this.state.NFTDetails.auction != undefined){
            const hasCurrentAction = this.state.NFTDetails.auction.isInAuction || false;
            if(hasCurrentAction){
                return <>{this.historyCurrentAuction()}</>
            }else{
                return <>{this.historyPrice()}</>
            }
        }
    }
    historyPrice = () => {
        return <>
            <Card.Header>Price History</Card.Header>
            <Card.Body>

            </Card.Body>
        </>
    }
    historyCurrentAuction = () => {
        return <>
            <Card.Header>list History Auction</Card.Header>
            <Card.Body>
                <ListGroup variant="flush">
                {this.state.historyBid.map((bid, index) => (
                    <ListGroup.Item key={index}>{(bid/10**18)} eth</ListGroup.Item>
                ))}
                </ListGroup>
            </Card.Body>
        </>
    }
    render()  {
      return (
        <div>
            <Container className="mt-5 d-flex">
                <Col className="me-3">
                    <Figure>
                        <Figure.Image className="image-nft-detail" variant="top" src={this.state.NFTDetails.url} />
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
                        <Card.Body className="card-detail-price">
                            {this.detailPrice()}

                        </Card.Body>
                    </Card>
                    <Card>
                        {this.historyTrading()}
                    </Card>
                </Col>

            </Container>
        </div>
      );
    }
  }