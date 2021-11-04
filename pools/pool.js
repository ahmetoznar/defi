import React, { Component } from "react";
import { getStakingPool } from "./../../ethereum/ArgonStakingPool";
import { connectWallet, getWeb3 } from "./../../ethereum/web3";
import equal from "fast-deep-equal";
import { getToken, fromDecimal, toDecimal } from "./../../ethereum/token";
import { isFarming, blockToTime, getTokenPrice, findBlockMultipler, getPair, getBNBPrice } from "./helpers";
import { ToastContainer, toast } from "react-toast";
import DotLoader from "react-spinners/DotLoader";
import { css } from "@emotion/react";
import Deposits from "./deposits";

var localStorage = require("localStorage");

let web3;
const isConnected = Boolean(localStorage.getItem("isConnected"));

export default class pool extends Component {
  state = {
    finishBlock: "",
    nowBlock: "",
    startBlock: "",
    stakingTokenName: "",
    startDate: "",
    participants: 0,
    distrubuted: "",
    totalReward: "",
    poolTokenAmount: 0,
    allPaidReward: 0,
    showInput: false,
    haveRewardTokenPrice: false,
    haveStakingTokenPrice: false,
    rewardTokenPrice: 0,
    stakingTokenPrice: 0,
    amount: 0,
    approve: false,
    userInfo: "",
    userStaked: 0,
    isUnstake: false,
    loadingApprove: false,
    loadingStake: false,
    rewardPerMinute: 0,
    distrubutedPercent: 0,
    harvestLoading: false,
    apy: 0,
    allStakedAmount: 0,
    showAPY: false,
    userPendingReward: 0,
    isFarming: false,
    farmingLink: "https://exchange.pancakeswap.finance/#/add/BNB/0x851f7a700c5d67db59612b871338a85526752c25",
    balanceOf: 0
  };

