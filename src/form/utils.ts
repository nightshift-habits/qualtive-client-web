export function createElement(
  tagName: string,
  attributes?: { [key: string]: string },
  childrenOrTextContent?: Element[] | string,
): HTMLElement {
  const element = document.createElement(tagName)
  if (attributes) {
    setAttributes(element, attributes)
  }
  if (childrenOrTextContent) {
    if (Array.isArray(childrenOrTextContent)) {
      childrenOrTextContent?.forEach((child) => element.appendChild(child))
    } else {
      element.textContent = childrenOrTextContent
    }
  }
  return element
}
export function createSVGElement(
  tagName: string,
  attributes: { [key: string]: string },
  children?: Element[],
): SVGElement {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tagName)
  setAttributes(element, attributes)
  children?.forEach((child) => element.appendChild(child))
  return element
}
function setAttributes(element: Element, attributes: { [key: string]: string }) {
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
}
