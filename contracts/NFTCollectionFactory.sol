// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./NFTCollections.sol";

/// @title NFTCollectionFactory contract
/// @author Sebastien Gazeau, Sébastien Dupertuis et Alexis Mendoza
/// @notice This contract allows to initialize collections of NFTs
/// @dev The contract code contains comments for developers only visible in the source code
contract NFTCollectionFactory {
    /// @notice event for voter registration
    /// @param _NFTName NFT name
    /// @param _collectionAddress Address of the collection
    /// @param _timestamp Timestamp of the creation
    event NFTCollectionCreated(
        string _NFTName,
        address _collectionAddress,
        uint256 _timestamp
    );

    /// @notice creation of a NFT Collection
    /// @param _NFTName NFT name
    /// @param _NFTSymbole Symbol of the NFT
    /// @return collectionAddress Address of the collection
    function createNFTCollection(
        string memory _NFTName,
        string memory _NFTSymbole
    ) external returns (address collectionAddress) {
        // Import the bytecode of the contract to deploy
        bytes memory collectionBytecode = type(NFTCollections).creationCode;
        // Make a random salt based on the NFT name
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
        // Initialize the collection contract with the NFTCollections settings
        NFTCollections(collectionAddress).initialize(_NFTName, _NFTSymbole);

        // Event avec un timestamp
        emit NFTCollectionCreated(_NFTName, collectionAddress, block.timestamp);
    }
}
