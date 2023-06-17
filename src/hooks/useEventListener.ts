import { RefObject, useEffect, useRef } from "react";

function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement,
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element?: RefObject<T> | HTMLElement,
  options?: boolean | AddEventListenerOptions,
): void;

function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions,
): void;

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  T extends HTMLElement,
>(
  eventName: KW | KH,
  handler: (
    event: HTMLElementEventMap[KH] | WindowEventMap[KW] | Event,
  ) => void,
  element?: RefObject<T> | HTMLElement,
  options?: boolean | AddEventListenerOptions,
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement: T | Window | HTMLElement =
      element instanceof HTMLElement ? element : element?.current ?? window;

    if (!(targetElement && targetElement?.addEventListener)) return;

    const listener: typeof handler = (event) => savedHandler.current(event);

    targetElement.addEventListener(eventName, listener, options);

    return () => {
      targetElement?.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}

export { useEventListener };