  async setData() {
    const { address } = this.props;
    const stakingPool = await getStakingPool(address);
    web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const finishBlock = await stakingPool.methods.finishBlock().call();
    const startBlock = await stakingPool.methods.startBlock().call();
    const finishDate = await blockToTime(web3, 3, finishBlock);
    const _stakingToken = await stakingPool.methods.stakingToken().call();
    const _rewardToken = await stakingPool.methods.rewardToken().call();
    const stakingToken = await getToken(_stakingToken);
    const rewardToken = await getToken(_rewardToken);
    const stakingTokenDecimals = await stakingToken.methods.decimals().call();
    const rewardTokenDecimals = await rewardToken.methods.decimals().call();
    const _poolTokenAmount = await stakingPool.methods.poolTokenAmount().call();
    const _allPaidReward = await stakingPool.methods.allPaidReward().call();
    const poolTokenAmount = fromDecimal(_poolTokenAmount, stakingTokenDecimals);
    const allPaidReward = fromDecimal(_allPaidReward, stakingTokenDecimals);
    const _penaltyRate = await stakingPool.methods.penaltyRate().call();
    const penaltyRate = _penaltyRate / 10000;
    const stakingTokenName = await stakingToken.methods.name().call();
    const isPenalty = await stakingPool.methods.isPenalty().call();
    const rewardTokenName = await rewardToken.methods.name().call();
    const participants = await stakingPool.methods.participants().call();
    const _rewardPerBlock = await stakingPool.methods.rewardPerBlock().call();
    const rewardPerBlock = fromDecimal(_rewardPerBlock, rewardTokenDecimals)
    const nowBlock = await web3.eth.getBlockNumber();
    const _allStakedAmount = await stakingPool.methods.allStakedAmount().call();
    if(accounts.length > 0){
    const _userPendingReward = await stakingPool.methods.pendingReward(accounts[0]).call();
    var userPendingReward = await fromDecimal(_userPendingReward, rewardTokenDecimals)    
    const _balanceOf = await stakingToken.methods.balanceOf(accounts[0]).call();
    var balanceOf = await fromDecimal(_balanceOf, stakingTokenDecimals)
    }
    const allStakedAmount = fromDecimal(_allStakedAmount, stakingTokenDecimals);
    if(_stakingToken != _rewardToken){
      const farming = isFarming(_stakingToken);
    if(farming[0]){
      const pair = await getPair(_stakingToken, web3)  
      const pairDecimals = await pair.methods.decimals().call();
      const reserves = await pair.methods.getReserves().call();
      const _token0 = await pair.methods.token0().call();
      const token0 = await getToken(_token0);
      const token0Decimals = await token0.methods.decimals().call();
      const reserve0 = fromDecimal(reserves["_reserve0"], token0Decimals)

      const _token1 = await pair.methods.token1().call();
      const token1 = await getToken(_token1);
      const token1Decimals = await token1.methods.decimals().call();
      const reserve1 = fromDecimal(reserves["_reserve1"], token1Decimals)
      const bnbPrice = await getBNBPrice();

      const bnbPerToken = reserve0 / reserve1;
      const tokenPrice = 1 / bnbPerToken * bnbPrice[1];

      const totalLiquidityUsd = (tokenPrice * reserve0) + (bnbPrice[1] * reserve1);
      const _totalPairSupply = await pair.methods.totalSupply().call();
      const totalPairSupply = fromDecimal(_totalPairSupply, pairDecimals);
      const pairPercent = Number(allStakedAmount * 100 / totalPairSupply)
      const stakedUSD = totalLiquidityUsd * pairPercent / 100;
      const rewardTokenPrice = await getTokenPrice(
        _rewardToken
      );
      const mulValue = findBlockMultipler(startBlock, finishBlock, 10512000)
      const APY = (Number(poolTokenAmount * rewardTokenPrice[1]) * Number(mulValue)) / Number(stakedUSD) * 100 ;
        if(rewardTokenPrice[0] == false || bnbPrice[0] == false){
          this.setState({
            stakingTokenName: farming[4],
            apy: APY,
            showAPY: false,
            isFarming: true,
            farmingLink: farming[2]
          });
        }else{
          this.setState({
            stakingTokenName: farming[4],
            apy: APY,
            showAPY: true,
            isFarming: true,
            farmingLink: farming[2]
          });
        }
    }else{
      const rewardTokenPrice = await getTokenPrice(
        _rewardToken
      );
      const stakingTokenPrice = await getTokenPrice(
        _stakingToken
      );

      if( stakingTokenPrice[0] == false && rewardTokenPrice[0] == false && allStakedAmount == 0){
        this.setState({
          stakingTokenName: stakingTokenName + "/" + rewardTokenName,
          showAPY: true
        });

      }else{
        const mulValue = findBlockMultipler(startBlock, finishBlock, 10512000)
        const APY = (Number(poolTokenAmount * rewardTokenPrice[1]) * Number(mulValue)) / Number(allStakedAmount * stakingTokenPrice[1]) * 100 ;
        this.setState({
          stakingTokenName: stakingTokenName + "/" + rewardTokenName,
          apy: APY,
          showAPY: false
        });
      }
    
    }
    }else{
      const mulValue = findBlockMultipler(startBlock, finishBlock, 10512000)
      const APY = (Number(poolTokenAmount) * Number(mulValue)) / Number(allStakedAmount) * 100 ;
      if(APY != Infinity && APY != 0 && APY != NaN){
        this.setState({
          stakingTokenName: stakingTokenName,
          apy: APY,
          showAPY: true
        });
      }else{
        this.setState({
          stakingTokenName: stakingTokenName,
          apy: APY,
          showAPY: false
        });
      }
    
    }

    if(nowBlock < startBlock){
      var startDate = await blockToTime(web3, 3, startBlock);
      }else{
      var startDate = "Pool Started"
      }


    const distrubutedPercent = await allPaidReward * 100 / poolTokenAmount;
    const rewardPerMinute = await rewardPerBlock * 20; 

    if (isConnected) {
      const userInfo = await stakingPool.methods
        .getUserInfo(accounts[0])
        .call();
      for (let f = 0; f < userInfo[2].length; f++) {
        const userPoolInfo = await stakingPool.methods
          .getUserPoolInfo(BigInt(userInfo[2][f]))
          .call();
      }
      const staked = fromDecimal(userInfo[0], stakingTokenDecimals);
      this.setState({
        userInfo,
        userStaked: staked,
      });
    }
   
    this.checkApprove();
    if(accounts.length < 0){
    this.setState({
      finishBlock: finishBlock,
      nowBlock: nowBlock,
      startBlock: startBlock,
      rewardPerMinute: rewardPerMinute,
      startDate: startDate,
      finishDate: finishDate,
      isConnected: isConnected,
      participants: participants,
      poolTokenAmount: poolTokenAmount,
      allStakedAmount: allStakedAmount,
      allPaidReward: allPaidReward,
      distrubutedPercent: distrubutedPercent,
      rewardTokenName:rewardTokenName,
      _stakingToken: _stakingToken,
      _rewardToken: _rewardToken,
      userPendingReward: userPendingReward,
      showInput: false,
      penaltyRate: penaltyRate,
      approve: false,
      loadingApprove: false,
      isPenalty: isPenalty
    });
  }else{
    this.setState({
      finishBlock: finishBlock,
      nowBlock: nowBlock,
      startBlock: startBlock,
      rewardPerMinute: rewardPerMinute,
      startDate: startDate,
      finishDate: finishDate,
      isConnected: isConnected,
      participants: participants,
      poolTokenAmount: poolTokenAmount,
      allStakedAmount: allStakedAmount,
      allPaidReward: allPaidReward,
      distrubutedPercent: distrubutedPercent,
      rewardTokenName:rewardTokenName,
      _stakingToken: _stakingToken,
      balanceOf: balanceOf,
      penaltyRate: penaltyRate,
      _rewardToken: _rewardToken,
      showInput: false,
      approve: false,
      loadingApprove: false,
      isPenalty: isPenalty
    });
  }
 
  }


