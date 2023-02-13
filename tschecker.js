const Web3 = require('web3');

class TransactionChecker {
    web3;
    web3ws;
    account;
    subscription;

    constructor(projectId, account) {
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider('wss://goerli.infura.io/ws/v3/' + projectId));
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/' + projectId));
        this.account = account.toLowerCase();
    }

    subscribe(topic) {
        this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
            if (err) console.error(err);
        });
    }

    watchTransactions() {
        console.log('Watching all pending transactions...');
        this.subscription.on('data', (txHash) => {
            setTimeout(async () => {
                try {
                    let tx = await this.web3.eth.getTransaction(txHash);
                    
                    if (this.account == tx.to.toLowerCase()) {
                        console.log({ 
                            address: tx.from, 
                            value: this.web3.utils.fromWei(tx.value, 'ether'), 
                            gasPrice: tx.gasPrice,
                            gas: tx.gas,
                            input: tx.input,
                            timestamp: new Date() 
                        });
                    }
                    
                } catch (err) {
                }
            }, 5000)
        });
    }
}

let txChecker = new TransactionChecker(process.env.INFURA_ID, '0x35034C180EB127D7A0E3b43aDE79B0B0376cB56c');
txChecker.subscribe('pendingTransactions');
txChecker.watchTransactions();