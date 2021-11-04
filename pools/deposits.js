import React, { Component } from "react";
import { getStakingPool } from "./../../ethereum/ArgonStakingPool";
import Deposit from "./deposit";

export default class deposits extends Component {
  state = {
    pools: [],
  };
  async componentDidMount() {
    const { userInfo, address } = this.props;
    const stakingPool = await getStakingPool(address);
    let pools = [];
    for (let i = 0; i < userInfo[2].length; i++) {
      const poolInfo = await stakingPool.methods
        .getUserPoolInfo(userInfo[2][i])
        .call();
      if(poolInfo[2] > 0){
      const data = { poolInfo: poolInfo, poolId: userInfo[2][i] };
      pools.push(data);
     }
    }

    this.setState({
      pools: pools,
    });
  }
  render() {
    const { pools } = this.state;
    return (
      <div>
        {pools != []
          ? pools.map((pool, key) => {
              return (
                <Deposit
                  id={pool.poolId}
                  number={key}
                  address={this.props.address}
                />
              );
            })
          : null}
      </div>
    );
  }
}
