
const ethers = require("ethers");

const main = async () => {
    //Get the contract and deploy it
    const [owner, randomPerson] = await hre.ethers.getSigners();
    let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    let randomBalance = await hre.ethers.provider.getBalance(randomPerson.address);
    

    console.log("Owner balance: " + ownerBalance);
    console.log("Other balance" + randomBalance);

    const pifFactory = await hre.ethers.getContractFactory('PayItForward');
    const pif = await pifFactory.deploy({value: hre.ethers.utils.parseEther('2000')});
    await pif.deployed();

    let contractBalance = await hre.ethers.provider.getBalance(pif.address);
    console.log('Contract balance: ' + contractBalance);

    console.log("Contract deployed to:", pif.address);
  
    let txn = await pif.connect(randomPerson).payItForward({value: hre.ethers.utils.parseEther('1000')});
    await txn.wait();

    ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    randomBalance = await hre.ethers.provider.getBalance(randomPerson.address);
    contractBalance = await hre.ethers.provider.getBalance(pif.address);

    console.log("Owner balance: " + ownerBalance);
    console.log("Other balance" + randomBalance);
    console.log('Contract balance: ' + contractBalance);

    txn = await pif.payItForward({value: hre.ethers.utils.parseEther('4000')});
    await txn.wait();

    ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    randomBalance = await hre.ethers.provider.getBalance(randomPerson.address);
    contractBalance = await hre.ethers.provider.getBalance(pif.address);

    console.log("Owner balance: " + ownerBalance);
    console.log("Other balance" + randomBalance);
    console.log('Contract balance: ' + contractBalance);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();