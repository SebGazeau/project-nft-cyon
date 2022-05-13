# project-nft-cyon
## install project and start
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

## accessibility
https://main.d32uedov80na8d.amplifyapp.com/