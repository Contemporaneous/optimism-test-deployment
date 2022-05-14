// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "hardhat/console.sol";

/**
  * @title  Pay It Forward
  * @author Rhain McClelland
  * @notice This is a basic contrct that simply allows the user to make a deposit and receive the balnce of the contract.
*/

contract PayItForward{

    address private _owner;

    /**
     * @notice Deploy Pay It Forward smart contract.
     * @notice Must have a payable amount so the first user can receive some funds.
     */
    constructor() payable  {
        _owner = msg.sender;

        console.log('Ready to Rumble');
    }

    /**
     * @notice Main function that allows the user to deposit funds.
     * @notice User must deposit at least 0.0001 ether.
     */
    function payItForward() public payable {
        require(msg.value > 1*10**14, 'Not enough Funds sent');
        withdraw();
    }

    /**
     * @notice Withdraws the funds to the sender.
     */
    function withdraw() private {
        uint amount = address(this).balance - msg.value;
        (bool withdrawSuccess, ) = msg.sender.call{value: amount}("");
        require(withdrawSuccess, "Failed to deposit");
    }
}