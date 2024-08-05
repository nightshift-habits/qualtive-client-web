const svgElements = ["svg", "g", "path", "rect"]

function renderJSX(tag, props, _key) {
  const element = svgElements.includes(tag)
    ? document.createElementNS("http://www.w3.org/2000/svg", tag)
    : document.createElement(tag)
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (value === null || value === undefined) return

      if (key == "children") {
        jsxAppendChild(value, element)
      } else {
        if (typeof value === "boolean") {
          if (value === true) {
            element.setAttribute(key, "")
          }
        } else {
          element.setAttribute(key, value.toString())
        }
      }
    })
  }
  return element
}

function jsxAppendChild(value, element) {
  if (value === null || value === undefined) return

  if (Array.isArray(value)) {
    value.forEach((x) => jsxAppendChild(x, element))
  } else if (typeof value === "string" || typeof value === "number") {
    element.appendChild(jsxMapToNode(value))
  } else if (value instanceof Node) {
    element.appendChild(value)
  } else if (typeof value === "boolean") {
    // no-op
  } else {
    element.appendChild(value())
  }
}

function jsxMapToNode(value) {
  if (value === null || value === undefined) return null
  if (typeof value === "string" || typeof value === "number") {
    return document.createTextNode(value)
  }
  if (value instanceof Node) {
    return value
  }
  return jsxMapToNode(value())
}

export const jsx = renderJSX
export const jsxs = renderJSX
export const jsxDEV = renderJSX
