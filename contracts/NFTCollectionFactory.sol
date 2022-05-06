// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import "./NFTs_Collections.sol";

contract NFTCollectionFactory {
    //Création d'une collection :
    //Nom de la collection et symbole (a minima) + création via assembly + event de la création
    //Création d'un NFT :
    //Nom du NFT et symbole (a minima) + création via assembly + event de la création

    event NFTCollectionCreated(
        string _NFTName,
        address _collectionAddress,
        uint256 _timestamp
    );

    function createNFTCollection(
        string memory _NFTName,
        string memory _NFTDescription,
        uint256 _price,
        bool _favorite
    ) external returns (address collectionAddress) {
        // Import the bytecode of the contract to deploy
        bytes memory collectionBytecode = type(NFTs_Collections).creationCode;
        // Make a random salt based on the artist name
        bytes32 salt = keccak256(abi.encodePacked(_NFTName));

        assembly {
            collectionAddress := create2(
                0,
                add(collectionBytecode, 0x20),
                mload(collectionBytecode),
                salt
            )
            if iszero(extcodesize(collectionAddress)) {
                // revert if something gone wrong (collectionAddress doesn't contain an address)
                revert(0, 0)
            }
        }
        // Initialize the collection contract with the artist settings
        NFTs_Collections(collectionAddress).init(
            msg.sender,
            _NFTName,
            _NFTDescription,
            _price,
            _favorite
        );

        emit NFTCollectionCreated(_NFTName, collectionAddress, block.timestamp);
    }
}
