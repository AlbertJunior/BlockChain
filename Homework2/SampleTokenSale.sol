// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SampleToken.sol";

contract SampleTokenSale {
    
    SampleToken public tokenContract;
    uint256 public tokenPrice;
    address owner;

    uint256 public tokensSold;

    event Sell(address indexed _buyer, uint256 indexed _amount);

    constructor(SampleToken _tokenContract, uint256 _tokenPrice) {
        owner = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function updateTokenPrice(uint256 _tokenPrice) public {
        require(msg.sender == owner);
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value >= _numberOfTokens * tokenPrice, "More money please");
        uint256 remaining = msg.value - _numberOfTokens * tokenPrice;
        require(tokenContract.allowance(owner, address(this)) >= _numberOfTokens, "Less tokens in stock");
        require(tokenContract.balanceOf(owner) >= _numberOfTokens, "Owner is poor");
        tokensSold += _numberOfTokens;
        require(tokenContract.transferFrom(owner, msg.sender, _numberOfTokens));
        payable(msg.sender).transfer(remaining);
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == owner);
        require(tokenContract.transfer(owner, tokenContract.balanceOf(address(this))));
        require(tokenContract.transferFrom(owner, owner, tokenContract.allowance(owner, address(this))));
        payable(msg.sender).transfer(address(this).balance);
    }
}