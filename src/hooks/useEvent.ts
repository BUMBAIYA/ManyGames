import { useEffect, RefObject } from "react";

type EventType = keyof HTMLElementEventMap;

export default function useEvent<
  T extends HTMLElement | HTMLElement,
  K extends EventType,
>(
  ref: RefObject<T> | HTMLElement,
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    const node = "current" in ref ? ref.current : ref;
    if (node) {
      node.addEventListener(eventName, handler, options);
      return () => {
        node.removeEventListener(eventName, handler, options);
      };
    }
    return;
  }, [eventName, handler, options, ref]);
}
