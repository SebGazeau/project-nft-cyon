import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NFTCollectionsContract from "../contracts/NFTCollections.json";
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import BN from 'bn.js'
export default class UserNFT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          nftCollectionInstance: null,
          arrayNFT: [],
          show: false,
          // forSell: {
            tokenIDForSell: '',
            saleForSell: '',
            pricingForSell: 0,
            bidingTimeForSell: 0,
          // }
        }
    }
    handleClose = () => {
      this.setState({
        show:false,
        tokenIDForSell: ''
      })
    };
    handleShow = (id) => {
      console.log('id', id)
      this.setState({
        show:true,
        tokenIDForSell: id,
      })
    };
    cancelSell =async (id) => {
      console.log('id', id)
      // this.setState({
      //   show:true,
      //   tokenIDForSell: id,
      // })
      // await this.state.nftCollectionInstance.methods.approve('0x0',this.state.tokenIDForSell).send({from: this.props.state.accounts[0]});
      await this.state.nftCollectionInstance.methods
        .setPrice(id,0)
        .send({from : this.props.state.accounts[0]});
        alert(
          `Use Metamask for cancel approval.`,
        );
        const profile = `${window.location.origin}/profile`;
        window.location.href = profile;
    };
    handleChange = (event) => {
      console.log('event', event.target)
      console.log('state', this.state)
      const { name, value } = event.target;
      switch (name) {
        case 'tokenID':
          this.setState({tokenIDForSell: value});
          break;
        case 'sale':
          this.setState({saleForSell: value});
          break;
        case 'pricing':
          (value) ? this.setState({pricingForSell: parseInt(value)}) : this.setState({pricingForSell: value}) 
          break;
        case 'time':
          this.setState({bidingTimeForSell: value})
          break;
      }
      this.setState({
          forSell:{[name]: value}
      });
    }
    submitForm = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      let selling;
      console.log('collectionSelected',this.props.collectionSelected)
      console.log('forSell',this.state)
      await this.state.nftCollectionInstance.methods.approve(this.props.state.contractMaster._address,this.state.tokenIDForSell).send({from: this.props.state.accounts[0]});
      if(this.state.saleForSell === 'direct' && this.state.pricingForSell != 0){
        selling = await this.props.state.contractMaster.methods
          .setNewPrice(this.props.collectionSelected, this.state.tokenIDForSell,new BN((this.state.pricingForSell*10**18).toString()))
          .send({from : this.props.state.accounts[0]});

      }else if(this.state.saleForSell === 'auction'){
        const requestAuction= await this.props.state.contractMaster.methods
          .requestAuction(this.props.collectionSelected, this.state.tokenIDForSell)
          .send({from : this.props.state.accounts[0]});
        console.log('requestAuction',requestAuction)
        if(requestAuction){
          const initialPrice = (this.state.pricingForSell != 0) ? new BN((this.state.pricingForSell*10**18).toString()) : this.state.pricingForSell;
          const inSecond = (new Date(this.state.bidingTimeForSell).getTime()/1000).toFixed(0);
          console.log('inSecond', inSecond)
          const startAuction = await this.props.state.contractMaster.methods
            .startAuction(this.props.collectionSelected, this.state.tokenIDForSell,new BN((inSecond).toString()))
            .send({from : this.props.state.accounts[0], value: initialPrice});
          if(startAuction){
            selling = true;
          }
        }
      }
      
      console.log(selling)
      if(selling){
        const profile = `${window.location.origin}/profile`;
        window.location.href = profile;
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
      console.log('collection', this.props)
      if(this.props.state.contractFactory){
        const nftCollDeployedNetwork = NFTCollectionsContract.networks[this.props.state.networkId];
        const nftCollectionInstance = new this.props.state.web3.eth.Contract(
            NFTCollectionsContract.abi, this.props.collectionSelected,
        );
        this.setState({nftCollectionInstance:nftCollectionInstance})
        console.log(nftCollectionInstance)
        const NFTCreated = await nftCollectionInstance.getPastEvents('NFTCreated', options);
          // const collectionCreated = await this.props.state.contractFactory.getPastEvents('NFTCollectionCreated', options);
          if(NFTCreated.length > 0){
            for(const cc of NFTCreated){            
              console.log('cc', cc)
              const owner = await nftCollectionInstance.methods.ownerOf(cc.returnValues._tokenID).call();
              if(owner.toLowerCase() === this.props.state.accounts[0].toLowerCase()){
                const firstUri = await nftCollectionInstance.methods.tokenURI(cc.returnValues._tokenID).call();
                const getPrice = await nftCollectionInstance.methods.getPrice(cc.returnValues._tokenID).call();
                const isInAuction= await this.props.state.contractMaster.methods
                  .isInAuction(this.props.collectionSelected, cc.returnValues._tokenID)
                  .call();
                console.log('isInAuction', isInAuction)
                const auction = {};
                if(isInAuction){
                  auction.isInAuction = isInAuction;
                  const checkAuctionTimeExpired= await this.props.state.contractMaster.methods
                    .checkAuctionTimeExpired(this.props.collectionSelected, cc.returnValues._tokenID)
                    .call();
                  if(!checkAuctionTimeExpired){
                    auction.expired = false;
                    const getCurrentHighestBid= await this.props.state.contractMaster.methods
                      .getCurrentHighestBid(this.props.collectionSelected, cc.returnValues._tokenID)
                      .call();
                    const getBiddersAmount= await this.props.state.contractMaster.methods
                      .getBiddersAmount(this.props.collectionSelected, cc.returnValues._tokenID)
                      .call();
                    auction.getCurrentHighestBid = getCurrentHighestBid
                    auction.getBiddersAmount = getBiddersAmount
                  }
                }
                this.setState({
                  arrayNFT: this.state.arrayNFT.concat([{
                    tokenID: cc.returnValues._tokenID,
                    name: cc.returnValues._collectionData.name, 
                    tokenAddress: cc.returnValues._collectionData.tokenAddress, 
                    description: cc.returnValues._collectionData.description, 
                    tag: cc.returnValues._collectionData.tag, 
                    price: getPrice, 
                    auction: auction, 
                    url:`https://gateway.pinata.cloud/ipfs/${firstUri}`
                  }])
                })
              }
            }

          }
          console.log(this.state.arrayNFT)
      }
    }
    canSell = (price, tID, auction) => {
      if(price == '0' && !auction.isInAuction){
        return <Button variant="primary" onClick={() => this.handleShow(tID)}>sell</Button>;
      }else{
        if(auction.isInAuction){
          if(!auction.expired){
            return <>
              <div>
                <span>Auction in progress</span><br/>
                <span>Current Highest Bid : {auction.getCurrentHighestBid}</span><br/>
                <span>Bidders Amount : {auction.getBiddersAmount}</span>
              </div>
            </>
          }
          return <>{this.auctionInfo()}</>
        }else{
          return <Button variant="primary" onClick={() => this.cancelSell(tID)}>Cancel Sell</Button>;
        }
      }
    }
    needPrice = () => {
      if(this.state.saleForSell == 'direct'){
        return <>
          <Form.Group className="mb-3 row-form" controlId="formPrice">
            <Form.Label>Your price in CYON</Form.Label>
            <Form.Control required size="sm" type="number" value={this.state.pricingForSell} name="pricing" step="0.00000001" placeholder="0.00000001" onChange={this.handleChange}/>
          </Form.Group>
        </>
      }else if(this.state.saleForSell == 'auction'){
        return <>
          <Form.Group className="mb-3 row-form" controlId="formPrice">
            <Form.Label>Initial price for auction in ETH</Form.Label>
            <Form.Control required size="sm" type="number" value={this.state.pricingForSell} name="pricing" step="0.00000001" placeholder="0.00000001" onChange={this.handleChange}/>
          </Form.Group>
          <Form.Group className="mb-3 row-form" controlId="formPrice">
            <Form.Label>Timing for auction</Form.Label>
            <Form.Control required size="sm" type="date" value={this.state.bidingTimeForSell} name="time" step="0.00000001" placeholder="0.00000001" onChange={this.handleChange}/>
          </Form.Group>
        </>
      }else{
        return <>
          <span>select a listing option</span>
        </>
      }
    }
    render()  {
      return (
        <div>
            <h1>One Collection</h1>
            <Container className="container-card">
              {this.state.arrayNFT.map((nft, index) => (
                <div key={index} className="link-collection pointer-collection m-2">
                  <Card bg={'light'} text={'dark'}>
                    <Card.Header>{nft.name}</Card.Header>
                    <Card.Img className='card-collection' variant="top" src={nft.url} />
                    <Card.Body>
                      <Card.Title>Card Title </Card.Title>
                      <Card.Text>
                        {this.canSell(nft.price, nft.tokenID, nft.auction)}
                    
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Container>
            <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal Selling</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3 row-form" controlId="formTokens">
                <Form.Label>How to sell</Form.Label>
                <Form.Check inline type="radio" name="sale" onChange={this.handleChange} label="Auction" value='auction' id="token-eth" />
                <Form.Check inline type="radio" name="sale" onChange={this.handleChange} label="Direct" value='direct' id="token-cyon" />
            </Form.Group>
            {this.needPrice()}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.submitForm}>
            submit
          </Button>
        </Modal.Footer>
      </Modal>
        </div>
      );
    }
  }