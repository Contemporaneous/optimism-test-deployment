const { expect } = require("chai");
const { ethers } = require("hardhat");

let pif;
let accounts;
const  deployValue = 0.001;

beforeEach(async () => {
    accounts = await ethers.getSigners();
    const PIF = await ethers.getContractFactory("PayItForward");
    pif = await PIF.connect(accounts[0]).deploy({value: hre.ethers.utils.parseEther('{0}'.replace('{0}', deployValue))});
    await pif.deployed();
});

describe("Deployment", function () {
  it("Should Deploy with the correct Value", async function () {

    expect(await hre.ethers.provider.getBalance(pif.address)).to.equal(deployValue*10**18);
  });

  it("Should store Correct Doner Address", async function () {
    expect(await pif.lastDoner()).to.equal(accounts[0].address);
  });
});

describe("Interaction", function () {
    it("Should reward new Doner Correctly", async function () {
        const startBalance = await hre.ethers.provider.getBalance(accounts[1].address);
        const transferVal = 0.004;
        const txn = await pif.connect(accounts[1]).payItForward({value: hre.ethers.utils.parseEther('{0}'.replace('{0}', transferVal))});
        await txn.wait();

        
        const deltaBal = (deployValue-transferVal)*10**18;
        const deltaActual = await hre.ethers.provider.getBalance(accounts[1].address) - startBalance;
        
        expect(deltaBal).to.approximately(deltaActual, 1*10**14); //Assumes 1E14 is gas impact

        expect(await hre.ethers.provider.getBalance(pif.address)).to.equal(transferVal*10**18);

    });
});