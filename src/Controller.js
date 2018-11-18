import React, { Component } from "react";

const noop = function() {
  return null;
};

function bindSlots(slots) {
  return Object.entries(slots).reduce((prev, [key, value]) => {
    prev[key] = value.bind(this);
    return prev;
  }, {});
}

export default class Controller extends Component {
  static defaultProps = {
    state: {},
    methods: [],
    slots: {
      to: noop,
      amount: noop,
      controls: noop
    }
  };

  constructor(props) {
    super(props);
    const { methods } = props;

    methods.forEach(method => (this[method.name] = method.bind(this)));
  }

  state = {
    to: "",
    amount: 0,
    slots: bindSlots.call(this, this.props.slots),
    ...this.props.state
  };

  setTo = ({ target: { value: to } }) => this.setState({ to });

  setAmount = ({ target: { value: amount } }) => this.setState({ amount });

  handleSubmit = e => {
    const { service } = this.props;
    const { to, amount } = this.state;

    e.preventDefault();

    service.sendTransaction({
      to,
      amount
    });
  };

  render() {
    const {
      to,
      amount,
      slots: { to: toSlot, amount: amountSlot, controls: controlsSlot }
    } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset>
          <label htmlFor="to">
            To address: <br />
            <input id="to" type="text" value={to} onChange={this.setTo} />
            {toSlot()}
          </label>
          <br />
          <label htmlFor="amount">
            Amount: <br />
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={this.setAmount}
            />
            {amountSlot()}
          </label>
          <button>Send</button>
          {controlsSlot()}
        </fieldset>
      </form>
    );
  }
}

export const ChainAController = () => (
  <Controller
    name="Chain A"
    service={{
      sendTransaction: ({ to, amount }) => alert(`Sending ${amount} to ${to}.`)
    }}
  />
);

export const ChainBController = () => (
  <Controller
    name="Chain B"
    service={{
      sendTransaction: ({ to, amount, token }) =>
        alert(`Sending ${amount} of ${token} to ${to}.`)
    }}
    state={{
      token: "TKNA"
    }}
    methods={[
      function setToken({ target: { value: token } }) {
        this.setState({ token });
      },
      function handleSubmit(e) {
        const { service } = this.props;
        const { to, amount, token } = this.state;

        e.preventDefault();

        service.sendTransaction({
          to,
          amount,
          token
        });
      }
    ]}
    slots={{
      to: function() {
        const { token } = this.state;

        return (
          <label htmlFor="token">
            <br />
            Select a token: <br />
            <select value={token} onChange={this.setToken}>
              <option value="TKNA">Token A</option>
              <option value="TKNB">Token B</option>
              <option value="TKNC">Token C</option>
            </select>
          </label>
        );
      },
      amount: noop,
      controls: noop
    }}
  />
);

export const ChainCController = () => (
  <Controller
    name="Chain C"
    service={{
      sendTransaction: ({ amount, to, paymentId }) =>
        alert(`Sending ${amount} to ${to} with payment ID ${paymentId}.`)
    }}
    state={{
      paymentId: ""
    }}
    methods={[
      function setPaymentId({ target: { value: paymentId } }) {
        this.setState({ paymentId });
      },
      function handleSubmit(e) {
        const { service } = this.props;
        const { to, amount, paymentId } = this.state;

        e.preventDefault();

        service.sendTransaction({
          to,
          amount,
          paymentId
        });
      }
    ]}
    slots={{
      to: noop,
      amount: function() {
        const { paymentId } = this.state;

        return (
          <label htmlFor="paymentId">
            <br />
            Payment ID <br />
            <input type="text" value={paymentId} onChange={this.setPaymentId} />
          </label>
        );
      },
      controls: noop
    }}
  />
);
/* === */

/* === */
/**
 * Core:
 * - Address field
 * - Input field
 * - Submit button
 *
 * Chain A:
 * - No additions.
 *
 * Chain B:
 * - Has a token dropdown.
 *
 * Chain C:
 * - Has a paymentID field.
 */
