# who gave how much 

retrieve all the addresses which sent an erc20 token on an address

for example : you have an address and you want to see who you owe token to

Ex on rinkeby : 

your address : 0x0094f7De2cAD22792FBCa2a658E695442ed65363
ERC20 address : 0xfe47b7e3333039f1a6731d8ea9552d8a4e7544ff

this bot will recovery all erc20 transfers and catch address with formula : (total deposit - total sent back)

=========================

Steps to run the bot:
* Copy the env.sample to .env
* Add all needed informations in the .env file
* `yarn install`
* `yarn start`
