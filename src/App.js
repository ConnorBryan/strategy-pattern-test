import React, { Component } from "react";

import {
  ChainAController,
  ChainBController,
  ChainCController
} from "./Controller";

const StrategyTypes = {
  ChainA: "Chain A",
  ChainB: "Chain B",
  ChainC: "Chain C"
};

const controllers = {
  [StrategyTypes.ChainA]: ChainAController,
  [StrategyTypes.ChainB]: ChainBController,
  [StrategyTypes.ChainC]: ChainCController
};

export default class App extends Component {
  state = {
    strategy: StrategyTypes.ChainA
  };

  setStrategy = ({ target: { value: strategy } }) =>
    this.setState({ strategy });

  render() {
    const { strategy } = this.state;
    const Controller = controllers[strategy];

    return (
      <React.Fragment>
        <h2>Select a Controller</h2>
        <fieldset>
          <select value={strategy} onChange={this.setStrategy}>
            {Object.entries(StrategyTypes).map(([key, value]) => (
              <option key={key} value={value}>
                {key}
              </option>
            ))}
          </select>
        </fieldset>
        <section>
          <h2>{strategy}</h2>
          <Controller />
        </section>
      </React.Fragment>
    );
  }
}
