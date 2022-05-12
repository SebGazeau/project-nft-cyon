// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./NFTCollections.sol";

/// @title NFTCollectionFactory contract
/// @author Sebastien Gazeau, Sébastien Dupertuis et Alexis Mendoza
/// @notice This contract allows to initialize collections of NFTs
/// @dev The contract code contains comments for developers only visible in the source code
contract NFTCollectionFactory {

    //------------------------------------------------------------------------------------
    // ------------------------------------Events-----------------------------------------
    //------------------------------------------------------------------------------------
    /// @notice event for collection creation
    /// @param _collectionName Name of the NFT collection
    /// @param _collectionAddress Address of the collection
    /// @param _timestamp Timestamp of the creation
    event NFTCollectionCreated(
        string _collectionName, address _collectionAddress, uint256 _timestamp, address _creator
    );

    //------------------------------------------------------------------------------------
    // -----------------------------------Functions---------------------------------------
    //------------------------------------------------------------------------------------
    /// @notice creation of a NFT Collection
    /// @param _collectionName NFT name
    /// @param _collectionSymbol Symbol of the NFT collection
    /// @return collectionAddress Address of the collection
    function createNFTCollection(
        string memory _collectionName,
        string memory _collectionSymbol
    ) external payable returns (address collectionAddress) {
        bytes32 _salt = keccak256(abi.encodePacked(_collectionName));
        collectionAddress = address(new NFTCollections{salt: _salt}(_collectionName, _collectionSymbol));
        emit NFTCollectionCreated(_collectionName, collectionAddress, block.timestamp, msg.sender);
    }
}
