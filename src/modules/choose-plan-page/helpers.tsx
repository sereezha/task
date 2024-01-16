import check from "./assets/check.svg";
import cross from "./assets/cross.svg";
import {
  Currency,
  InternalFileType,
  PlanTypes,
  imagesFormat,
} from "./constants";
import { TranslationFunction } from "./types";
import { NextRouter } from "next/router";

export const getFileExtension = (filename: string) =>
  filename.substring(filename.lastIndexOf(".") + 1, filename.length);

export const isImage = (fileType: InternalFileType) =>
  imagesFormat.includes(fileType);

export const getCurrency = (currency: Currency = Currency.EUR) => {
  const mapper = {
    USD: "$",
    GBP: "£",
    default: "€",
  };

  const selectedCurrency = mapper[currency] || mapper["default"];

  return selectedCurrency;
};

export const getTrialFormattedPrice = (
  price: number,
  currency: Currency = Currency.EUR
) => `${getCurrency(currency)}${price / 100}`;

const SOME_INTERESTING_PRICE = 19900;

export const getAnnualFormattedPrice = (
  price: number,
  currency: Currency = Currency.EUR
) => {
  const value = (price / 100 / 12).toFixed(2);
  const curr = getCurrency(
    price === SOME_INTERESTING_PRICE ? Currency.EUR : currency
  );

  return `${curr}${value}`;
};

interface IGetPlanBullets {
  type: string;
  disabledFeatures: number[];
  t: TranslationFunction;
}

const BULLETS_LENGTH = 8;
export const getPlanBullets = ({
  type,
  disabledFeatures,
  t,
}: IGetPlanBullets) => {
  const bulletPoints = [];

  for (let i = 1; i <= BULLETS_LENGTH; i++) {
    bulletPoints.push({
      imgSrc: disabledFeatures.includes(i) ? cross : check,
      text: <span>{t(`payment_page.plans.${type}.bullet${i}`)}</span>,
    });
  }

  return bulletPoints;
};

interface IGetPlanPrices {
  type: string;
  fullPrice: number;
  trialPrice: number;
  currency: Currency;
}

export const getPlanPrices = ({
  type,
  fullPrice,
  trialPrice,
  currency,
}: IGetPlanPrices) => ({
  price:
    type !== PlanTypes.ANNUAL
      ? getAnnualFormattedPrice(fullPrice, currency)
      : getTrialFormattedPrice(trialPrice, currency),
  fullPrice: getTrialFormattedPrice(fullPrice, currency),
  formattedCurrency: getCurrency(currency),
});

export const isFromEmail = (router: NextRouter) =>
  router.query?.fromEmail === "true";
