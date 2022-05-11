import React from 'react';
import SwapToken from './SwapToken';
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
export default class CreateNFT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            // address _user,
            tokenURI: '',
            tag: '',
            collection: '',
            token: '',
            // uint256 _price,
            // bool _favorite,
            // bool _isAuctionable
            listCollection: [],
          }
      }
      componentDidMount = async () => {
        // window.addEventListener('load', () =>{
            console.log('for call', this.props)
            setTimeout(this.collection, 3000)
            // await ;
        // })
    }
    handleChangeName = (event) => {
        this.setState({name: event.target.value});
    }
    handleChangeDescription = (event) => {
        this.setState({description: event.target.value});
    }
    handleChangeTag = (event) => {
        this.setState({tag: event.target.value});
    }
    handleChangeCollection = (event) => {
        this.setState({collection: event.target.value});
    }
    handleChangeToken = (event) => {
        const { name, value } = event
        .target;
        this.setState({
            [name]: value
        });
    }
    collection = async (e) => {
        let options = {
            fromBlock: 0,              
            toBlock: 'latest'
        };
        console.log('collection', this.props.state)
        if(this.props.state.contractMaster){
        //   const nftCollDeployedNetwork = NFTCollectionsContract.networks[this.props.state.networkId];

            const collectionCreated = await this.props.state.contractMaster.getPastEvents('NFTCollectionCreated', options);
            console.log('collectionCreated', collectionCreated)
            if(collectionCreated.length > 0){
              for(const cc of collectionCreated){            
                // const nftCollectionInstance = new this.props.state.web3.eth.Contract(
                //     NFTCollectionsContract.abi, cc.returnValues.collectionAddress,
                // );
                // console.log(nftCollectionInstance)
                this.setState({
                  listCollection: this.state.listCollection.concat([
                    {name: cc.returnValues._NFTName, address: cc.returnValues._collectionAddress}
                  ])
                })
              }

            }
        }
    }
    render()  {
      return (
        <div>
            <h2 className="mt-3">Create NFT</h2>
            <Form className="mt-4">
                <Container className="container-form">
                    <Form.Group controlId="formFile" className="mb-3 row-form">
                        <Form.Label >File</Form.Label>
                        <Form.Control type="file" />
                    </Form.Group>
                    <Form.Group className="mb-3 row-form" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="name" />
                    </Form.Group>
                    <Form.Group className="mb-3 row-form" controlId="formTextarea">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                    <Form.Group className="mb-3 row-form" controlId="formTag">
                        <Form.Label>Select a tag</Form.Label>
                        <Form.Select value={this.state.tag} onChange={this.handleChangeTag}>
                            <option key='0' value=''>Select a Tag</option>
                            {[
                            {id:'primary', name:'Primary'},
                            {id:'secondary', name:'Secondary'},
                            {id:'success', name:'Success'},
                            ].map((variant) => (<option key={variant.id} value={variant.id}>{variant.name}</option>))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3 row-form" controlId="formCollection">
                        <Form.Label>Select a collection</Form.Label>
                        <Form.Select value={this.state.collection} onChange={this.handleChangeCollection}>
                            <option key='0' value=''>Select a Collection</option>
                            {this.state.listCollection.map((collection) => (
                                <option key={collection.address} value={collection.address}>{collection.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3 row-form" controlId="formTokens">
                        <Form.Label>Payment token</Form.Label>
                        <Form.Check inline type="radio" name="token" onChange={this.handleChangeToken} label="ETH" value='0x64FF637fB478863B7468bc97D30a5bF3A428a1fD' id="token-eth" />
                        <Form.Check inline type="radio" name="token" onChange={this.handleChangeToken} label="CYON" value={this.store.state.contractCYON._address} id="token-cyon" />
                    </Form.Group>
                    <div className="div-btn">
                        <Button type="submit">Submit form</Button>
                    </div>
                </Container>
            </Form>
        </div>
      );
    }
  }