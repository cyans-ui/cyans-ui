import batchUpdates from './batchUpdates';

export function createRenderPlaceholder(vNode, container) {
  return {
    vNode,
    container,
    diff: function diff() {
      this.vNode = batchUpdates(vNode, this.vNode, container);
    },
  };
}

export function render(vNode, container) {
  const parsedVNode = batchUpdates(container, vNode);
  return createRenderPlaceholder(parsedVNode, container);
}
