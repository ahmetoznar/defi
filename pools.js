import React, { Component } from "react";
import Pools from "./../components/pools/pools";
import Blogs from './../components/Footer/blogs';
import Datas from './../stakePoolDetails.json';

class pools extends Component {

  state = {
    totalStakers: 0,
    totalStakedUSD: 0
  }

  async componentDidMount(){
  this.setState({totalStakedUSD: Datas.totalStakedValue, totalStakers: Datas.stakers})
  }

  render() {
    return (
      <div className="main">
        <div className="section-hero">
          <div className="container-center">
            <div className="hero-container">
              <div className="hero-img">
                <img src="assets/images/graphic-staking.svg" loading="lazy" alt />
              </div>
              <div className="hero-headline">
                <h1>
                 Welcome to
                  <br />
                  <span className="text-green">De-Fi Based Argon.</span>
                </h1>
                <div className="text-big">
                  Argon provides decentralized staking pools with other projects on Binance 
                  Smart Chain. Argon staking protocol and platform combines
                  staking and DeFi. Thanks to our staking protocol we can encourage the investors to using Argon.  
                </div>
                <a href="https://guide.argon.run/defi-based-argon/" target="_blank" className="button-primary">
                  Getting started
                </a>
              </div>
            </div>
            <div className="overflow-container">
              <div className="w-layout-grid _2-grid">
                <div className="card">
                  <h3>Total BNB Staked with USD</h3>
                  <div className="text-bigger">${this.state.totalStakedUSD.toFixed(3)}</div>
                </div>
                <div className="card">
                  <h3>Stakers</h3>
                  <div className="text-bigger">{this.state.totalStakers}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Pools />
        <div className="section-light">
          <div className="container-center">
            <div className="section-headline">
              <h2 className="text-dark-2">
                <span className="text-green">Why</span> stake with Argon?
              </h2>
              <div className="text-big">
                Argon staking solution provides the best user experience
                and highest level of safety, combined with an attractive reward
                mechanism and unique incentives.
              </div>
            </div>
            <div className="w-layout-grid _4-grid">
              <div className="card">
                <img
                  src="assets/images/stack.svg"
                  loading="lazy"
                  alt
                  className="icon"
                />
                <h3>Penalty Model</h3>
                <div>
                Thanks to the penalty mechanism in the Argon staking protocol, we can encourage investors to staking and farming.
                </div>
              </div>
              <div className="card">
                <img
                  src="assets/images/arrows-fullscreen.svg"
                  loading="lazy"
                  alt
                  className="icon"
                />
                <h3>Paired Pools</h3>
                <div>
                  Thanks to paired pools, you can benefit from the prize pool of other projects we partner with by depositing ARGON.
                </div>
              </div>
              <div className="card">
                <img
                  src="assets/images/arrow-repeat.svg"
                  loading="lazy"
                  alt
                  className="icon"
                />
                <h3>Farming</h3>
                <div>
                You can support ARGON-BNB liquidity through Pancake Swap and earn ARGON with the CAKE-LP tokens you receive in return.
                </div>
              </div>
              <div
                data-w-id="6590deb6-e51e-48ce-40d0-07379e1ce8c3"
                className="card"
              >
                <img
                  src="assets/images/shield-check.svg"
                  loading="lazy"
                  alt
                  className="icon"
                />
                <h3>Security</h3>
                <div>
                  Keep your funds under your own custody, to always remain in
                  full control of your assets. All smart contracts audited by Hacken.
                </div>
              </div>
            </div>
            <a href="https://guide.argon.run/defi-based-argon/" target="_blank" className="button-primary">
              How it works
            </a>
          </div>
        </div>
        {/*
        <div className="section">
          <div className="container-center">
            <div className="section-headline">
              <h2>
                <span className="text-green">Calculate </span>your earnings.
              </h2>
            </div>
            <div
              data-w-id="e37ba104-94be-1839-3caa-2e9f20321d34"
              className="calculator-container"
            >
              <div className="range-slider-container">
                <div className="range-dot">
                  <div className="dot-inner" />
                </div>
                <div className="range-bar" />
              </div>
              <div className="calc-block-container">
                <div className="calc-block">
                  <div className="card">
                    <h3>Total staked ETH</h3>
                    <div className="text-bigger">
                      39.5 <span className="text-light">ETH</span>
                    </div>
                    <div>
                      <strong>$149,476.3</strong>
                    </div>
                  </div>
                </div>
                <div className="calc-block">
                  <div className="card">
                    <h3>Yearly earning</h3>
                    <div className="text-bigger">
                      2.48 <span className="text-light">ETH</span>
                    </div>
                    <div>
                      <strong>$9,396.75</strong>
                    </div>
                  </div>
                </div>
              </div>
              <a href="#" className="button-primary">
                Connect wallet
              </a>
            </div>
          </div>
        </div>
        */}
        
        <Blogs />
        <div className="section-light">
      <div className="container-center">
        <div className="section-headline">
          <h2 className="text-dark">Frequently Asked <span className="text-green">Questions</span></h2>
        </div>
        <div data-w-id="ec1b3527-5dce-0faf-3b41-481b56933c89" className="tab-container">
          <div className="tabs-col">
            <div data-hover data-delay={0} className="tab w-dropdown">
              <div className="tab-header w-dropdown-toggle">
                <div>What is Argon?</div><img src="assets/images/plus.svg" loading="lazy" alt className="tab-icon" />
              </div>
              <div className="tab-body w-dropdown-list">
                <div>Argon is a completely decentralized freelancer platform on Binance Chain infrastructure.</div>
              </div>
            </div>
            <div data-hover data-delay={0} className="tab w-dropdown">
              <div className="tab-header w-dropdown-toggle">
                <div><strong>What is ArgonCharity?</strong></div><img src="assets/images/plus.svg" loading="lazy" alt className="tab-icon" />
              </div>
              <div className="tab-body w-dropdown-list">
                <div>ArgonChartiy is an association of helpful people in the ArgonCommunity. With a certain amount of funds from ArgonToken sales, we help people and communities in need. We will soon launch a blockchain-based charity platform.</div>
              </div>
            </div>
            <div data-hover data-delay={0} className="tab w-dropdown">
              <div className="tab-header w-dropdown-toggle">
                <div><strong>What is Approver?</strong></div><img src="assets/images/plus.svg" loading="lazy" alt className="tab-icon" />
              </div>
              <div className="tab-body w-dropdown-list">
                <div>When you unsatisfied with the quality of the work, you write a rejection statement and send it to Approver. The Apps takes action according to the response from Approver. For example: If the Approver job approves, the money is transferred and the job is successful. If Approver rejects the job, no money transfer will take place, your money will be returned to you and the job will be canceled. At the same time, Approvers earn ArgonToken per job based on certain algorithms.</div>
              </div>
            </div>
          </div>
          <div className="tabs-col">
            <div data-hover data-delay={0} className="tab w-dropdown">
              <div className="tab-header w-dropdown-toggle">
                <div><strong>How Can I Join the ArgonCharity Community?</strong></div><img src="assets/images/plus.svg" loading="lazy" alt className="tab-icon" />
              </div>
              <div className="tab-body w-dropdown-list">
                <div>You can apply for ArgonCharity by filling out the Google form on the link: <a href="https://forms.gle/RDUbik3LjkpSv2sT6" target="_blank">https://forms.gle/RDUbik3LjkpSv2sT6</a>
                </div>
              </div>
            </div>
            <div data-hover data-delay={0} className="tab w-dropdown">
              <div className="tab-header w-dropdown-toggle">
                <div><strong>What Makes Argon Different From Other Platforms?</strong></div><img src="assets/images/plus.svg" loading="lazy" alt className="tab-icon" />
              </div>
              <div className="tab-body w-dropdown-list">
                <div>Argon works using smart contracts and completely decentralized. And one of its biggest features is that, unlike all other platforms, it does not charge any commissions. Other Platforms charge a commission of up to 40%. We have brought a solution to one of the biggest problems faced by freelancers, payment problem.</div>
              </div>
            </div>
            <div data-hover data-delay={0} className="tab w-dropdown">
              <div className="tab-header w-dropdown-toggle">
                <div><strong>Can I Transfer Tokens on the Ethereum Network?</strong></div><img src="assets/images/plus.svg" loading="lazy" alt className="tab-icon" />
              </div>
              <div className="tab-body w-dropdown-list">
                <div>No. You can only make your transfer on the Binance Chain network.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   
        </div>
    );
  }
}

export default pools;
