export type JSXNode = (() => JSXNode) | number | string | boolean | null | undefined | Element | JSXNode[]
export interface JSXChildren {
  children?: JSXNode | JSXNode[] | undefined
}

type E = Element

type Props = {
  children?: JSXNode | JSXNode[]
  [key: string]: string | boolean | number | null | undefined | JSXNode | JSXNode[]
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: Props
  }
  type Element = E
}
