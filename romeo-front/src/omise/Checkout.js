import React, { Component } from "react";
import { Button } from "antd";

let OmiseCard;

export class Checkout extends Component {
  handleScriptLoad = () => {
    OmiseCard = window.OmiseCard;
    OmiseCard.configure({
      publicKey: process.env.REACT_APP_OMISE_PUBLIC_KEY,
      frameLabel: "Photo-Bro",
      currency: "THB"
    });
  };

  creditCardConfigure = () => {
    OmiseCard.configure({
      defaultPaymentMethod: "credit_card",
      otherPaymentMethods: []
    });
    OmiseCard.configureButton("#credit-card");
    OmiseCard.attach();
  };

  omiseCardHandler = () => {
    const { job, amount, createCreditCardCharge } = this.props;
    OmiseCard.open({
      amount: amount * 100,
      onCreateTokenSuccess: token => {
        createCreditCardCharge(job, token);
      },
      onFormClosed: () => {}
    });
  };

  handleClick = e => {
    e.preventDefault();
    this.creditCardConfigure();
    this.omiseCardHandler();
  };

  componentDidMount() {
      this.handleScriptLoad();
  }

  render() {
      const { job } = this.props
    return (
        <form className="d-flex align-center">
          <Button
            id="credit-card"
            type="primary"
            htmlType="button"
            onClick={this.handleClick}
            shape="round"
          >
            {job.job_status === "MATCHED" ? "Pay Deposit" : "Pay for Full Price"}
          </Button>
        </form>
    );
  }
}

export default Checkout;