import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MasterContract from "../contracts/Master.json";
import ListGroup from 'react-bootstrap/ListGroup'

export default class UserOfferReceived extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          arrayNFT: [],
        }
    }

    componentDidMount = async () => {
      this.Master();
    }
    Master = async (e) =>{
      const options = {
          fromBlock: 0,              
          toBlock: 'latest'
      };
      if(this.props.state.contractMaster){

        const NFTSolded = await this.props.state.contractMaster.getPastEvents('NFTSold', options);
        console.log("NFTSolded.length=",NFTSolded.length);



          /*if(NFTSolded.length > 0){
            for(const cc of NFTSolded){            
              const owner = await instance.methods.ownerOf(cc.returnValues._tokenID).call();
              if(owner.toLowerCase() === this.props.state.accounts[0].toLowerCase()){
                const firstUri = await instance.methods.tokenURI(cc.returnValues._tokenID).call();
                this.setState({
                  arrayNFT: this.state.arrayNFT.concat([{
                    firstOwner: cc.returnValues._firstOwner,
                    creator: cc.returnValues._collectionData._creator, 
                    tokenURI: cc.returnValues._collectionData._tokenURI, 
                    name: cc.returnValues._collectionData._name, 
                    description: cc.returnValues._collectionData._description, 
                    tag: cc.returnValues._collectionData._tag, 
                    tokenAddress: cc.returnValues._collectionData._tokenAddress, 
                    price: cc.returnValues._collectionData._price,
                    favorite: cc.returnValues._collectionData._favorite, 
                    url:`https://gateway.pinata.cloud/ipfs/${firstUri}`
                  }])
                })
              }
            }

          }*/
      }
    }

    render()  {
      return (
        <div>
          <Container className="container-list">
            {this.state.arrayNFT.map((nft, index) => (
              <Link key={index} className="link-collection m-2" to={`/collection/nft/${this.address}/${nft.tokenURI}`}>
                <Card bg={'light'} text={'dark'}>
                  <Card.Header>{nft.name}</Card.Header>
                  <Card.Img variant="top" src={nft.tag} />
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