import { PaymentPlanId } from '../../use-cases/get-subscription-products';
import { InternalFileType } from './constants';

export type Bullets = {
  imgSrc: string;
  checked: boolean;
  text: JSX.Element;
};

export interface Plan {
  id: PaymentPlanId;
  title: string;
  price: string;
  date: string | null;
  bullets: Bullets[];
  bulletsC?: Bullets[];
  text: string | JSX.Element;
  formattedCurrency?: string;
  fullPrice?: string;
}

export interface IPaymentPageInteractor {
  selectedPlan: PaymentPlanId;
  onSelectPlan: (plan: PaymentPlanId) => void;
  onContinue: (place?: string) => void;
  onCommentsFlip: () => void;

  imagePDF: Blob | null;
  isImageLoading: boolean;
  fileType: InternalFileType | null;
  fileLink: string | null;

  isEditorFlow: boolean;
  isSecondEmail: boolean;
  isThirdEmail: boolean;

  isRemoteConfigLoading: boolean;
  fileName: string | null;

  getPlans: (t: (key: string) => string) => Plan[];
  isPlansLoading: boolean;
}

export type TranslationFunction = (
  key: string,
  options?: Record<string, any>
) => string;
