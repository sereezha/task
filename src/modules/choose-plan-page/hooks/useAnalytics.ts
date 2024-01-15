import { useEffect } from "react";

export const useAnalytics = () => {
  const sendAnalytics = (...args: any) => {
    console.log(...args);
  };

  useEffect(() => {
    if (!localStorage.getItem("select_plan_view")) {
      sendAnalytics("send event analytic3");
    }

    localStorage.setItem("select_plan_view", "true");

    return () => {
      localStorage.removeItem("select_plan_view");
    };
  }, []);

  return { sendAnalytics };
};
