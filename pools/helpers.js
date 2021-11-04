var moment = require("moment");
var axios = require("axios");
var pairABI = require("./pairAbi.json");

const ARGON_DEX_ADDRESSES = {
  "0x8c1a4C5E536A75fc58585323eCD4c60da17F5066" : 
    {
      address: "0x8c1a4C5E536A75fc58585323eCD4c60da17F5066",
      addLiquidityURL:
        "https://exchange.pancakeswap.finance/#/add/BNB/0x851f7a700c5d67db59612b871338a85526752c25",
      dexName: "Pancakeswap",
      pairName: "ARGON-BNB LP",
    },
    
};

const PRICE_IDS = {
  "0x851F7a700c5d67DB59612b871338a85526752c25": 
  {
    address: "0x851F7a700c5d67DB59612b871338a85526752c25",
    id: "argon",
  },
  "0x91f9Ca30E6c9836c9df7e922CF1B75589153507F":
  {
    address: "0x91f9Ca30E6c9836c9df7e922CF1B75589153507F",
    id: "smaugs-nft",
  },
  "0x948d2a81086A075b3130BAc19e4c6DEe1D2E3fE8":
  {
    address: "0x948d2a81086A075b3130BAc19e4c6DEe1D2E3fE8",
    id: "helmet-insure",
  }
};

//contract adresi büyük harf ile olmalıdır.



async function getPair(CONTRACT_ADDRESS, web3) {
  const instance = new web3.eth.Contract(
    pairABI,
    CONTRACT_ADDRESS
  );
  return instance;
}



function isFarming(address) {
      const dex = ARGON_DEX_ADDRESSES[address];
      if(dex != undefined){
        return [
          true,
          dex.address,
          dex.addLiquidityURL,
          dex.dexName,
          dex.pairName,
        ];
    }else{
      return [false]
    }
}

async function getBNBPrice() {
  const priceData = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
  );
  if(priceData.status == 200) {
    return [true, priceData.data.binancecoin.usd]
  } else {
    return [false]
  }
}


async function getTokenPrice(address) {
    if (PRICE_IDS[address] != undefined) {

      const priceData = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=" +
          PRICE_IDS[address].id +
          "&vs_currencies=usd"
      );
      console.log(priceData)
      if (priceData.status == 200) {
        return [true, priceData.data[PRICE_IDS[address].id].usd];
      } else {
        return [false];
      }
    } else {
      return [false];
    }
}

 function findBlockMultipler(startBlock, finishBlock, blockPerYear){
  const diffBlockNumber = Number(finishBlock - startBlock);
  return Number(blockPerYear / diffBlockNumber);
}

async function blockToTime(web3, increaseValue, blockNumber) {
  const nowBlockNumber = await web3.eth.getBlockNumber();
  const diffBlockNumber = (await blockNumber) - nowBlockNumber;
  const timeSecond = (await diffBlockNumber) * increaseValue * 1000;
  const currentDate = await new Date();
  const timestamp = await currentDate.getTime();
  const newTimeStamp = (await timeSecond) + timestamp;
  const finishDate = moment(newTimeStamp).calendar();
  return finishDate;
}

function calculateAPY(totalReward, totalDepositedAmount) {
  return (Number(totalReward) / Number(totalDepositedAmount)) * 100;
}

export { isFarming, blockToTime, getTokenPrice, calculateAPY, findBlockMultipler, getPair, getBNBPrice };
