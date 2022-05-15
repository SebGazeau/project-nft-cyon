import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MasterContract from "../contracts/Master.json";
import ListGroup from 'react-bootstrap/ListGroup'

// Component that displays the offers received for the connected user's NFTsuser
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

        // Recovery of the events for the sold NFT
        const CollectionSolded = await this.props.state.contractMaster.getPastEvents('NFTSold', options);

        // Storage of NFT sales that have their previous owner's address equal to the connected address
        if(CollectionSolded.length > 0){
          for(const cc of CollectionSolded){       
            const oldOwner = cc.returnValues._oldOwner;
            if(oldOwner.toLowerCase() === this.props.state.accounts[0].toLowerCase()){
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