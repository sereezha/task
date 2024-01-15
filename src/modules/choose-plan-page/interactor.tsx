import { useRemoteConfig } from "../../providers/remote-config-provider";
import { isFromEmail } from "./helpers";
import { useCheckAuth } from "./hooks/useCheckAuth";
import { useImageCover } from "./hooks/useImageCover";
import { usePlans } from "./hooks/usePlans";
import { useSetFile } from "./hooks/useSetFile";
import { IPaymentPageInteractor } from "./types";
import { useRouter } from "next/router";

export const usePaymentPageInteractor = (): IPaymentPageInteractor => {
  const router = useRouter();
  const { file, fileName, fileType } = useSetFile();
  const { isImageLoading, fileLink, imagePDF } = useImageCover(file);
  const { isRemoteConfigLoading } = useRemoteConfig();
  const {
    getPlans,
    selectedPlan,
    onSelectPlan,
    onContinue,
    onCommentsFlip,
    isPlansLoading,
  } = usePlans();
  useCheckAuth();

  const isCameFromEmail = isFromEmail(router);
  const isEditorFlow =
    (router.query?.source === "editor" || router.query?.source === "account") &&
    router.query.convertedFrom === undefined;

  return {
    selectedPlan,
    onSelectPlan,
    onContinue,
    onCommentsFlip,

    imagePDF,
    isImageLoading,
    fileName,
    fileType,
    fileLink,
    isEditorFlow,
    isSecondEmail: isCameFromEmail,
    isThirdEmail: isCameFromEmail,

    isRemoteConfigLoading,

    getPlans,
    isPlansLoading,
  };
};
