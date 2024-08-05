export type JSXNode = (() => JSXNode) | number | string | null | undefined
export interface JSXChildren {
  children?: JSXNode | JSXNode[] | undefined
}

type E = Element

type Props = { [key: string]: string | boolean | number | null | undefined } & JSXChildren

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: Props
  }
  type Element = E
}
