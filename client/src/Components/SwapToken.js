import React from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import BN from 'bn.js'
import "../App.css";

export default class SwapToken extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            setShow: false,
            validated: false
        }
    }
    // const [validated, setValidated] = useState(false);

    handleSubmit = async (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      event.stopPropagation();
      if (form.checkValidity() === false) {
        console.log('checkValidity')
      }else{
        let res;
        if(form.firstChild.name === 'cyon-to-eth'){
          res = await this.props.instance.methods.swapETHtoCYON().send({from: this.props.address,value: new BN((form.firstChild.value*10**18).toString())});
        }else{
          await this.props.instance.methods.approve(this.props.instance._address,new BN((form.firstChild.value*10**18).toString())).send({from: this.props.address});
          res = await this.props.instance.methods.swapCYONtoETH(new BN((form.firstChild.value*10**18).toString())).send({from: this.props.address});
        }
        if(res.events.Transfer.returnValues){
          this.handleClose();
        }
      }
  
      this.setState({validated: true});
    };
    handleClose = () => this.setState({ show: false});
    handleShow = () => this.setState({ show: true});
    
    render()  {
      return (
        <div>
           <Button variant="primary" onClick={this.handleShow}>
                Swap
            </Button>

            <Offcanvas show={this.state.show} onHide={this.handleClose} placement="end">
                <Offcanvas.Header closeButton>
                <Offcanvas.Title>Swap</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>{this.props.address}
                    <Tabs defaultActiveKey="cyon"
                        transition={false}
                        id="tab-swap-token"
                        className="mb-3">
                        <Tab eventKey="cyon" title="ETH &rArr; CYON">
                            <div>
                                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                                    <Form.Control required size="sm" type="number" name="cyon-to-eth" step="0.00000001" placeholder="0.00000001" />
                                    <Button type="submit">Submit form</Button>
                                </Form>
                            </div>
                        </Tab>
                        <Tab eventKey="eth" title="CYON &rArr; ETH">
                            <div>
                                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                                    <Form.Control required size="sm" type="number" name="eth-to-cyon" step="0.00000001" placeholder="0.00000001" />
                                    <Button type="submit">Submit form</Button>
                                </Form>
                            </div>
                        </Tab>
                    </Tabs>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
      );
    }
  }