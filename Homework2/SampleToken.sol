// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract SampleToken {
    
    string public name = "Sample Token";
    string public symbol = "TOK";

    uint256 private _totalSupply;
    uint256 private totalSales;
    address owner;
    address sampleTokenSaleAddress;
    
    event Transfer(address indexed _from,
                   address indexed _to,
                   uint256 _value);

    event Approval(address indexed _owner,
                   address indexed _spender,
                   uint256 _value);

    mapping (address => uint256) private balances;
    mapping (address => mapping(address => uint256)) private _allowance;

    constructor (uint256 _initialSupply) {
        balances[msg.sender] = _initialSupply;
        _totalSupply = _initialSupply;
        totalSales = 0;
        owner = msg.sender;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);

        emit Transfer(msg.sender, _to, _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        mint(_value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        emit Approval(msg.sender, _spender, _value);
        _allowance[msg.sender][_spender] = _value;
        return true;
    }

    function allowance(address _owner,address spender) public view returns (uint256) {
        return _allowance[_owner][spender];
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balances[_from]);
        require(_value <= _allowance[_from][msg.sender]);

        emit Transfer(_from, _to, _value);
        balances[_from] -= _value;
        balances[_to] += _value;
        _allowance[_from][msg.sender] -= _value;
        return true;
    }

    function setTokenSaleAddress(address tokenSaleAddress) public {
        require(msg.sender == owner);
        sampleTokenSaleAddress = tokenSaleAddress;
    }

    function mint(uint256 value) private {
        totalSales += value;
        while (totalSales > 10000) {
            totalSales -= 10000;
            _totalSupply += 1;
            balances[owner] += 1;
            _allowance[owner][sampleTokenSaleAddress] += 1;
        }
    }

}
