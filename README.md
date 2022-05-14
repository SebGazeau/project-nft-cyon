# project-nft-cyon - Project 5 Alyra
Authors: Sébastien Gazeau, Sébastien Dupertuis and Alexis Mendoza

## Introduction
This project consists in the creation of a decentralized application that represents a NFT marketplace. 
This plateform allows the users to:
    * create NFT collections
    * Create and mint NFTs in the collections
    * visualize the available collections
    * visualize any NFT from any collection (with all details related to a NFT)
    * sell a NFT in auction or in direct sale
    * buy a NFT in auction or in direct sale
    * swap ETH into the plateform token (CYON)

## Install project and start
Avec ganache de lancé dans une autre console. 

Pour le premier lancement (git clone): 

la commande `npm run i-local` installera les dependances pour la parti contract
et leurs tests unitaire. 
Ensuite il deployera depuis la racine du projet les contracts avec truffle. 
Et terminera par installer les dependances necessaire au client.

Pour les lancements d'après :
Il suffit juste après le lance de ganche de deployer les contracts depuis
la racine du projet avec `truffle migrate`

Et dans tous les cas accéder au répertoire client avec `cd client`, et exécuter la
commande `npm run start` pour lancer la dApp

## Accessibility
https://main.d32uedov80na8d.amplifyapp.com/

## Smart Contracts
5 files:
    * Master.sol
    * Auction.sol
    * CYONToken.sol
    * NFTCollectionFactory.sol
    * NFTCollections.sol

### Master.sol
Description:
This is the main contract that contains most of the functions called by the Dapp. 

Dependencies:
    * Auction.sol
    * NFTCollectionFactory.sol
    * @openzeppelin/contracts/token/ERC20/IERC20.sol

## Unit Tests
- xx tests valides
- xx tests non valides
- 7 functions out of 10 have been tested.

1 file: voting.js

### 1. Status management test
### 1.1 startProposalsRegistering function test