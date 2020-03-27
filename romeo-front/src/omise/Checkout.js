import React, { Component } from "react";
import { Button } from "antd";

import "./Checkout.css";

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
    const { job, createCreditCardCharge } = this.props;
    OmiseCard.open({
      onCreateTokenSuccess: token => {
        createCreditCardCharge(job.job_id, token);
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
      <div className="own-form">
        <form>
          <Button
            id="credit-card"
            type="primary"
            formType="button"
            onClick={this.handleClick}
          >
            {job.job_status === "MATCHED" ? "Pay Deposit" : "Pay for Full Price"}
          </Button>
        </form>
      </div>
    );
  }
}

export default Checkout;