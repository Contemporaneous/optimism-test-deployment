// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract PayItForward{

    address private _owner;

    constructor() payable  {
        _owner = msg.sender;

        console.log('Ready to Rumble');
    }

    function payItForward() public payable {
        require(msg.value > 1*10**16);
        withdraw();

    }

    function withdraw() private {
        uint amount = address(this).balance;
        
        (bool withdrawSuccess, ) = msg.sender.call{value: amount}("");
        require(withdrawSuccess, "Failed to deposit");
    }
}