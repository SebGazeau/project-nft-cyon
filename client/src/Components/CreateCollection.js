import React from 'react';
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
export default class CreateCollection extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          name: '',
          symbol: '',
          description: '',
        }
    }
    handleChangeName = (event) => {
      this.setState({name: event.target.value});
    }
    handleChangeSymbol = (event) => {
      this.setState({symbol: event.target.value});
    }
    handleChangeDescription = (event) => {
      this.setState({description: event.target.value});
    }
    handleSubmit = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      console.log(this.props.state)
      console.log(this.state)
      const createNFTCollection = await this.props.state.contractFactory.methods
        .createNFTCollection(this.state.name,this.state.symbol)
        .send({from : this.props.state.accounts[0]});
      console.log('createNFTCollection', createNFTCollection)
      if(createNFTCollection){
        const origin = window.location.origin;
        window.location.href = origin;
      }
    }
    render()  {
      return (
        <div>
            <h2 className="mt-3">Create Collection</h2>
            <Form className="mt-4" onSubmit={this.handleSubmit}>
              <Container className="container-form">
                  <Form.Group className="mb-3 row-form" controlId="formName">
                      <Form.Label>Name *</Form.Label>
                      <Form.Control type="text" value={this.state.name} onChange={this.handleChangeName} placeholder="Collection Name" />
                  </Form.Group>
                  <Form.Group className="mb-3 row-form" controlId="formSymbol">
                      <Form.Label>Symbol *</Form.Label>
                      <Form.Control type="text" value={this.state.symbol} onChange={this.handleChangeSymbol} placeholder="CLN" />
                  </Form.Group>
                  {/* <Form.Group className="mb-3 row-form" controlId="formTextarea">
                      <Form.Label>Description</Form.Label>
                      <Form.Control as="textarea" value={this.state.description} onChange={this.handleChangeDescription} rows={3} />
                  </Form.Group> */}
                  <div className="div-btn">
                      <Button type="submit">Submit form</Button>
                  </div>
              </Container>
            </Form>
        </div>
      );
    }
  }