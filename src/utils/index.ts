export const createEvent = <T extends Event>(
  element: HTMLElement | Document,
  trigger: string,
  handler: (e: T) => void,
) => {
  element.addEventListener(trigger, (e) => handler(e as T))
}

export const hideElements = (elements: NodeListOf<HTMLElement>) => {
  Array.from(elements).forEach((element) => {
    element.classList.add('hide')
  })
}
export const showElements = (elements: NodeListOf<HTMLElement>) => {
  Array.from(elements).forEach((element) => {
    element.classList.remove('hide')
  })
}
