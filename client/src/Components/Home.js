import React from 'react';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  changeFilter = (event) => {
    const filter = event.target.dataset.rrUiEventKey;
    console.log('event', event.target.dataset.rrUiEventKey)
  };
  selectCollection = (address) => {
      
      console.log('address -', address);
      // this.navigate({to:`/collection/${address}`})
      // history.push(`/collection/${address}`)
    }
    render()  {
      return (
        <div className="mt-3">
          <Container>
            <Nav variant="pills" defaultActiveKey="one">
              <Nav.Item>
                <Nav.Link eventKey="one">Active</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='two' onClick={this.changeFilter}>Option 2</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                  Disabled
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Container>
            <h1>Collections</h1>
            <Container className="container-card">
              {[
                'Primary',
                'Secondary',
                'Success',
                'Danger',
                'Warning',
                'Info',
                'Light',
                'Dark',
              ].map((variant) => (
                <Link key={variant} className="link-collection m-2" to={`/collection/${variant}`}>
                  <Card bg={variant.toLowerCase()} text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}>
                    <Card.Header>Header</Card.Header>
                    <Card.Body onClick={() => {this.selectCollection('address')}}>
                      <Card.Title>{variant} Card Title </Card.Title>
                      <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  </Link>
              ))}
            </Container>
        </div>
      );
    }
  }