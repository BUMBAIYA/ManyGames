import { useMemo } from "react";

type dictionaryAPIResponse =
  | {
      word: string;
      meanings: {
        definitions: {
          definition: string;
        }[];
      }[];
    }[]
  | undefined;

export type isWordValid = {
  word: string;
  definition: string;
} | null;

export const useDictionaryApi = () => {
  const dictionaryapi = useMemo(
    () => ({
      isWordValid(word: string): Promise<isWordValid> {
        return new Promise(async (reslove) => {
          if (word === "" || word === null) {
            reslove(null);
            throw new Error(
              "isWordValid: paramer word is possibly empty or null"
            );
          }
          try {
            const data: dictionaryAPIResponse = await fetch(
              `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
            ).then((res) => res.json());
            if (data === undefined) {
              reslove(null);
            } else {
              reslove({
                word,
                definition: data[0].meanings[0].definitions[0].definition,
              });
            }
          } catch (error) {
            reslove(null);
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
            throw new Error(
              "Unable to load word-bank file check internet connection"
            );
          }
        });
      },
    }),
    []
  );

  return dictionaryapi;
};
