// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import "./NFTCollections.sol";

contract NFTCollectionFactory {
    event NFTCollectionCreated(
        string _NFTName,
        address _collectionAddress,
        uint256 _timestamp
    );

    function createNFTCollection(
        string memory _NFTName,
        string memory _NFTSymbole
    ) external returns (address collectionAddress) {
        // Import the bytecode of the contract to deploy
        bytes memory collectionBytecode = type(NFTCollections).creationCode;
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
        NFTCollections(collectionAddress).initialize(_NFTName, _NFTSymbole);

        emit NFTCollectionCreated(_NFTName, collectionAddress, block.timestamp);
    }
}