  checkApprove = async () => {
    if (isConnected) {
      const { address } = this.props;
      const stakingPool = await getStakingPool(address);
      const _stakingToken = await stakingPool.methods.stakingToken().call();
      const stakingToken = await getToken(_stakingToken);

      const accounts = await web3.eth.getAccounts();
      const { amount } = this.state;
      const stakingTokenDecimals = await stakingToken.methods.decimals().call();
      const _amount = toDecimal(amount, stakingTokenDecimals);
      const allowance = await stakingToken.methods
        .allowance(accounts[0], address)
        .call();
      if (Number(allowance) >= Number(_amount)) {
        this.setState({
          approve: false,
        });
      } else {
        this.setState({
          approve: true,
        });
      }
      
    }
  };

  onApprove = async () => {
    if (isConnected) {
      this.setState({loadingApprove: true})
      const { address } = this.props;
      const { amount } = this.state;
      const accounts = await web3.eth.getAccounts();

      const stakingPool = await getStakingPool(address);
      const _stakingToken = await stakingPool.methods.stakingToken().call();
      const stakingToken = await getToken(_stakingToken);
      const stakingTokenDecimals = await stakingToken.methods.decimals().call();

      const _amount = toDecimal(amount, stakingTokenDecimals);

      await stakingToken.methods.approve(address, BigInt(_amount)).send({
        from: accounts[0],
      });
      this.checkApprove();
      this.setState({loadingApprove: false})

    }
  };

  async changeAmount(e) {
    this.setState({
      amount: e.target.value,
    });
    this.checkApprove();
  }

  async componentDidMount() {
    this.setData();
  }

  async componentDidUpdate(prevProps) {
    if (!equal(this.props.address, prevProps.address)) {
      // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
      this.setData();
    }
  }

 
  changeUnstake = async () => {
    const { isUnstake } = this.state;
    if(isConnected){
    if (isUnstake) {
      this.setState({
        approve: false,
        isUnstake: false,
      });
    } else {
      this.setState({
        isUnstake: true,
      });
    }
  }else{
    connectWallet()
  }
  };

