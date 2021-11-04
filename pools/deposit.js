import React, { Component } from "react";
import { getStakingPool } from "./../../ethereum/ArgonStakingPool";
import { getToken, fromDecimal, toDecimal } from "./../../ethereum/token";
import { getWeb3 } from "./../../ethereum/web3";
import { blockToTime } from "./helpers";
import { ToastContainer, toast } from "react-toast";
import DotLoader from "react-spinners/DotLoader";
import { css } from "@emotion/react";

let web3;
export default class deposit extends Component {
  state = {
    amount: 0,
    penaltyRate: 0,
    penaltyEndBlockNumber: 0,
    penlatyEndDate: "",
    penaltyAmount: 0,
    penaltyStatus: false,
    inputAmount: "",
    number: 1,
    loadingUnstake: false,
    error: "null"
  };
  async componentDidMount() {
    const { address, id, number } = this.props;
    const stakingPool = await getStakingPool(address);
    web3 = await getWeb3();
    const userPoolInfo = await stakingPool.methods.getUserPoolInfo(id).call();
    const _amount = userPoolInfo[2];
    const _stakingToken = await stakingPool.methods.stakingToken().call();
    const stakingToken = await getToken(_stakingToken);
    const stakingTokenDecimals = await stakingToken.methods.decimals().call();
    const _penaltyRate = await stakingPool.methods.penaltyRate().call();
    const penaltyRate = _penaltyRate / 10000;
    const amount = fromDecimal(_amount, stakingTokenDecimals);
    const penaltyEndBlockNumber = userPoolInfo[1];
    const penlatyEndDate = await blockToTime(web3, 3, penaltyEndBlockNumber);
    const blockNumber = await web3.eth.getBlockNumber();
    const finishBlock = await stakingPool.methods.finishBlock().call();
    
    
    if (blockNumber > penaltyEndBlockNumber) {
      const penaltyAmount = 0;
      this.setState({
        penaltyAmount: penaltyAmount,
        penaltyRate: 0,
        penaltyStatus: false,
      });
    } else if(blockNumber > finishBlock) {
      const penaltyAmount = 0;
      this.setState({
        penaltyAmount: penaltyAmount,
        penaltyRate: 0,
        penaltyStatus: false,
      });
    } else {
      const penaltyAmount = (amount * penaltyRate) / 100;
      this.setState({
        penaltyRate: penaltyRate,
        penaltyAmount: penaltyAmount,
        penaltyStatus: true,
      });
    }
    this.setState({
      amount: amount,
      penaltyEndBlockNumber: penaltyEndBlockNumber,
      penlatyEndDate: penlatyEndDate,
      number: number + 1,
    });
  }
  async changeAmount(e) {
    this.setState({
      inputAmount: e.target.value,
    });
  }

  setMax = async () => {
    const { amount } = this.state;
    this.setState({
      inputAmount: amount,
    });
  };

  onUnstake = async () => {
    this.setState({loadingUnstake: true})
    const { address, id } = this.props;
    const { inputAmount } = this.state;
    const stakingPool = await getStakingPool(address);
    web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const _stakingToken = await stakingPool.methods.stakingToken().call();
    const stakingToken = await getToken(_stakingToken);
    const stakingTokenDecimals = await stakingToken.methods.decimals().call();
    const amount = toDecimal(inputAmount, stakingTokenDecimals);
    try {
      await stakingPool.methods.withdrawStake(BigInt(amount), BigInt(id)).send({
        from: accounts[0],
      }).on('transactionHash', function(hash){
        toast.success(<a style={{color: "white"}} target="_blank"  href={`https://bscscan.com/tx/${hash}`}>View Transaction - Succesful</a>);
      });
      this.setState({loadingUnstake: false, error: "Succesfully Unstaked"})
    } catch (error) {
      this.setState({loadingUnstake: false, error: error.message})
      toast.warn(error.message + "Failed");
    }
   
  };
  render() {
    const {
      amount,
      penaltyRate,
      penaltyEndBlockNumber,
      penlatyEndDate,
      penaltyAmount,
      penaltyStatus,
      inputAmount,
      number,
    } = this.state;
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
    return (
      <div className="stake-deposit">
        <h5 className="text-dark-2">#{number}</h5>

        <div>Amount: {amount} </div>
        {penaltyStatus ? 
        <>
        <div>Penalty Status: <span style={{color: "#eac246"}}>Warning: Penalty</span>  </div>
        <div>Penalty Amount: {penaltyAmount} </div>
        <div>Penalty Rate: {penaltyRate}%</div>
        </>
        : "Free Withdraw"}
        <div>
          Penalty End: {penaltyEndBlockNumber} block ({penlatyEndDate})
        </div>
        <div className="search-2 w-form">
          <input
            type="number"
            class="search w-input unstake-input"
            placeholder="Amount"
            value={inputAmount}
            onChange={this.changeAmount.bind(this)}
          />
          <button onClick={this.setMax} className="max-button-unstake w-button">
            MAX
          </button>
        </div>
        <p>{this.state.error != "null" ? this.state.error : null}</p>
        <a
          onClick={this.onUnstake}
          target="_blank"
          className="button-secondary pool-unstake-button"
        >
         {this.state.loadingUnstake ?   
                    <DotLoader
                          css={override}
                          size={20}
                          color={"#fff"}
                          loading="true"
                          speedMultiplier={1.5}
                        /> : "Unstake"} 
        </a>
      </div>
    );
  }
}
