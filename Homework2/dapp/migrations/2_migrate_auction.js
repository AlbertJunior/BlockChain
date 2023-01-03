const MyAuction = artifacts.require("MyAuction");
const SampleToken = artifacts.require("SampleToken");
const SampleTokenSale = artifacts.require("SampleTokenSale");

module.exports = async (deployer) => {

    // deployer.deploy(SampleToken, 1000).then(function(receipt) {
    //     return receipt.address;
    //     //deployer.link(SampleToken, SampleTokenSale);
    //     //deployer.link(SampleToken, MyAuction);
    // }).then(function(address) {
    //     return deployer.deploy(SampleTokenSale, address, 1).then(function() {
    //         return deployer.deploy(MyAuction, address, 1, "0x50228D6B1c2c311bfAcf483FD4828207C6924121", "Dacia", "11111");
    //     });
    // });

    await deployer.deploy(SampleToken, 1000);
    const sampleToken = await SampleToken.deployed();
    await deployer.deploy(SampleTokenSale, sampleToken.address, 1);
    const sampleTokenSale = await SampleTokenSale.deployed();
    await deployer.deploy(MyAuction, sampleToken.address, 1, "0x50228D6B1c2c311bfAcf483FD4828207C6924121", "Dacia", "11111");
    const myAuction = await  MyAuction.deployed();

    const approveStep = await sampleToken.approve(sampleTokenSale.address, 1000);
};
