const EventContract = artifacts.require("EventContract");

module.exports = function (deployer) {
  deployer.deploy(EventContract);
};

// module.exports = async function (deployer, _network, accounts) {
//   await deployer.deploy(EventContract);
//   const event = await EventContract.deployed();
//   const eventStart = Math.floor((new Date().getTime() + 86400 * 1000) / 1000);
//   await event.createEvent("My event", eventStart, 100, 1000);
// };
