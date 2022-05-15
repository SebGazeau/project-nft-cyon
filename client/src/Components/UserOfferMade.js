import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Component that displays the offers made for the connected user's NFTs
export default class UserOfferMade extends React.Component {
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

        const CollectionSolded = await this.props.state.contractMaster.getPastEvents('NFTSold', options);

        // Storage of NFT sales that have their new owner address equal to the connected address
        if(CollectionSolded.length > 0){
          for(const cc of CollectionSolded){       
            const newOwner = cc.returnValues._newOwner;
            if(newOwner.toLowerCase() === this.props.state.accounts[0].toLowerCase()){
              this.setState({
                arrayNFT: this.state.arrayNFT.concat([{
                  collectionName: cc.returnValues._collectionName,
                  price: cc.returnValues._price,
                  units: cc.returnValues._units
                }])
              })
            }
          }
        }
      }
    }

    render()  {
      return (
        <div>
          <Container className="container-list">
          <ListGroup>
            {(this.state.arrayNFT!=null)?this.state.arrayNFT.map((a) => (<ListGroup.Item>Collection = "{a.collectionName}", Units = "{a.units}", Price = "{a.price}"</ListGroup.Item>)):""}
        </ListGroup>
        </Container>
        </div>
      );
    }
  }