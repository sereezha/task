import { PAGE_LINKS } from "../../../constants";
import { useUser } from "../../../providers/user-provider";
import { API } from "../../../services/api";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useCheckAuth = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.subscription !== null) {
      router.push(`${PAGE_LINKS.DASHBOARD}`);
    }

    if (!user?.email) {
      router.back();

      return;
    }

    if (user?.email !== null) {
      return;
    }

    if (router.query?.token) {
      API.auth.byEmailToken(router.query.token as string);
    }
  }, [user?.subscription, user?.email, router.query?.token]);
};
