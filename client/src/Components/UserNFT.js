import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NFTCollectionsContract from "../contracts/NFTCollections.json";
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
export default class UserNFT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          nftCollectionInstance: null,
          arrayNFT: [],
          show: false,
          forSell: {
            tokenID: '',
            sale: '',
            pricing: 0,
          }
        }
    }
    handleClose = () => {
      this.setState({
        show:false,
        forSell: {tokenID:''}
      })
    };
    handleShow = (id) => {
      this.setState({
        show:true,
        forSell: {tokenID:id}
      })
    };
    handleChange = (event) => {
      const { name, value } = event.target;
      this.setState({
          forSell:{[name]: value}
      });
    }
    submitForm = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      let selling;
      if(this.state.forSell.sale === 'direct' && this.state.forSell.pricing != 0){
        selling = await this.props.state.contractMaster.methods.setNewPrice(this.props.collectionSelected, this.state.forSell.tokenID, this.state.forSell.pricing);
      }
      if(selling){
        const profile = `${window.location.origin}/profile`;
        window.location.href = origin;
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
          console.log(this.state.arrayNFT)
      }
    }
    canSell = (price, tID) => {
      if(price == '0'){
        return <Button variant="primary" onClick={() => this.handleShow(tID)}>sell</Button>;
      }
    }
    needPrice = () => {
      if(this.state.forSell.sale == 'direct'){
        return <Form.Group className="mb-3 row-form" controlId="formPrice"><Form.Label>Your price in CYON</Form.Label><Form.Control required size="sm" type="number" value={this.state.forSell.pricing} name="price" step="0.00000001" placeholder="0.00000001" onChange={this.handleChangeToken}/></Form.Group>
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
                    <Card.Img variant="top" src={nft.url} />
                    <Card.Body>
                      <Card.Title>Card Title </Card.Title>
                      <Card.Text>
                        {this.canSell(nft.price, nft.tokenID)}
                    
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