// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract SampleToken {
    string public name = "Sample Token";
    string public symbol = "TOK";

    uint256 private _totalSupply;
    uint256 private _totalSales;

    address owner;
    address sampleTokenSaleAddress;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowance;

    modifier hasEnoughMoney(address _from, uint256 _value) {
        require(_balances[_from] >= _value, "Not enough money 1");
        _;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Not owner 1");
        _;
    }

    constructor(uint256 _initialSupply) {
        _balances[msg.sender] = _initialSupply;
        _totalSupply = _initialSupply;
        totalSales = 0;
        owner = msg.sender;
        sampleTokenSaleAddress = msg.sender;

        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return _balances[_owner];
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        hasEnoughMoney(msg.sender, _value)
        returns (bool success)
    {
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;

        mint(_value);
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        hasEnoughMoney(msg.sender, _value)
        returns (bool success)
    {
        _allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256)
    {
        return _allowance[_owner][_spender];
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public hasEnoughMoney(_from, _value) returns (bool success) {
        require(_value <= _allowance[_from][msg.sender], "Not enough approved 1");

        _balances[_from] -= _value;
        _balances[_to] += _value;
        _allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    function setTokenSaleAddress(address _tokenSaleAddress) external isOwner {
        sampleTokenSaleAddress = _tokenSaleAddress;
    }

    function mint(uint256 _value) private {
        _totalSales += _value;

        while (_totalSales > 10000) {
            _totalSales -= 10000;
            _totalSupply += 1;
            _balances[owner] += 1;
            _allowance[owner][sampleTokenSaleAddress] += 1;

            emit Transfer(address(0), owner, 1);
        }
    }
}
