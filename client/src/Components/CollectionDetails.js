import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
export default class CollectionDetails extends React.Component {
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
                <Link key={variant} className="link-collection m-2" to={`/collection/nft/${variant}`}>
                  <Card bg={variant.toLowerCase()} text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}>
                    <Card.Header>Header</Card.Header>
                    <Card.Img variant="top" src="https://gateway.pinata.cloud/ipfs/QmPinxiZPrPp57gjCg7TbLmzbXtSTd1yrXHTj2qiBRNFCn/img.jpg" />
                    <Card.Body>
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