import { PAGE_LINKS } from "../../../constants";
import { useRemoteConfig } from "../../../providers/remote-config-provider";
import {
  PaymentPlanId,
  useGetSubscriptionProducts,
} from "../../../use-cases/get-subscription-products";
import { Currency } from "../constants";
import { getPlanPrices, getPlanBullets, isFromEmail } from "../helpers";
import { TranslationFunction, Plan } from "../types";
import { useAnalytics } from "./useAnalytics";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const usePlans = () => {
  const { sendAnalytics } = useAnalytics();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlanId>(
    PaymentPlanId.MONTHLY_FULL
  );
  const router = useRouter();
  const { products } = useGetSubscriptionProducts();
  const { abTests } = useRemoteConfig();

  const onCommentsFlip = () => {
    sendAnalytics("send event analytic0");
  };

  const onSelectPlan = (plan: PaymentPlanId) => {
    if (selectedPlan === plan) {
      setSelectedPlan(plan);
      onContinue("planTab");

      return;
    }
    setSelectedPlan(plan);
    const product = products?.find((item) => item.name === plan);

    sendAnalytics(
      "send event analytic1",
      "productId: ",
      plan,
      "currency: ",
      product?.price?.currency || Currency.USD,
      "value: ",
      (product?.price?.price || 0) / 100
    );
  };

  const onContinue = (place?: string) => {
    sendAnalytics(
      "send event analytic2",
      "place: ",
      place ? place : "button",
      "planName: ",
      selectedPlan
    );

    localStorage.setItem("selectedPlan", selectedPlan);

    router.push({ pathname: `${PAGE_LINKS.PAYMENT}`, query: router.query });
  };

  const getPlans = (t: TranslationFunction): Plan[] => {
    return products.map((product ) => {
      const { name, price, disabledFeatures, type } = product;
      const { trial_price, currency, price: fullPrice } = price;

      const { price: planPrice, ...restPrices } = getPlanPrices({
        type,
        fullPrice,
        trialPrice: trial_price,
        currency,
      });

      const plan: Plan = {
        id: name,
        title: t(`payment_page.plans.${type}.title`),
        date: null,
        bullets: getPlanBullets({ type, disabledFeatures, t }),
        text: t(`payment_page.plans.${type}.text`, {
          formattedPrice: restPrices.fullPrice,
        }),
        price: planPrice,
        ...restPrices,
      };

      return plan;
    });
  };

  useEffect(() => {
    if (isFromEmail(router)) {
      setSelectedPlan(PaymentPlanId.MONTHLY_FULL_SECOND_EMAIL);
      return;
    }
  }, [abTests]);

  return {
    selectedPlan,
    getPlans,
    onCommentsFlip,
    onSelectPlan,
    onContinue,
    isPlansLoading: products.length === 0,
  };
};
