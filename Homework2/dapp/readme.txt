Pentru initializarea unui nou proiect Truffle cu WebPack se va rula "truffle unbox webpack" intr-un director nou.
La initializare va fi creata si o structura default ce va include si un exemplu minimal de DApp (Metacoin), care se va modifica/sterge pentru a rula exemplul curent.
Pachetul curent contine doar principalele fisiere unde s-au facut modificari pe langa structura default dupa cum este descris mai jos.

- in truffle-config.js se seteaza datele pentru reteaua pe care se va face testarea (sectiunea networks) si compilatorul (sectiunea compilers)
- in directorul contracts se vor pastra doar contractele aplicatiei (Auction.sol) si contractul pentru migrari (Migrations.sol), acesta din urma necesitand actualizare pentru versiunea de Solidity utilizata
- in directorul migrations se plaseaza un script de migrare pentru operatia de deployment ce include parametrii contractelor instantiate (se va inlocui sau modifica scriptul generat default la initializare - a fost inlocuit cu 2_migrate_auction.js)
- in fisierul App/webpack.config.js se va modifica scriptul principal .js al aplicatiei daca este cazul (default: index.js - a fost inlocuit cu auction.js)
- in directorul App/src se vor plasa sursele aplicatiei web (.html, .js)

Pasii pentru compilare si rulare:
- truffle compile 
- truffle migrate --network [reteaua de deployment dupa cum e definita in truffle-config.js]
- npm run dev (in directorul App)
