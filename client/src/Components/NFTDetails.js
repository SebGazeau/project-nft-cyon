import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Figure from 'react-bootstrap/Figure'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
export default class NFTDetails extends React.Component {
    constructor(props) {
        super(props);
    }
    render()  {
      return (
        <div>
            <Container className="mt-5 d-flex">
                <Col className="me-3">
                    <Figure>
                        <Figure.Image variant="top" src="https://gateway.pinata.cloud/ipfs/QmPinxiZPrPp57gjCg7TbLmzbXtSTd1yrXHTj2qiBRNFCn/img.jpg" />
                        <Figure.Caption>
                            Nulla vitae elit libero, a pharetra augue mollis interdum.
                        </Figure.Caption>
                    </Figure>
                    <Card>
                        <Card.Header>Header</Card.Header>
                        <Card.Body>
                        <Card.Title>Card Title </Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the
                            bulk of the card's content.
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="ms-3">
                    <h3>Title NFT</h3>
                    <Card>
                        <Card.Header>Header</Card.Header>
                        <Card.Body>
                        <Card.Title>Card Title </Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the
                            bulk of the card's content.
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

            </Container>
        </div>
      );
    }
  }