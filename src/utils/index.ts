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

export const isMobileDevice = () => {
  const isSmallScreen = window.matchMedia('(max-width: 768px)').matches
  const userAgent = navigator.userAgent || navigator.vendor
  const isMobileUA =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent,
    )
  return isSmallScreen || isMobileUA
}