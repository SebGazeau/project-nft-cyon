// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
/**
 * @title CYONToken token ERC20
 * @author Sebastien Gazeau, Sébastien Dupertuis et Alexis Mendoza
 * @dev An erc20 token with an exchange system between eth and CYON and a fixed conversion rate of 1(eth)/100(cyon)
 */
contract CYONToken is ERC20 {
	IERC20 public token1 = IERC20(address(0x64FF637fB478863B7468bc97D30a5bF3A428a1fD));
	IERC20 public token2 = IERC20(address(this));

	/**
	 * @dev Issued when a user wants CYON tokens, 
	 * where `balanceETH` is the funds deposited by `userAddress`
	 */
	event ETHtoCYON(uint balanceETH, address userAddress);
	/**
	 * @dev Issued when a user wants ETH tokens, 
	 * where `balanceEthCYON` is the funds deposited by `userAddress`
	 */
	event CYONtoETH(uint balanceCYON, address userAddress);

	constructor(uint256 _initialSupply) ERC20("Choose Your Own NFT", "CYON") {
		_mint(msg.sender, _initialSupply);
	}
	/**
	 * @dev modifier to check if msg.value is not 0
	 */ 
	modifier valueNotZero(){
		require(msg.value > 0, 'the amount must be greater than 0');
		_;
	}

	/**
	 * @dev exchange of eth for cyon
	 */
	function swapETHtoCYON() external payable valueNotZero {
		require((msg.value * 100 / 1) < balanceOf(address(this)), 'Total supply CYON has been sell');
		bool sent = token2.transfer(msg.sender, (msg.value * 100 / 1));
		require(sent, "Failed to send CYON");

		emit ETHtoCYON(msg.value, msg.sender);
	}
	/**
	 * @dev exchange of eth for cyon
	 * @param _amountCYON amount of CYON to be exchanged
	 */
	function swapCYONtoETH(uint _amountCYON) external payable {
		require(_amountCYON >= 100, 'the amount of CYON must be greater than or equal to 100');
		require((_amountCYON * 1 / 100) < address(this).balance, 'Total supply ETH has been sell');
		require(token2.allowance(msg.sender, address(this)) >= _amountCYON, "Token 2 allowance too low");
		_safeTransferFrom(token2, msg.sender, address(this), _amountCYON);
		(bool sent, )= address(msg.sender).call{value: (_amountCYON * 1 / 100)}("");
		require(sent, "Failed to send ETH");

		emit CYONtoETH(_amountCYON, msg.sender);
	}

	/**
	 * @dev erc20 token transfer
	 * @param _token interface of the token to transfer
	 * @param _sender the sender of the transfer
	 * @param _recipient the recipient of the transfer
	 * @param _amount the amount of the transfer
	 */
	function _safeTransferFrom(IERC20 _token, address _sender, address _recipient, uint _amount) private {
		bool sent = _token.transferFrom(_sender, _recipient, _amount);
		require(sent, "Token transfer failed");
	}

	/**
	 * @dev to know the balance of the contract
	 */
	function getBalanceETH() external view returns(uint balance){
		return address(this).balance;
	}
}