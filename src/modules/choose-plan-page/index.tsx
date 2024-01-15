import { Header } from "../../header";
import { PaymentPageRouter } from "./router";
import React from "react";

export interface IProps {}
export const PaymentPage: React.FC<IProps> = () => {
  return <PaymentPageRouter header={<Header backgroundColor="#FFF" />} />;
};
