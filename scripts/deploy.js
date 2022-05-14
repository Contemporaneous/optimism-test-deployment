
const ethers = require("ethers");

const main = async () => {
    //Get the contract and deploy it
    const pifFactory = await hre.ethers.getContractFactory('PayItForward');
    const pif = await pifFactory.deploy({value: hre.ethers.utils.parseEther('0.1')});
    await pif.deployed();

    console.log("Contract deployed to:", pif.address);
  
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