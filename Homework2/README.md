# How to deploy?

1. **SampleToken** from *SampleToken.sol*
    * You have to specify the initial supply (E.g. 1000). 

2. **SampleTokenSale** from *SampleTokenSale.sol*
    * You have to specify:
        * the address of **SampleToken** previously deployed.
        * the token price (E.g. 10).
    * The owner of **SampleToken** has to approve **SampleTokenSale** the tokens that it can sell:
        * E.g. `SampleToken.approve(addressOf(SampleTokenSale), 500)`

3. **MyAuction** from *MyAuction.sol*
    * You have to specify:
        * the address of **SampleToken** previously deployed.
        * the bidding time (E.g. 1).
        * the owner's address.
        * the brand (E.g. Dacia).
        * the number (E.g. 1234).

# Contract methods:

## SampleToken:

1. `balanceOf(address _owner)` => returns the balance of `_owner`
    * May be used for debug.
2. `transfer(address _to, uint256 _value)` => transfers `_value` tokens from `msg.sender` to `_to` 
    * Will not be used.
3. `approve(address _spender, uint256 _value)` => `msg.sender` approves `_spender` to spend `_value` tokens from `msg.sender`'s balance
    * Will be used.

4. `allowance(address _owner, address _spender)` => returns how many tokens was `_spender` allowed to use from `_owner`'s balance
    * May be used for debug.

5. `transferFrom(address _from, address _to, uint256 _value)` => transfers from `_from` `_value` tokens to `_to`
    * Will not be used.
    * Needs `_value` tokens to be  `approve`d before.

## SampleTokenSale:

1. `buyTokens(uint256 _numberOfTokens)` => `msg.sender` buys `_numberOfTokens` tokens
    * `msg.sender` also needs to send `wei >=  _numberOfTokens * tokenPrice`.

## MyAuction:

1. `bid(uint256 value)` => `msg.sender` bids `value` tokens. 
    * before calling this function, `msg.sender` has to call `SampleToken.approve(addressOf(MyAuction), value)`.

2. `cancel_auction()` => the auction is stopped.

3. `withdraw()` => those who are not winners can withdraw their tokens after the auction is finished.

4. `take_winner_money()` => owner can take winner's money.

5. `destruct_auction()` => auction is destoyed.


# Workflow:

1. The web application has to have a button, **buyTokens**.
    * The button has two textfields: tokens, money. 
    * When pushing the button, the user buys some tokens by sending the required money. 
    * The js code calls `SampleTokenSale.buyTokens(tokens)` and sends some money to buy the tokens.

2. Before making a bid, the client needs to approve the `tokens` that it sends:
    * `SampleToken.approve(addressOf(MyAuction), tokens)`
    * This can be done either with a new button, an approve button. 
    * Or you can do this when pushing the `bid` button.


