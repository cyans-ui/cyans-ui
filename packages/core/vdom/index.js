import batchUpdates from './batchUpdates';

// export function createElement(node) {
//   if (typeof node.isNode === 'undefined') {
//     return document.createTextNode(node.toString());
//   }

//   const $el = document.createElement(node.type);
//   setProps($el, node.props);

//   if (node.props.ref && typeof node.props.ref === 'function') {
//     node.props.ref($el);
//   }

//   const parsedChildren = [];
//   const loop = (children) => children.forEach(child => {
//     if (Array.isArray(child)) {
//       return loop(child);
//     }

//     $el.appendChild(createElement(child));
//     parsedChildren.push(child);
//   });

//   loop(node.children);
//   node.children = parsedChildren;

//   if (node.props.onCreated) {
//     node.props.onCreated($el);
//   }

//   return $el;
// }

// export function batchUpdate($parent, newNode, oldNode, index = 0) {
//   if (oldNode === undefined) {
//     $parent.appendChild(
//       createElement(newNode),
//     );
//   } else if (newNode === undefined) {
//     $parent.removeChild(
//       $parent.childNodes[index],
//     );
//   } else if (changed(newNode, oldNode)) {
//     $parent.replaceChild(
//       createElement(newNode),
//       $parent.childNodes[index],
//     );
//   } else {
//     if (newNode.isNode) {
//       if (
//         newNode.props.shouldUpdate &&
//         !newNode.props.shouldUpdate(oldNode.props || newNode.props, newNode.props)
//       ) {
//         return;
//       }

//       updateProps(
//         $parent.childNodes[index],
//         newNode.props || {},
//         oldNode.props || {},
//       );
//     }

//     let loopCounter = 0;
//     const parsedChildren = [];
//     const parseChild = (newNodeChild, oldNodeChildren) => {
//       if (Array.isArray(newNodeChild)) {
//         newNodeChild.forEach(child => parseChild(child, oldNodeChildren));
//         return;
//       }

//       parsedChildren.push(newNodeChild);
//       batchUpdate(
//         $parent.childNodes[index],
//         newNodeChild,
//         oldNodeChildren[loopCounter],
//         loopCounter,
//       );

//       loopCounter += 1;
//     };

//     while (loopCounter < newNode.children.length || loopCounter < oldNode.children.length) {
//       parseChild(newNode.children[loopCounter], oldNode.children);
//     }

//     newNode.children = parsedChildren;

//     if (newNode.props.onUpdated) {
//       newNode.props.onUpdated(oldNode.props || newNode.props, newNode.props);
//     }
//   }
// }

// ------------------------------------------------------------------

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
