// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract NFTs_Collections is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Collections {
        string name;
        string description;
        uint256 price;
        bool favorite;
    }
    Collections[] collections;

    constructor() ERC721("Collections", "CL") {}

    function MintCollections(
        address _user,
        string memory _tokenURI,
        string memory _name,
        string memory _description,
        uint256 _price,
        bool _favorite
    ) public returns (uint256) {
        _tokenIds.increment();
        collections.push(Collections(_name, _description, _price, _favorite));
        uint256 newItemId = _tokenIds.current();
        _mint(_user, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        return newItemId;
    }

    function init(
        address _address,
        string memory _name,
        string memory _description,
        uint256 _price,
        bool _favorite
    ) public {
        //MintCollections
    }

    function buy() public {}

    function sell() public {}
}
