import React from 'react';
import SwapToken from './SwapToken';
import Form from 'react-bootstrap/Form'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ProfileCollection from './ProfileCollection';
import ProfileOfferReceived from './ProfileOfferReceived';
import ProfileOfferMade from './ProfileOfferMade';
import ProfileNFT from './ProfileNFT';
export default class Profile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          keyTab: 'collection',
          setShow: false,
          validated: false
      }
    }
    handleSelect = (eventKey) => this.setState({ keyTab: eventKey});
    selectedCollection = (val) =>{
      // console.log('selected', event.target.value)
      this.setState({ keyTab: 'nft'});
      console.log('selected', val)
    }
    render()  {
      const project = () => {
        switch(this.state.keyTab) {
  
          case "collection":   return <div id="collection-profile-container"><ProfileCollection selectCollection={this.selectedCollection}></ProfileCollection></div>;
          case "nft":   return <ProfileNFT />;
          case "received":   return <ProfileOfferReceived />;
          case "made": return <ProfileOfferMade />;
  
          default:      return <h1>No project match</h1>
        }
      }
      return (
        <div>
          <Container>
          <Row>

          <Nav variant="pills" onSelect={this.handleSelect}>
            <Nav.Item>
              <Nav.Link eventKey="collection" activeKey="collection">
                Collection
              </Nav.Link>
            </Nav.Item>
            <NavDropdown title="offers" id="nav-dropdown">
              <NavDropdown.Item eventKey="received"  activeKey="offers">received</NavDropdown.Item>
              <NavDropdown.Item eventKey="made"  activeKey="offers">made</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          </Row>
          </Container>
          {project()}
        </div>
      );
    }
  }