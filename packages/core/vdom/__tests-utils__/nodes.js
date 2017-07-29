import {
  createVElement,
} from '../h';

export const createOldVElement = (type, props, ...children) => {
  const element = createVElement(type, props, ...children);
  element.subTree = children;

  return element;
};
