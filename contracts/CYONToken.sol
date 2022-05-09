// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract CYONToken is ERC20 {
    IERC20 public token1 = IERC20(address(0x64FF637fB478863B7468bc97D30a5bF3A428a1fD));
    IERC20 public token2 = IERC20(address(this));
    // function initialize(uint256 initialSupply) public virtual initializer {
    //     __ERC20_init("Choose Your Own NFT", "CYON");
    //     _mint(_msgSender(), initialSupply);        
    //     // token1 = IERC20Upgradeable(address(0x64FF637fB478863B7468bc97D30a5bF3A428a1fD));
    // }
    constructor(uint256 initialSupply) ERC20("Choose Your Own NFT", "CYON") {
        _mint(msg.sender, initialSupply);
    }
    event TestEmit (uint amount,address sender, bool sent);
    modifier valueNotZero(){
        require(msg.value > 0, 'the amount must be greater than 0');
        _;
    }
    function swapETHtoCYON() public payable valueNotZero {
        uint amountTransfert = msg.value * 100 / 1;
        require(amountTransfert < balanceOf(address(this)), 'Total supply CYON has been sell');
        bool sent = token2.transfer(msg.sender, amountTransfert);
        require(sent, "Failed to send CYON");
    }

    function swapCYONtoETH(uint _amountCYON) public payable {
        require(_amountCYON >= 100, 'the amount of CYON must be greater than or equal to 100');
        uint amountTransfert = _amountCYON * 1 / 100;
        require(amountTransfert < address(this).balance, 'Total supply ETH has been sell');
        require(token2.allowance(msg.sender, address(this)) >= _amountCYON, "Token 2 allowance too low");
        _safeTransferFrom(token2, msg.sender, address(this), _amountCYON);
        (bool sent, )= address(msg.sender).call{value: amountTransfert}("");
        require(sent, "Failed to send ETH");
    }

    function _safeTransferFrom(IERC20 token, address sender, address recipient, uint amount) private {
        bool sent = token.transferFrom(sender, recipient, amount);
        require(sent, "Token transfer failed");
    }
    function getBalanceETH() external view returns(uint balance){
		return address(this).balance;
	}
}