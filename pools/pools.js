import React, { Component } from "react";
import { getStakeMaster } from "./../../ethereum/ArgonStakeMaster";
import { getStakingPool } from "./../../ethereum/ArgonStakingPool";
import { getWeb3 } from "./../../ethereum/web3";
import Pool from "./pool";
import DotLoader from "react-spinners/DotLoader";
import { css } from "@emotion/react";
let stakeMaster, web3;

export default class pools extends Component {
  state = {
    pools: [],
    closed: [],
    render: true,
    poolsLoading: true
  };
  async componentDidMount() {
    stakeMaster = await getStakeMaster();
    web3 = await getWeb3();
    const allPools = await stakeMaster.methods.getAllPools().call();
    let pools = [];
    let closed = [];
    const nowBlock = await web3.eth.getBlockNumber();

    for (let i = 0; i < allPools.length; i++) {
      const stakingPool = await getStakingPool(allPools[i]);
      const finishBlock = await stakingPool.methods.finishBlock().call();
      if (nowBlock > finishBlock) {
        const data = {
          address: allPools[i],
          status: false,
        };
        closed.push(data);
      } else {
        const data = {
          address: allPools[i],
          status: true,
        };
        pools.push(data);
      }
    }

    this.setState({
      pools: pools,
      closed: closed,
      poolsLoading: false
    });
  }

  activeHandle = (e) => {
    e.preventDefault();
    this.setState({
      render: true,
    });
  };

  closedHandle = (e) => {
    e.preventDefault();
    this.setState({
      render: false,
    });
  };

  render() {
     const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
    const { pools, closed, render } = this.state;
    return (
      <div className="section-light">
        <div className="container-center">
          <div className="section-headline">
            <h1 className="text-dark-2">
              All Staking and<span className="text-green"> Farming</span> Pools
            </h1>
          </div>
          <div className="search-result-container">
            <div className="filter-container">
              <div className="filter-button">
                <a
                  style={{ cursor: "pointer" }}
                  onClick={this.activeHandle.bind(this)}
                  className={`button-primary-small ${render ? "active" : null}`}
                >
                  Active Pools
                </a>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={this.closedHandle.bind(this)}
                  className={`button-primary-small ${render ? null : "active"}`}
                >
                  Closed Pools
                </a>
              </div>
            </div>
          </div>{ this.state.poolsLoading ?       
          <DotLoader
            css={override}
            size={20}
            color={"#fff"}
            loading="true"
            speedMultiplier={1.5}
            /> : 
          <div className="w-layout-grid _2-grid">
            {render
              ? pools.length > 0
                ? pools.map((pool, key) => {
                    return (
                      <Pool
                        address={pool.address}
                        status={pool.status}
                        key={key}
                      />
                    );
                  })
                : null
              : closed.length > 0
              ? closed.map((pool, key) => {
                  return (
                    <Pool
                      address={pool.address}
                      status={pool.status}
                      key={key}
                    />
                  );
                })
              : null}
          </div>
              }
        </div>
      </div>
    );
  }
}
