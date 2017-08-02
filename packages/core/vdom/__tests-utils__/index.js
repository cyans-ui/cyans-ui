import {
  createVContainer,
  createVElement,
} from '../h';

export const createCurrentVElement = (type, props, ...children) => {
  const element = createVElement(type, props, ...children);
  element.subTree = children;

  return element;
};

export const createCurrentVContainer = (type, props, ...children) => {
  const element = createVContainer(type, props, ...children);
  const newElementsTree = type({ ...props, children });
  element.subTree = Array.isArray(newElementsTree) ? newElementsTree : [newElementsTree];

  return element;
};

export const normaliseHtml = html =>
  (
    Array.isArray(html) ?
    html.join() :
    html
  ).replace(/\n|\s{2,}/g, '');

export const createContainer = (ContainerFactory) => {
  const next = ContainerFactory(
    createVElement,
    (type, props, ...children) =>
      createVContainer(type.next, props, ...children),
  );

  const current = ContainerFactory(
    createCurrentVElement,
    (type, props, ...children) =>
      createCurrentVContainer(type.current, props, ...children),
  );

  return {
    next,
    current,
  };
};
