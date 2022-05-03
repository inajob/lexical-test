import "./styles.css";
import { createEditor } from "lexical";
import { registerPlainText } from "@lexical/plain-text";
import {
  AnyColoredTextNode,
  registerTransformAnyColoredText
} from "./AnyColoredTextNode";

const editorRoot = document.getElementById("editor");

const editor = createEditor({
  nodes: [AnyColoredTextNode],
  onError: console.error
});

editor.setRootElement(editorRoot);

registerPlainText(editor);

registerTransformAnyColoredText(editor);
