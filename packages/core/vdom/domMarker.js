/* eslint-disable no-param-reassign */

function getNextSibling(node) {
  const nextSibling = node && node.nextSibling;
  return nextSibling !== null ? nextSibling : undefined;
}

export function createDomMarker(parent, cursor) {
  const evaluatedCursor = cursor || parent.childNodes[0];
  return {
    parent,
    cursor: evaluatedCursor,
    nextCursor: getNextSibling(evaluatedCursor),
  };
}

export function shiftCursor(domMarker) {
  domMarker.cursor = domMarker.nextCursor;
  domMarker.nextCursor = getNextSibling(domMarker.cursor);
}