  onHarvest = async () => {
    const { address } = this.props;
    const { userInfo } = this.state;
    this.setState({harvestLoading: true})
    const stakingPool = await getStakingPool(address);
    web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    try {
      if (userInfo[2].length > 0) {
        await stakingPool.methods.withdrawStake(0, BigInt(userInfo[2][0])).send({
          from: accounts[0],
        }).on('transactionHash', function(hash){
          toast.success(<a style={{color: "white"}} target="_blank" href={`https://bscscan.com/tx/${hash}`}>View Transaction - Succesful</a>);
        });
      }
    this.setState({harvestLoading: false})
    this.setData()
    } catch (error) {
    this.setState({harvestLoading: false})
    toast.warn(error.message + "Failed");
    this.setData()
    }
  };

  onStake = async () => {
    this.setState({loadingStake: true})
    if(isConnected){
    const { address } = this.props;
    const { amount } = this.state;
    const stakingPool = await getStakingPool(address);
    const accounts = await web3.eth.getAccounts();
    const _stakingToken = await stakingPool.methods.stakingToken().call();
    const stakingToken = await getToken(_stakingToken);
    const decimals = await stakingToken.methods.decimals().call();
    const _amount = toDecimal(amount, decimals);
    try {
      await stakingPool.methods.stakeTokens(BigInt(_amount)).send({
        from: accounts[0],
      }).on('transactionHash', function(hash){
        toast.success(<a style={{color: "white"}} target="_blank"  href={`https://bscscan.com/tx/${hash}`}>View Transaction - Succesful</a>);
});
    this.setState({loadingStake: false})
    this.setData()
    } catch (error) {
    this.setState({loadingStake: false})
    toast.warn(error.message + "Failed");
    this.setData()
    }
  }else{
    connectWallet();
  }
  };

  changeInput = () => {
    const { showInput, approve, isUnstake } = this.state;
    this.setState({ showInput: !showInput, amount: 0 });
    if (approve) {
      this.setState({
        approve: false,
      });
    }
    if (isUnstake) {
      this.setState({
        isUnstake: false,
      });
    }
  };

  setMax = async () => {
    if (isConnected) {
      const { address } = this.props;
      const stakingPool = await getStakingPool(address);
      const _stakingToken = await stakingPool.methods.stakingToken().call();
      const stakingToken = await getToken(_stakingToken);
      const accounts = await web3.eth.getAccounts();
      const balanceOf = await stakingToken.methods
        .balanceOf(accounts[0])
        .call();
      const stakingTokenDecimals = await stakingToken.methods.decimals().call();
      const amount = fromDecimal(balanceOf, stakingTokenDecimals);
      this.setState({
        amount: amount,
      });
    }
    this.checkApprove();
  };

