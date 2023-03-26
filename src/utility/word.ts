import { useMemo } from "react";

export const useDictionaryApi = () => {
  const dictionaryapi = useMemo(
    () => ({
      isWordValid(word: string): Promise<boolean> {
        return new Promise(async (reslove) => {
          if (word === "" || word === null) {
            reslove(false);
            throw new Error(
              "isWordValid: paramer word is possibly empty or null"
            );
          }
          try {
            const data = await fetch(
              `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
            ).then((res) => res.json());
            if (data[0] === undefined) {
              reslove(false);
            } else {
              reslove(true);
            }
          } catch (error) {
            reslove(false);
            console.warn(`Unable to fing word: ${word}`);
          }
        });
      },
      generateWord(): Promise<string> {
        return new Promise(async (resolve) => {
          try {
            await fetch("/assets/wordle-bank.txt")
              .then((response) => response.text())
              .then((result) => {
                const wordArr = result.split("\n");
                let todaysWord =
                  wordArr[Math.floor(Math.random() * wordArr.length)];
                resolve(todaysWord);
              });
          } catch (error) {
            resolve("hello");
            console.error("Unable to fetch wordle bank");
          }
        });
      },
    }),
    []
  );

  return dictionaryapi;
};
