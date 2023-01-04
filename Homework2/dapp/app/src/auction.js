let sampleTokenAddress = "0x69DACc4451fc5db36b9763DAA6c37a0864F6B468";
let myAuctionAddress = "0xb5C9F0C8EC4933605C99D3829a233F29C724Df27";
let sampleTokenSaleAddress = "0x454b87E389BF5949dB371889Ec1d6bbBBa3AEb06";

const ethEnabled = () => {
    // EIP-1193: Ethereum Provider JavaScript API  - https://eips.ethereum.org/EIPS/eip-1193
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        return true;
    }
    return false;
}

if (!ethEnabled()) {
    alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!");
}

window.onload = async function init() {
    // RPC methods https://eips.ethereum.org/EIPS/eip-1474
    // https://docs.metamask.io/guide/getting-started.html#connecting-to-metamask
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    window.bidder = accounts[0];
    console.log(accounts);

    window.confetti = new JSConfetti();
    $("#withdraw_button_container").hide();

    //web3.eth.defaultAccount = bidder;
    let sampleTokenContractABI = [{ "inputs": [{ "internalType": "uint256", "name": "_initialSupply", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_spender", "type": "address" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }, { "internalType": "address", "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_tokenSaleAddress", "type": "address" }], "name": "setTokenSaleAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
    let myauctionContractABI = [{ "inputs": [{ "internalType": "contract SampleToken", "name": "_tokenContract", "type": "address" }, { "internalType": "uint256", "name": "_biddingTime", "type": "uint256" }, { "internalType": "address payable", "name": "_owner", "type": "address" }, { "internalType": "string", "name": "_brand", "type": "string" }, { "internalType": "string", "name": "_Rnumber", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "highestBidder", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "highestBid", "type": "uint256" }], "name": "BidEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "message", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "CanceledEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "withdrawer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "WithdrawalEvent", "type": "event" }, { "stateMutability": "payable", "type": "fallback", "payable": true }, { "inputs": [], "name": "Mycar", "outputs": [{ "internalType": "string", "name": "Brand", "type": "string" }, { "internalType": "string", "name": "Rnumber", "type": "string" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "STATE", "outputs": [{ "internalType": "enum Auction.auction_state", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "auction_end", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "auction_start", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "bidder_index", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "bids", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "highestBid", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "highestBidder", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "tokenContract", "outputs": [{ "internalType": "contract SampleToken", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true }, { "stateMutability": "payable", "type": "receive", "payable": true }, { "inputs": [], "name": "get_owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "bid", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "cancel_auction", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "take_winner_money", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "destruct_auction", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }];
    let sampleTokenSaleContractABI = [{ "inputs": [{ "internalType": "contract SampleToken", "name": "_tokenContract", "type": "address" }, { "internalType": "uint256", "name": "_tokenPrice", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_buyer", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "Sell", "type": "event" }, { "inputs": [], "name": "tokenContract", "outputs": [{ "internalType": "contract SampleToken", "name": "", "type": "address" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "tokenPrice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "tokensSold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [{ "internalType": "uint256", "name": "_tokenPrice", "type": "uint256" }], "name": "updateTokenPrice", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_numberOfTokens", "type": "uint256" }], "name": "buyTokens", "outputs": [], "stateMutability": "payable", "type": "function", "payable": true }, { "inputs": [], "name": "endSale", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

    window.sampleToken = new web3.eth.Contract(sampleTokenContractABI, sampleTokenAddress);
    window.auction = new web3.eth.Contract(myauctionContractABI, myAuctionAddress);
    window.sampleTokenSale = new web3.eth.Contract(sampleTokenSaleContractABI, sampleTokenSaleAddress);

    auction.getPastEvents('BidEvent', {
        fromBlock: 0,
        toBlock: 'latest'
    }, function (error, events) { console.log(events); })
        .then(function (bidEvents) {
            bidEvents.forEach((bidEvent) => {
                $("#eventslog").append(
                    `
                    <li class="list-group-item d-flex flex-row text-truncate">
                        <b class="px-1">${bidEvent.returnValues.highestBidder}</b> has bidden <b class="px-1">${bidEvent.returnValues.highestBid}</b>
                        <img style="width: 1.5em; height: 1.5em;"
                        src="https://img.icons8.com/external-soft-fill-juicy-fish/512/external-token-video-game-elements-soft-fill-soft-fill-juicy-fish.png" />
                    </li>
                    `
                );
            })
        });

    sampleTokenSale.getPastEvents('Sell', {
        fromBlock: 0,
        toBlock: 'latest'
    }, function (error, events) { console.log(events); })
        .then(function (sellEvents) {
            sellEvents.forEach((sellEvent) => {
                $("#bought_tokens_logs").append(
                    `
                    <li class="list-group-item d-flex flex-row text-truncate">
                        <b class="px-1">${sellEvent.returnValues._buyer}</b> bought <b class="px-1">${sellEvent.returnValues._amount}</b>
                        <img style="width: 1.5em; height: 1.5em;"
                        src="https://img.icons8.com/external-soft-fill-juicy-fish/512/external-token-video-game-elements-soft-fill-soft-fill-juicy-fish.png" />
                    </li>
                    `
                );
            });
        });

    let BidEvent = auction.events.BidEvent(
        {
            filter: {
                fromBlock: 0,
                toBlock: 'latest',
                address: myAuctionAddress,
                topics: [web3.utils.sha3('BidEvent(address,uint256)')]
            }
        },
        function (error) {
            if (error) {
                console.log(error);
            }
        }
    ).on('data', function (event) {
        console.log(event);
        $("#eventslog").append(
            `
            <li class="list-group-item d-flex flex-row text-truncate">
                <b class="px-1">${event.returnValues.highestBidder}</b> has bidden <b class="px-1">${event.returnValues.highestBid}</b>
                <img style="width: 1.5em; height: 1.5em;"
                src="https://img.icons8.com/external-soft-fill-juicy-fish/512/external-token-video-game-elements-soft-fill-soft-fill-juicy-fish.png" />
            </li>
            `
        );
    });

    let SellEvent = sampleTokenSale.events.Sell(
        {
            filter: {
                fromBlock: 0,
                toBlock: 'latest',
                address: sampleTokenSaleAddress,
                topics: [web3.utils.sha3('Sell(address,uint256)')]
            }
        },
        function (error) {
            if (error) {
                console.log(error);
            }
        }
    ).on('data', function (event) {
        console.log(event);
        $("#bought_tokens_logs").append(
            `
            <li class="list-group-item d-flex flex-row text-truncate">
                <b class="px-1">${event.returnValues._buyer}</b> bought <b class="px-1">${event.returnValues._amount}</b>
                <img style="width: 1.5em; height: 1.5em;"
                src="https://img.icons8.com/external-soft-fill-juicy-fish/512/external-token-video-game-elements-soft-fill-soft-fill-juicy-fish.png" />
            </li>
            `
        );
    });

    let CanceledEvent = auction.events.CanceledEvent(
        function (error, result) {
            if (!error) {
                console.log(result);
                $("#eventslog").html(result.returnValues.message + ' at ' + result.returnValues.time);
            } else {
                console.log(error);
            }
        }
    );

    refreshInterface();
}

function refreshInterface() {
    auction.methods.auction_end().call().then(function (endTimestamp) {
        const tsMs = endTimestamp * 1000; // convert to ms
        const endDate = new Date(tsMs);
        window.auctionEndDate = endDate;

        if (!window.countDown) {
            //Math.floor(Date.now() / 1000) + 10
            window.countDown = new FlipDown(Math.floor(endDate.getTime() / 1000), 'countdown')
            .start()
            .ifEnded(async () => {
                highestBidder = await auction.methods.highestBidder().call();

                if (highestBidder.toLowerCase() == bidder.toLowerCase()) {
                    confetti.addConfetti();
                } else {
                    $("#withdraw_button_container").show();
                }
            });
        } else if (Date.now() > endDate) {
            if (highestBidder.toLowerCase() == bidder.toLowerCase()) {
                $("#withdraw_button_container").hide();
            } else {
                $("#withdraw_button_container").show();
            }
        }

        document.getElementById("auction_end").innerHTML = 
        `
        <b>${endDate.toLocaleString()}</b>
        `;
    });

    auction.methods.highestBidder().call().then(function (result) {
        document.getElementById("HighestBidder").innerHTML = 
        `
        <b>${result}</b>
        `;
    });

    auction.methods.highestBid().call().then(function (result) {
        document.getElementById("HighestBid").innerHTML = 
        `
        <div class="d-flex flex-col">
            <b class="px-1">${result}</b>
            <img style="width: 1.5em; height: 1.5em;"
            src="https://img.icons8.com/external-soft-fill-juicy-fish/512/external-token-video-game-elements-soft-fill-soft-fill-juicy-fish.png" />
        </div>
        `;
    });

    auction.methods.STATE().call().then(function (result) {
        let state = 'Unknown';
        if (result == 0) {
            state = 'Canceled';
        } else if (result == 1 && !(new Date().getTime() > auctionEndDate.getTime())) {
            state = 'Started';
        } else if (new Date().getTime() > auctionEndDate.getTime()) {
            state = 'Ended';
        }

        document.getElementById("STATE").innerHTML = 
        `
        <b>${state}</b>
        `;
    });

    auction.methods.Mycar().call().then(function (result) {
        document.getElementById("car_brand").innerHTML = 
        `
        <b>${result[0]}</b>
        `;
        document.getElementById("registration_number").innerHTML = 
        `
        <b>${result[1]}</b>
        `;
    });

    auction.methods.bids(bidder).call().then(function (result) {
        document.getElementById("MyBid").innerHTML = 
        `
        <div class="d-flex flex-col">
            <b class="px-1">${result}</b>
            <img style="width: 1.5em; height: 1.5em;"
            src="https://img.icons8.com/external-soft-fill-juicy-fish/512/external-token-video-game-elements-soft-fill-soft-fill-juicy-fish.png" />
        </div>
        `;
    });

    sampleToken.methods.balanceOf(bidder).call().then(function (result) {
        document.getElementById("MyTokens").innerHTML = `${result}`;
        document.getElementById("MyTokensShop").innerHTML = `${result}`;
    });

    let auction_owner = null;
    auction.methods.get_owner().call().then(function (result) {
        auction_owner = result;
        console.log(result);
        if (bidder.toLowerCase() != auction_owner.toLowerCase()) {
            $("#auction_owner_operations").hide();
            $("#owner-operations-tab").hide();
        } else {
            $("#auction_owner_operations").show();
            $("#owner-operations-tab").show();
        }
    }
    );
}

function clearInfoMessages() {
    setTimeout(() => {
        document.getElementById("buy_tokens_status").innerHTML = "";
        document.getElementById("biding_status").innerHTML = "";
    }, 5000);
}

//alternative to ethereum.request({ method: 'eth_requestAccounts' });
ethereum.on('accountsChanged', function (accounts) {
    window.bidder = accounts[0];

    refreshInterface();
});

document.getElementById("bid_button").onclick = async function bid() {
    let tokens = document.getElementById('bidden_tokens').value;

    try {
        document.getElementById("biding_status").innerHTML = "Waiting for the bidding to be approved by SampleToken";
        await sampleToken.methods.approve(myAuctionAddress, tokens).send(
            {
                from: window.bidder,
                gas: 200000
            }
        );
        document.getElementById("biding_status").innerHTML = "Bidding approved!";
    } catch (e) {
        console.log(e);
        document.getElementById("biding_status").innerHTML = "An error occured while approving the bidding";
    }

    try {
        document.getElementById("biding_status").innerHTML = "Waiting for the bidding to be approved by MetaMask";
        const transactionId = await auction.methods.bid(tokens).send(
            {
                from: window.bidder,
                gas: 200000
            }
        );
        document.getElementById("biding_status").innerHTML = `Successfull bid, the transaction ID is ${transactionId}`;

        clearInfoMessages();
        refreshInterface();
    } catch (e) {
        console.log(e);
        document.getElementById("biding_status").innerHTML = `An error occured while bidding through metamask`;
        clearInfoMessages();
    }
}

document.getElementById("cancel_button").onclick = function cancel_auction() {
    auction.methods.cancel_auction().send(
        {
            from: window.bidder
        },
        function (error, result) {
            console.log(result);
        });
}

document.getElementById("destruct_button").onclick = function Destruct_auction() {
    auction.methods.destruct_auction().send(
        {
            from: window.bidder
        },
        function (error, result) {
            console.log(result);
        });
}

document.getElementById("buy_tokens_button").onclick = async function bid() {
    let tokens = document.getElementById('buy_tokens_tokens').value;
    let money = document.getElementById('buy_tokens_money').value;

    try {
        document.getElementById("buy_tokens_status").innerHTML = "Waiting for the transaction to be approved...";
        await sampleTokenSale.methods.buyTokens(tokens).send(
            {
                from: window.bidder,
                gas: 200000,
                value: money
            }
        );
        document.getElementById("buy_tokens_status").innerHTML = `Successfully bought ${tokens} tokens!`;

        clearInfoMessages();
        refreshInterface();
    } catch (e) {
        console.log(e);
        document.getElementById("buy_tokens_status").innerHTML = "An error occurred while buying tokens. Transaction was reverted.";

        clearInfoMessages();
    }
}

document.getElementById("withdraw_button").onclick = function Withdraw_auction() {
    auction.methods.withdraw().send(
        {
            from: window.bidder
        },
        function (error, result) {
            console.log(result);
        });
}