export const createEvent = <T extends Event>(
  element: HTMLElement | Document,
  trigger: string,
  handler: (e: T) => void,
) => {
  element.addEventListener(trigger, (e) => handler(e as T))
}