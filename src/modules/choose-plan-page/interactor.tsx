import { PAGE_LINKS } from '../../constants';
import { useRemoteConfig } from '../../providers/remote-config-provider';
import {
  PaymentPlanId,
  useGetSubscriptionProducts,
} from '../../use-cases/get-subscription-products';
import { PLAN_TYPES, PlanTypes } from './constants';
import { getPlanBullets, getPlanPrices } from './helpers';
import { useAnalytics } from './hooks/useAnalytics';
import { useCheckAuth } from './hooks/useCheckAuth';
import { useImageCover } from './hooks/useImageCover';
import { useSetFile } from './hooks/useSetFile';
import { IPaymentPageInteractor, Plan, TranslationFunction } from './types';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export const usePaymentPageInteractor = (): IPaymentPageInteractor => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlanId>(
    PaymentPlanId.MONTHLY_FULL
  );
  const { products } = useGetSubscriptionProducts();

  const file = useSetFile();
  const { isImageLoading, fileLink, imagePDF } = useImageCover(file);
  const { abTests, isRemoteConfigLoading } = useRemoteConfig();
  const { sendAnalytics } = useAnalytics();
  useCheckAuth();

  const onCommentsFlip = () => {
    sendAnalytics('send event analytic0');
  };

  const onSelectPlan = (plan: PaymentPlanId) => {
    if (selectedPlan === plan) {
      setSelectedPlan(plan);
      onContinue('planTab');

      return;
    }
    setSelectedPlan(plan);
    const product = products?.find((item) => item.name === plan);

    sendAnalytics(
      'send event analytic1',
      'productId: ',
      plan,
      'currency: ',
      product?.price?.currency || 'USD',
      'value: ',
      (product?.price?.price || 0) / 100
    );
  };

  const onContinue = (place?: string) => {
    sendAnalytics(
      'send event analytic2',
      'place: ',
      place ? place : 'button',
      'planName: ',
      selectedPlan
    );

    localStorage.setItem('selectedPlan', selectedPlan);

    router.push({ pathname: `${PAGE_LINKS.PAYMENT}`, query: router.query });
  };

  useEffect(() => {
    if (router.query?.fromEmail === 'true') {
      setSelectedPlan(PaymentPlanId.MONTHLY_FULL_SECOND_EMAIL);
      return;
    }
  }, [abTests]);

  const getPlans = (t: TranslationFunction): Plan[] => {
    return products.map((product, index) => {
      const { name, price } = product;
      const { trial_price, currency, price: fullPrice } = price;
      const planType = PLAN_TYPES[index];
      const disabledItemsIndexes =
        planType === PlanTypes.MONTHLY ? [3, 4, 5, 6, 7] : [];

      const { price: planPrice, ...restPrices } = getPlanPrices({
        planType,
        fullPrice,
        trialPrice: trial_price,
        currency,
      });

      const plan: Plan = {
        id: name,
        title: t(`payment_page.plans.${planType}.title`),
        date: null,
        bullets: getPlanBullets({ planType, disabledItemsIndexes, t }),
        text: t(`payment_page.plans.${planType}.text`, {
          formattedPrice: restPrices.fullPrice,
        }),
        price: planPrice,
        ...restPrices,
      };

      return plan;
    });
  };

  return {
    selectedPlan,
    onSelectPlan,
    onContinue,
    onCommentsFlip,

    imagePDF: imagePDF ? imagePDF : null,
    isImageLoading,
    fileName: file ? file.filename : null,
    fileType: file ? file.internal_type : null,
    fileLink,
    isEditorFlow:
      (router.query?.source === 'editor' ||
        router.query?.source === 'account') &&
      router.query.convertedFrom === undefined,
    isSecondEmail: router.query?.fromEmail === 'true',
    isThirdEmail: router.query?.fromEmail === 'true',

    isRemoteConfigLoading,

    getPlans,
    isPlansLoading: products.length === 0,
  };
};
