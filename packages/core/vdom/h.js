export function createVContainer(type, props = {}, ...children) {
  return {
    nodeType: 'container',
    type,
    props,
    children,
  };
}

export function createVElement(type, props = {}, ...children) {
  return {
    nodeType: 'element',
    type,
    props,
    children,
  };
}

export default function h(type, props, ...children) {
  return (typeof type === 'function' ? createVContainer : createVElement)
    .call(null, type, props, ...children);
}
