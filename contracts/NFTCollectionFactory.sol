// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./NFTCollections.sol";

/// @title NFTCollectionFactory contract
/// @author Sebastien Gazeau, Sébastien Dupertuis et Alexis Mendoza
/// @notice This contract allows to initialize collections of NFTs
/// @dev The contract code contains comments for developers only visible in the source code
contract NFTCollectionFactory {
    /// @notice event for collection creation
    /// @param _collectionName NFT collection name
    /// @param _collectionAddress Address of the collection
    /// @param _timestamp Timestamp of the creation
    event NFTCollectionCreated(
        string _collectionName,
        address _collectionAddress,
        uint256 _timestamp,
        address _creator
    );

    /// @notice creation of a NFT Collection
    /// @param _collectionName NFT name
    /// @param _collectionSymbol Symbol of the NFT collection
    /// @return collectionAddress Address of the collection
    function createNFTCollection(
        string memory _collectionName,
        string memory _collectionSymbol
    ) external returns (address collectionAddress) {
        // Import the bytecode of the contract to deploy
        bytes memory collectionBytecode = type(NFTCollections).creationCode;
        // Make a random salt based on the NFT name
        bytes32 salt = keccak256(abi.encodePacked(_CollectionName));

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
        // Initialize the collection contract with the NFTCollections settings
        NFTCollections(collectionAddress).initialize(_collectionName, _collectionSymbol);

        // Event avec un timestamp
        emit NFTCollectionCreated(_collectionName, collectionAddress, block.timestamp, msg.sender);
    }
}
