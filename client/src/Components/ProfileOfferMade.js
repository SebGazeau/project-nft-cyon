import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default class ProfileOfferMade extends React.Component {
    constructor(props) {
        super(props);
    }
    render()  {
      return (
        <div>
          <Container className="container-list">
          <ListGroup>
            <ListGroup.Item>Cras justo odio</ListGroup.Item>
            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item>Morbi leo risus</ListGroup.Item>
            <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
        </ListGroup>
        </Container>
        </div>
      );
    }
  }