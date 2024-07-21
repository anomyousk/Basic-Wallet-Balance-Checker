# Basic-Wallet-Balance-Checker
<h1><b>INTRODUCTION</b></h1>
A simple tool to check the balance of an Internet Computer Protocol (ICP) wallet involves interacting with the Internet Computer blockchain to query wallet data.
Using Internet Identity, which is a secure and easy-to-use authentication method 
Once the user is authenticated, User can use their identity to query the ICP ledger and retrieve their wallet balance.
<h1>Set up a new Node.js project: </h1>
 <code>mkdir icp-wallet-checker
cd icp-wallet-checker
npm init -y</code>
<h1>Install required packages</h1>
<code>npm install @dfinity/agent @dfinity/principal</code>
<h1>Save the Script</h1>
Create a file named index.js.
<code>const { HttpAgent, Actor } = require('@dfinity/agent');
const { Principal } = require('@dfinity/principal');
const fetch = require('node-fetch');

global.fetch = fetch;

// The canister ID of the ledger canister
const ledgerCanisterId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';

// Ledger Canister Interface (IDL)
const ledgerIDL = ({ IDL }) => {
    return IDL.Service({
        account_balance_dfx: IDL.Func([IDL.Record({ account: IDL.Text })], [IDL.Record({ e8s: IDL.Nat64 })], ['query']),
    });
};

// Function to get ICP balance
async function getIcpBalance(principal) {
    const agent = new HttpAgent({ host: 'https://ic0.app' });

    const ledgerActor = Actor.createActor(ledgerIDL, {
        agent,
        canisterId: ledgerCanisterId,
    });

    try {
        const account = principal.toText();
        const balance = await ledgerActor.account_balance_dfx({ account });
        const icpBalance = balance.e8s / 1e8;
        return icpBalance;
    } catch (error) {
        console.error('Error fetching balance:', error);
        return null;
    }
}

// Main function to get balance
async function main() {
    const principalString = process.argv[2];  // Get the principal from command line argument
    if (!principalString) {
        console.error('Please provide a principal.');
        return;
    }

    const principal = Principal.fromText(principalString);
    const balance = await getIcpBalance(principal);
    if (balance !== null) {
        console.log(`The balance of the wallet is: ${balance} ICP`);
    } else {
        console.log('Could not fetch the balance.');
    }
}

main();
</code>
<h1>Run the script:</h1>
Execute the script from the command line, providing the wallet principal as an argument.
<code>node index.js <principal>
</code>
<h1>Screenshot</h1>
 <a href="https://imgbb.com/"><img src="https://i.ibb.co/RQnwjzR/media.jpg" alt="media" border="0"></a>
 <h1>Keep IN Mind</h1>
HttpAgent: Used to create an agent that interacts with the Internet Computer network.
<br>Actor: Represents the canister (smart contract) you interact with.</br>
<br>Principal: Represents the identifier for accounts on the Internet Computer.</br>
<br>account_balance_dfx: A function exposed by the ICP ledger canister to get the balance of a specific account.</br>
<h1>Credits</h1>
<h2>Kushagra Kale</h2>
