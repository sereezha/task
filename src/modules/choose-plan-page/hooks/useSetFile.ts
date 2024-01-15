import { API } from "../../../services/api";
import { ApiFile } from "../../../services/api/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useSetFile = () => {
  const router = useRouter();
  const [file, setFile] = useState<ApiFile>();

  useEffect(() => {
    const handler = async () => {
      try {
        const { files } = await API.files.getFiles();
        let chosenFile = null;
        if (router.query?.file) {
          chosenFile = files.find((item) => item.id === router.query!.file);
        }

        setFile(chosenFile || files[files.length - 1]);
      } catch (e) {
        console.log(e);
        throw new Error(e);
      }
    };

    handler();
  }, []);

  return file;
};