  render() {
    const {
      finishBlock,
      nowBlock,
      startBlock,
      stakingTokenName,
      rewardTokenName,
      startDate,
      participants,
      allPaidReward,
      rewardPerMinute,
      poolTokenAmount,
      showInput,
      distrubutedPercent,
      _stakingToken,
      _rewardToken,
      isPenalty,
      finishDate,
      amount,
      approve,
      allStakedAmount,
      penaltyRate,
      isFarming,
      userInfo,
      userStaked,
      isUnstake,
      isConnected,
      apy,
      userPendingReward,
      farmingLink,
      balanceOf
    } = this.state;
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
    return (
      <div className="card-light">
        {isConnected ? 
          <a
              onClick={this.onHarvest}
              target="_blank"
              style={{float: "left", marginTop: "1%"}}
              className="button-secondary pool-harvest-button"
            >
            {this.state.harvestLoading ? 
            <DotLoader
            css={override}
            size={20}
            color={"#fff"}
            loading="true"
            speedMultiplier={1.5}
            /> : "Harvest"
            }
            </a>
 : null}

            <span>
          <h2  style={{float: "right", textAlign: "right", color: "black", fontSize: "35"}}>{userPendingReward.toFixed(2)}  <h6 style={{marginTop: "-7%"}}>Earned {rewardTokenName}</h6></h2>

            </span>
            <br />
            <br />
            <br />
        <div className="job-top-bar">
       
          <div className="top-bar-right">
       
            <div className="text-created">Start: {startDate}</div>
            <div className="text-created">Finish: {finishDate}</div>
            <a href="#" className="total-number">
              Participants: {participants}
            </a>
          </div>
        </div>
        <div className="job-body">
        <div >
          <img className="" style={{borderRadius: "50%", width: "10%"}} src={`assets/images/stakePool/${_stakingToken}.png`}  />
          <img className="" style={{borderRadius: "50%", marginLeft: "-5%",  width: "10%"}} src={`assets/images/stakePool/${_rewardToken}.png`} />

          </div>
          
          <h3 className="text-dark-2">{stakingTokenName + " Pool"} </h3>
         
        </div>
        <div>
          {allStakedAmount != 0 ?  <div style={{fontSize: "30px", color: "#000000"}}><b>APY:</b> {apy.toFixed(3) + " %"}</div> : null }
          <div style={{color: "#000000"}} ><b>Penalty Status:</b> {isPenalty ? "Yes" : "No"}</div>
          <div style={{color: "#000000"}}><b >Penalty Rate:</b> {penaltyRate + "%"}</div>
          <div><b>Distributed tokens:</b> {allPaidReward.toFixed(2) + "/" + poolTokenAmount.toFixed(2)} - {distrubutedPercent.toFixed(3) + "%"}</div>
          <div><b>Your stake amount:</b> {userStaked.toFixed(2)}</div>
          <div><b>Reward Per Minute:</b> {rewardPerMinute.toFixed(5) + " " + rewardTokenName}</div>
          {isFarming ? 
          <a
                className="button-secondary add-button"
                target="_blank"
                href={farmingLink}
              >
                    Add Liquidity
              </a> : null}
          {showInput ? (
            <>
            <div className="search-2 w-form">
              <input
                type="number"
                class="search w-input "
                onChange={this.changeAmount.bind(this)}
                value={amount}
                placeholder="Amount"
              ></input>
             
              <button onClick={this.setMax} className="max-button w-button">
                MAX
              </button>
            </div>
              {isConnected ? <small>Your balance: {balanceOf.toFixed(3)}</small> : null}
          </>
          ) : null}
          <div>
            {approve ? (
              <a
                onClick={this.onApprove}
                className="button-secondary stake-button"
              >
                {this.state.loadingApprove ?      
                        <DotLoader
                          css={override}
                          size={20}
                          color={"#fff"}
                          loading="true"
                          speedMultiplier={1.5}
                        /> : "Approve"}
              </a>
            ) : showInput ? (
              <a
                onClick={this.onStake}
                className="button-secondary stake-button"
              >
                    {this.state.loadingStake ?      
                        <DotLoader
                          css={override}
                          size={20}
                          color={"#fff"}
                          loading="true"
                          speedMultiplier={1.5}
                        /> : "Confirm"}
              </a>
            ) : (
              <a
                onClick={this.changeInput}
                target="_blank"
                className="button-secondary stake-button"
              >
                {this.state.loadingStake ?      
                        <DotLoader
                          css={override}
                          size={20}
                          color={"#fff"}
                          loading="true"
                          speedMultiplier={1.5}
                        /> : "Stake"}
              </a>
            )}

            {showInput ? (
              <a
                onClick={this.changeInput}
                className="button-secondary unstake-button"
              >
                Cancel
              </a>
            ) : (
              <a
                className="button-secondary unstake-button"
                onClick={this.changeUnstake}
              >
                {isUnstake ? "Cancel" : "Unstake"}
              </a>
            )}
          </div>
          {isUnstake ? (
            <div>
              <h4 className="text-dark-2"> Deposits</h4>
              <Deposits userInfo={userInfo} address={this.props.address} />
            </div>
          ) : null}
        </div>

        <ToastContainer />
      </div>
    );
  }
}
