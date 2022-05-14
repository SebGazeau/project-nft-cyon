import React from 'react';
import SwapToken from './SwapToken';
import Figure from 'react-bootstrap/Figure'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
export default class CreateNFT extends React.Component {
    imgRef = React.createRef()
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            // address _user,
            tokenURI: '',
            tag: '',
            collection: '',
            // token: '',
            // uint256 _price,
            // bool _favorite,
            // bool _isAuctionable
            listCollection: [],
            file: null
          }
      }
      componentDidMount = async () => {
        // window.addEventListener('load', () =>{
            console.log('for call', this.props)
            setTimeout(this.collection, 3000)
            // await ;
        // })
    }
    handleChangeFile = (event) => {
        
        this.setState({file: event.target.files[0]});
        let img = this.imgRef.current
        const reader = new FileReader();
        reader.onload = () => {
            img.src = reader.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        // console.log()
    }
    handleChange = (event) => {
        console.log('change file', event.target)
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        // let res;
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let options = {
            fromBlock: 0,              
            toBlock: 'latest'
        };
        const formData = new FormData();
        console.log('file', this.state.file)
        formData.append('file', this.state.file);
        // formData.append('fileName', this.name);
        const metadata = JSON.stringify({
            name: this.name,
            keyvalues: {
                exampleKey: 'exampleValue'
            }
        });
        formData.append('pinataMetadata', metadata);
        const pinataOptions = JSON.stringify({
            cidVersion: 0,
            customPinPolicy: {
                regions: [
                    {
                        id: 'FRA1',
                        desiredReplicationCount: 1
                    },
                    {
                        id: 'NYC1',
                        desiredReplicationCount: 2
                    }
                ]
            }
        });
        formData.append('pinataOptions', pinataOptions);
        const config = {
            maxBodyLength: 'Infinity',
            headers: {
                'content-type': `multipart/form-data; boundary=${formData._boundary}`,
                'pinata_api_key': '47f012355c4cf88ad186',
                'pinata_secret_api_key': '012e111f01b16bacadd726acf6756d2fd86cc273a2997bd597d95b625de30e08'
            },
        };
        console.log('formdata', formData)
        const res = await axios.post(url, formData, config);
        if(this.state.collection === ''){
            const collectionCreated = await this.props.state.contractFactory.getPastEvents('NFTCollectionCreated', options);
            const lengthForFactory = (collectionCreated)? 0 : collectionCreated.length;
            const createNFTCollection = await this.props.state.contractFactory.methods
                .createNFTCollection(`temporary-${lengthForFactory}`,this.state.symbol)
                .send({from : this.props.state.accounts[0]});
            this.setState({collection :createNFTCollection.events.Transfer.returnValues._collectionAddress});
        }
        const createNFT = await this.props.state.contractMaster.methods
            .createNFT(
                this.state.collection,this.props.state.accounts[0],
                res.data.IpfsHash,
                this.state.name,
                this.state.description,
                this.state.tag,
                )
            .send({from : this.props.state.accounts[0]});
        console.log('createNFT', createNFT)
        if(createNFT){
            const origin = window.location.origin;
            window.location.href = origin;
        }
    }

    collection = async (e) => {
        let options = {
            fromBlock: 0,              
            toBlock: 'latest'
        };
        console.log('collection', this.props.state)
        if(this.props.state.contractMaster){
        //   const nftCollDeployedNetwork = NFTCollectionsContract.networks[this.props.state.networkId];

            const collectionCreated = await this.props.state.contractFactory.getPastEvents('NFTCollectionCreated', options);
            console.log('collectionCreated', collectionCreated)
            if(collectionCreated.length > 0){
              for(const cc of collectionCreated){            
                // const nftCollectionInstance = new this.props.state.web3.eth.Contract(
                //     NFTCollectionsContract.abi, cc.returnValues.collectionAddress,
                // );
                // console.log(nftCollectionInstance)
                if(cc.returnValues._creator.toLowerCase() === this.props.state.accounts[0].toLowerCase()){
                    this.setState({
                      listCollection: this.state.listCollection.concat([
                        {name: cc.returnValues._collectionName, address: cc.returnValues._collectionAddress}
                      ])
                    })
                }
              }

            }
        }
    }
    render()  {
      return (
        <div>
            <h2 className="mt-3">Create NFT</h2>
            <Form className="mt-4" onSubmit={this.handleSubmit}>
                <Container className="container-form">
                    <div className="row-file">
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label >File</Form.Label>
                            <Form.Control type="file" onChange={this.handleChangeFile}/>
                        </Form.Group>
                        <Figure>
                            <Figure.Image
                                ref={this.imgRef}
                                width={171}
                                height={180}
                            />
                        </Figure>
                    </div>
                    <Form.Group className="mb-3 row-form" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="name" name="name" value={this.state.name} onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3 row-form" controlId="formTextarea">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" value={this.state.description} onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3 row-form" controlId="formTag">
                        <Form.Label>Select a tag</Form.Label>
                        <Form.Select value={this.state.tag} name="tag" onChange={this.handleChange}>
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
                        <Form.Select value={this.state.collection} name="collection" onChange={this.handleChange}>
                            <option key='0' value=''>Select a Collection</option>
                            {this.state.listCollection.map((collection) => (
                                <option key={collection.address} value={collection.address}>{collection.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {/* <Form.Group className="mb-3 row-form" controlId="formTokens">
                        <Form.Label>Payment token</Form.Label>
                        <Form.Check inline type="radio" name="token" onChange={this.handleChangeToken} label="ETH" value='0x64FF637fB478863B7468bc97D30a5bF3A428a1fD' id="token-eth" />
                        <Form.Check inline type="radio" name="token" onChange={this.handleChangeToken} label="CYON" value={this.props.state.contractCYON._address} id="token-cyon" />
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