import React from 'react';
import NFTCollectionsContract from "../contracts/NFTCollections.json";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner'
export default class UserCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        arrayCollection: [],
        onLoad: true,
    }
}
    componentDidMount = async () => {
      // window.addEventListener('load', () =>{
          console.log('for call', this.props)
          setTimeout(this.collection, 3000)
          // await ;
      // })
  }

  selectCollection = (address) => {
      
    console.log('address -', address);
  // this.navigate({to:`/collection/${address}`})
  // history.push(`/collection/${address}`)
}
    collection = async (e) => {
      let options = {
          fromBlock: 0,              
          toBlock: 'latest'
      };
      console.log('collection', this.props.state)
      if(this.props.state.contractMaster){
        const nftCollDeployedNetwork = NFTCollectionsContract.networks[this.props.state.networkId];
          const collectionCreated = await this.props.state.contractFactory.getPastEvents('NFTCollectionCreated', options);
          
          if(collectionCreated.length > 0){
            for(const cc of collectionCreated){  
              const nftCollectionInstance = new this.props.state.web3.eth.Contract(
                NFTCollectionsContract.abi, cc.returnValues._collectionAddress,
                ); 
                // console.log('one cc', cc)
                const nftTransfer = await nftCollectionInstance.getPastEvents('Transfer', options);
                let firstUri;
                console.log('nftTransfer', nftTransfer.length )
                if(nftTransfer.length > 0){
                  let owner= '';
                  let first= -1;
                  for(const nt of nftTransfer){
                    console.log('i',nt)
                    owner = await nftCollectionInstance.methods.ownerOf(nt.returnValues.tokenId).call();
                      if(owner.toLowerCase() === this.props.state.accounts[0].toLowerCase()){
                        const isAlreadySet = this.state.arrayCollection.find(el => el.name === cc.returnValues._collectionName);
                        if(!isAlreadySet){
                          console.log('set uri')
                          firstUri = await nftCollectionInstance.methods.tokenURI(nftTransfer[0].returnValues.tokenId).call();
                          console.log(nftCollectionInstance)
                          this.setState({
                            arrayCollection: this.state.arrayCollection.concat([{
                              name: cc.returnValues._collectionName, 
                              address: cc.returnValues._collectionAddress,
                              url: (firstUri) ? `https://gateway.pinata.cloud/ipfs/${firstUri}` : ''
                            }])
                        })
                        }
                    }
                  }
                }    
            }

          }
      }
      this.setState({onLoad: false});
  }
    render()  {
      return (
        <div>
          {(this.state.onLoad)
            ? <Container>
                <Spinner animation="border" variant="info" />
              </Container>
            :<Container className="container-card">
              {this.state.arrayCollection.map((collection, index) => (
                <div key={index} className="link-collection pointer-collection m-2" onClick={() => {this.props.selectCollection(collection.address)}}>
                  <Card bg={'light'} text={'dark'}>
                  <Card.Header>{collection.name}</Card.Header>
                    <Card.Body>
                      <Card.Img className='card-collection' variant="top" src={collection.url} />
                    </Card.Body>
                  </Card>
                  </div>
              ))}
            </Container>
          }
        </div>
      );
    }
  }
