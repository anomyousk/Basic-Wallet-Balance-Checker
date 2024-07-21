const { HttpAgent, Actor } = require('@dfinity/agent');
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
