// test/MyERC721Token.test.js
import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("MyERC721", function () {
  let myERC721;
  let deployer, user1, user2;

  beforeEach(async () => {
    [deployer, user1, user2] = await ethers.getSigners();
    console.log("deployer address : ", deployer.address);

    const MyERC721Factory = await ethers.getContractFactory("MyERC721");
    myERC721 = await MyERC721Factory.connect(deployer).deploy(deployer.address);
    await myERC721.deployed();
  });

  it("should deploy and perform token operations", async function () {
    // Mint 5 tokens for deployer
    for (let i = 0; i < 5; i++) {
      console.log("minting token : ", i);
      await myERC721
        .connect(deployer)
        .mint({ value: ethers.utils.parseEther("0.1") });
    }

    // Mint 3 tokens for user1
    for (let i = 0; i < 3; i++) {
      console.log("Minting token : ", i);
      await myERC721
        .connect(user1)
        .mint({ value: ethers.utils.parseEther("0.1") });
    }

    // Test the balance of each account
    expect((await myERC721.balanceOf(deployer.address)).toNumber()).to.equal(5);
    expect((await myERC721.balanceOf(user1.address)).toNumber()).to.equal(3);
    expect((await myERC721.balanceOf(user2.address)).toNumber()).to.equal(0);
    console.log("Test of the balance passed");
    // Transfer 1 token from User1 to User2
    await myERC721.connect(user1).transferFrom(user1.address, user2.address, 6);
    console.log("The token is transfered from user1 to user2");
    // Check ownership after transfer
    expect(await myERC721.ownerOf(6)).to.equal(user2.address);
    console.log("Check of the ownership after transfer");
    // Deployer approves User1 to spend Token ID 3
    await myERC721.connect(deployer).approve(user1.address, 3);
    console.log("Deployer approves user1 to spend token with ID=3");
    // Test approval
    expect(await myERC721.getApproved(3)).to.equal(user1.address);
    console.log("Test approval");
    // User1 transfers the approved token to themselves
    await myERC721
      .connect(user1)
      .transferFrom(deployer.address, user1.address, 3);
    console.log("User1 transfers the approved token to themselves");
    // Check ownership after transfer
    expect(await myERC721.ownerOf(3)).to.equal(user1.address);
    console.log("token 3 owned by user1")
    // Test final balances
    expect((await myERC721.balanceOf(deployer.address)).toNumber()).to.equal(4);
    expect((await myERC721.balanceOf(user1.address)).toNumber()).to.equal(3);
    expect((await myERC721.balanceOf(user2.address)).toNumber()).to.equal(1);
    console.log("Deployer balance : 4 tokens ")
    console.log("User1 balance : 3 tokens ")
    console.log("User2 balance : 1 tokens ")
  });
});