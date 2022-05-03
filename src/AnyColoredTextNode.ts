import {
  TextNode,
  EditorConfig,
  LexicalNode,
  LexicalEditor,
  NodeKey,
  $createTextNode
} from "lexical";
import { mergeRegister } from "@lexical/utils";

export class AnyColoredTextNode extends TextNode {
  private __color: string;
  constructor(color: string, text: string, key?: NodeKey) {
    super(text, key);
    this.__color = color;
  }

  static getType(): string {
    return "any-colored";
  }
  static clone(node: AnyColoredTextNode): AnyColoredTextNode {
    return new AnyColoredTextNode(node.__color, node.__text, node.__key);
  }

  getColor(): string {
    const self = this.getLatest<AnyColoredTextNode>();
    return self.__color;
  }

  setColor(color: string): void {
    const self = this.getWritable<AnyColoredTextNode>();
    self.__color = color;
  }

  createDOM(config: EditorConfig<{}>): HTMLElement {
    const element = super.createDOM(config);
    element.style.color = this.__color;
    return element;
  }
  updateDOM(
    prevNode: AnyColoredTextNode,
    dom: HTMLElement,
    config: EditorConfig<{}>
  ): boolean {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    if (prevNode.__color !== this.__color) {
      dom.style.color = this.__color;
    }
    return isUpdated;
  }
}

export function $createAnyColoredTextNode(
  color: string,
  text: string
): AnyColoredTextNode {
  return new AnyColoredTextNode(color, text);
}

export function $isAnyColoredTextNode(
  node: LexicalNode
): node is AnyColoredTextNode {
  return node instanceof AnyColoredTextNode;
}

export function registerTransformAnyColoredText(
  editor: LexicalEditor
): () => void {
  return mergeRegister(
    editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
      const text = textNode.getTextContent();
      const matched = /color:(.*)/.exec(text);
      if (matched !== null) {
        const color = matched[1];
        if (isValidColor(color)) {
          textNode.replace($createAnyColoredTextNode(color, text));
        }
      }
    }),
    editor.registerNodeTransform(
      AnyColoredTextNode,
      (node: AnyColoredTextNode) => {
        const text = node.getTextContent();
        const matched = /color:(.*)/.exec(text);
        if (matched === null) {
          node.replace($createTextNode(text));
        } else {
          const color = matched[1];
          const currentColor = node.getColor();
          if (color !== currentColor && isValidColor(color)) {
            node.setColor(color);
          }
        }
      }
    )
  );
}

// https://stackoverflow.com/questions/48484767/javascript-check-if-string-is-valid-css-color
const isValidColor = (strColor: string) => {
  const s = new Option().style;
  s.color = strColor;
  return s.color !== "";
};
