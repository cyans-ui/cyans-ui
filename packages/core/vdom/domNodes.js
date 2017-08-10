import {
  setProps,
} from './props';

export function createTextDomNode(text) {
  return document.createTextNode(text.toString());
}

export function createDomNode(node) {
  const domElement = document.createElement(node.type);
  setProps(domElement, node.props);

  return domElement;
}
