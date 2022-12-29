// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Auction {
    
    address payable internal auction_owner;
    uint256 public auction_start;
    uint256 public auction_end;
    uint256 public highestBid;
    address public highestBidder;
 

    enum auction_state{
        CANCELLED,STARTED
    }

    struct  car{
        string  Brand;
        string  Rnumber;
    }
    
    car public Mycar;
    address[] bidders;

    mapping(address => uint) public bids;
    mapping(address => uint) public bidder_index;

    auction_state public STATE;


    modifier an_ongoing_auction() {
        require(block.timestamp <= auction_end && STATE == auction_state.STARTED);
        _;
    }
    
    modifier only_owner() {
        require(msg.sender==auction_owner);
        _;
    }

    modifier not_winner() {
        require(msg.sender != highestBidder, "You won! No money back");
        _;
    }

    modifier auction_ended() {
        require(block.timestamp > auction_end || STATE == auction_state.CANCELLED,"You can't withdraw, the auction is still open");
        _;
    }
    
    function bid() public virtual payable returns (bool) {}
    function withdraw() public virtual returns (bool) {}
    function cancel_auction() external virtual returns (bool) {}
    
    event BidEvent(address indexed highestBidder, uint256 highestBid);
    event WithdrawalEvent(address withdrawer, uint256 amount);
    event CanceledEvent(string message, uint256 time);  
    
}

contract MyAuction is Auction {
    
    constructor (uint _biddingTime, address payable _owner, string memory _brand, string memory _Rnumber) {
        auction_owner = _owner;
        auction_start = block.timestamp;
        auction_end = auction_start + _biddingTime*1 hours;
        STATE = auction_state.STARTED;
        Mycar.Brand = _brand;
        Mycar.Rnumber = _Rnumber;
    } 
    
    function get_owner() public view returns(address) {
        return auction_owner;
    }
    
    fallback () external payable {
        
    }
    
    receive () external payable {
        
    }
    
    function bid() public payable an_ongoing_auction override returns (bool) {
        require(msg.value > 0, "Please send money");
        require(bids[msg.sender] == 0, "You already bade");
        require(msg.value > highestBid,"You can't bid, Make a higher Bid");
        highestBidder = msg.sender;
        highestBid = msg.value;
        bidders.push(msg.sender);
        bids[msg.sender] = highestBid;
        bidder_index[msg.sender] = bidders.length - 1;
        emit BidEvent(highestBidder,  highestBid);

        return true;
    } 
    
    function cancel_auction() external only_owner an_ongoing_auction override returns (bool) {
    
        STATE = auction_state.CANCELLED;
        emit CanceledEvent("Auction Cancelled", block.timestamp);
        return true;
    }
    
    function withdraw() public auction_ended not_winner override returns (bool) {
        uint amount;
        amount = bids[msg.sender];
        require(amount > 0, "You have not participated in this auction..");

        bids[msg.sender] = 0;
        remove_bidder(bidder_index[msg.sender]);
        payable(msg.sender).transfer(amount);
        emit WithdrawalEvent(msg.sender, amount);
        return true;
    }

    function take_winner_money() external only_owner auction_ended {
        uint amount = bids[highestBidder];
        bids[highestBidder] = 0;
        payable(msg.sender).transfer(amount);
    }

    function remove_bidder(uint index) private {
        require (index < bidders.length, "Index out of range");

        bidder_index[bidders[index]] = bidders.length - 1;
        bidders[index] = bidders[bidders.length - 1];
        bidder_index[bidders[index]] = index;
        
        bidders.pop();
    }
    
    function destruct_auction() external only_owner returns (bool) {
        
        require(block.timestamp > auction_end || STATE == auction_state.CANCELLED,"You can't destruct the contract,The auction is still open");
        bids[highestBidder] = 0;
        uint amount;
        for(uint i = 0; i < bidders.length; i++)
        {
            if (bids[bidders[i]] != 0) {
                amount = bids[bidders[i]];
                bids[bidders[i]] = 0;
                payable(bidders[i]).transfer(amount);
            }
        }

        selfdestruct(auction_owner);
        return true;
    
    } 
}



