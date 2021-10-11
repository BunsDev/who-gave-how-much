const dotenv = require("dotenv");
dotenv.config();

const { PROVIDER, CONTRACTADDRESS, ADDRESS, FROMBLOCK, DECIMALS } = process.env;

const Web3 = require("web3");
const artifacts = require("./artifacts.js");

async function main() {
  var web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));

  const contract = new web3.eth.Contract(artifacts.Erc20Abi, CONTRACTADDRESS);

  const fromBlock = FROMBLOCK;

  const transferEvents = await contract.getPastEvents("Transfer", {
    fromBlock,
    filter: {
      isError: 0,
      txreceipt_status: 1,
    },
    topics: [
      web3.utils.sha3("Transfer(address,address,uint256)"),
      null,
    ],
  });

  var result = {};
  var i = 0;

  for (transfert in transferEvents) {
    if (transferEvents[transfert].returnValues._to == ADDRESS) {
      result[i] = {
        address: transferEvents[transfert].returnValues._from,
        value:
          transferEvents[transfert].returnValues._value *
          Math.pow(10, -DECIMALS),
        type: "deposit",
      };
      i++;
    } else if (transferEvents[transfert].returnValues._from == ADDRESS) {
      result[i] = {
        address: transferEvents[transfert].returnValues._to,
        value:
          transferEvents[transfert].returnValues._value *
          Math.pow(10, -DECIMALS),
        type: "withdraw",
      };
      i++;
    }
  }

  var wallet = {};

  var total = 0;

  for (test in result) {
    if (result[test].type == "deposit") {
      if (!wallet[result[test].address]) {
        wallet[result[test].address] = result[test].value;
        total += result[test].value;
      } else {
        wallet[result[test].address] = wallet[result[test].address] +=
          result[test].value;
        total += result[test].value;
      }
    } else if (result[test].type == "withdraw") {
      wallet[result[test].address] = wallet[result[test].address] -=
        result[test].value;
      total -= result[test].value;
    }
  }

  console.log(wallet);
  console.log("Total : " + total);
}

main();
