import React from 'react';
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import UserCollection from './UserCollection';
import UserOfferReceived from './UserOfferReceived';
import UserOfferMade from './UserOfferMade';
import UserNFT from './UserNFT';
export default class UserProfile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          keyTab: 'collection',
          setShow: false,
          validated: false,
          collectionSelected: ''
      }
    }
    handleSelect = (eventKey) => this.setState({ keyTab: eventKey});
    selectedCollection = (val) =>{
      // console.log('selected', event.target.value)
      this.setState({ 
        keyTab: 'nft',
        collectionSelected: val
      });
      console.log('selected', val)
    }
    render()  {
      const project = () => {
        switch(this.state.keyTab) {
  
          case "collection":   return <div id="collection-profile-container"><UserCollection state={this.props.state} selectCollection={this.selectedCollection}></UserCollection></div>;
          case "nft":   return <UserNFT collectionSelected={this.state.collectionSelected} state={this.props.state}/>;
          case "received":   return <UserOfferReceived state={this.props.state}/>;
          case "made": return <UserOfferMade state={this.props.state}/>;
  
          default:      return <h1>No project match</h1>
        }
      }
      return (
        <div>
          <Container>
          <Row className="mt-3">
              <Nav variant="pills" onSelect={this.handleSelect}>
                <Nav.Item>
                  <Nav.Link eventKey="collection" activekey="collection">
                    Collection
                  </Nav.Link>
                </Nav.Item>
                <NavDropdown title="offers" id="nav-dropdown">
                  <NavDropdown.Item eventKey="received"  activekey="offers">received</NavDropdown.Item>
                  <NavDropdown.Item eventKey="made"  activekey="offers">made</NavDropdown.Item>
                </NavDropdown>
              </Nav>
          </Row>
          </Container>
          {project()}
        </div>
      );
    }
  }