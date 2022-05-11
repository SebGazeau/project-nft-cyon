import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
export default class UserNFT extends React.Component {
    constructor(props) {
        super(props);
    }
    render()  {
      return (
        <div>
            <h1>One Collection</h1>
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
                <div key={variant} className="link-collection pointer-collection m-2">
                  <Card bg={variant.toLowerCase()} text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}>
                    <Card.Header>Header</Card.Header>
                    <Card.Img variant="top" src="https://gateway.pinata.cloud/ipfs/QmPinxiZPrPp57gjCg7TbLmzbXtSTd1yrXHTj2qiBRNFCn/img.jpg" />
                    <Card.Body>
                      <Card.Title>{variant} Card Title </Card.Title>
                      <Card.Text>
                        
                        button
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