import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default class UserCollection extends React.Component {
    constructor(props) {
        super(props);
    }
    render()  {
      return (
        <div>
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
                <div key={variant} className="link-collection pointer-collection m-2" onClick={() => {this.props.selectCollection('address')}}>
                  <Card bg={variant.toLowerCase()} text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}>
                    <Card.Header>Header</Card.Header>
                    <Card.Body >
                      <Card.Title>{variant} Card Title </Card.Title>
                      <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  </div>
              ))}
            </Container>
        </div>
      );
    }
  }