// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SampleToken.sol";

contract Auction {
    SampleToken public tokenContract;
    address payable internal auction_owner;
    uint256 public auction_start;
    uint256 public auction_end;
    uint256 public highestBid;
    address public highestBidder;

    enum auction_state {
        CANCELLED,
        STARTED
    }

    struct car {
        string Brand;
        string Rnumber;
    }

    car public Mycar;
    address[] bidders;

    mapping(address => uint256) public bids;
    mapping(address => uint256) public bidder_index;

    auction_state public STATE;

    modifier an_ongoing_auction() {
        require(
            block.timestamp <= auction_end && STATE == auction_state.STARTED,
            "Action is ongoing"
        );
        _;
    }

    modifier only_owner() {
        require(msg.sender == auction_owner, "Not owner 3");
        _;
    }

    modifier not_winner() {
        require(msg.sender != highestBidder, "You won! No money back");
        _;
    }

    modifier auction_ended() {
        require(
            block.timestamp > auction_end || STATE == auction_state.CANCELLED,
            "You can't withdraw, the auction is still open"
        );
        _;
    }

    function bid(uint256) public virtual returns (bool) {}

    function withdraw() public virtual returns (bool) {}

    function cancel_auction() external virtual returns (bool) {}

    event BidEvent(address indexed highestBidder, uint256 highestBid);
    event WithdrawalEvent(address withdrawer, uint256 amount);
    event CanceledEvent(string message, uint256 time);
}

contract MyAuction is Auction {
    constructor(
        SampleToken _tokenContract,
        uint256 _biddingTime,
        address payable _owner,
        string memory _brand,
        string memory _Rnumber
    ) {
        tokenContract = _tokenContract;
        auction_owner = _owner;
        auction_start = block.timestamp;
        auction_end = auction_start + _biddingTime * 1 hours;
        STATE = auction_state.STARTED;
        Mycar.Brand = _brand;
        Mycar.Rnumber = _Rnumber;
    }

    function get_owner() public view returns (address) {
        return auction_owner;
    }

    fallback() external payable {}

    receive() external payable {}

    function bid(uint256 value)
        public
        override
        an_ongoing_auction
        returns (bool)
    {
        require(
            tokenContract.allowance(msg.sender, address(this)) >= value,
            "Bidden tokens were not allowed"
        );
        require(value > 0, "Please send tokens");
        require(bids[msg.sender] == 0, "You already bade");
        require(value > highestBid, "You can't bid, Make a higher Bid");

        highestBidder = msg.sender;
        highestBid = value;
        bidders.push(msg.sender);
        bids[msg.sender] = highestBid;
        bidder_index[msg.sender] = bidders.length - 1;

        require(
            tokenContract.transferFrom(msg.sender, address(this), value),
            "Transfer tokens from bid failed"
        );
        emit BidEvent(highestBidder, highestBid);

        return true;
    }

    function cancel_auction()
        external
        override
        only_owner
        an_ongoing_auction
        returns (bool)
    {
        STATE = auction_state.CANCELLED;
        emit CanceledEvent("Auction Cancelled", block.timestamp);
        return true;
    }

    function withdraw()
        public
        override
        auction_ended
        not_winner
        returns (bool)
    {
        uint256 amount;
        amount = bids[msg.sender];
        require(amount > 0, "Don't withdraw 0");

        bids[msg.sender] = 0;
        remove_bidder(bidder_index[msg.sender]);

        require(
            tokenContract.transfer(msg.sender, amount),
            "Transfer of withdrawed tokens failed"
        );
        emit WithdrawalEvent(msg.sender, amount);
        return true;
    }

    function take_winner_money() external only_owner auction_ended {
        uint256 amount = bids[highestBidder];
        bids[highestBidder] = 0;
        require(
            tokenContract.transfer(msg.sender, amount),
            "Taking winner tokens failed"
        );
    }

    function remove_bidder(uint256 index) private {
        require(index < bidders.length, "Index out of range");

        bidder_index[bidders[index]] = bidders.length - 1;
        bidders[index] = bidders[bidders.length - 1];
        bidder_index[bidders[index]] = index;

        bidders.pop();
    }

    function destruct_auction()
        external
        only_owner
        auction_ended
        returns (bool)
    {
        bids[highestBidder] = 0;
        uint256 amount;
        for (uint256 i = 0; i < bidders.length; i++) {
            if (bids[bidders[i]] != 0) {
                amount = bids[bidders[i]];
                bids[bidders[i]] = 0;
                require(tokenContract.transfer(bidders[i], amount));
            }
        }

        selfdestruct(auction_owner);
        return true;
    }
}
