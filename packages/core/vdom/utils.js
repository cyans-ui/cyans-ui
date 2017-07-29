export function changed(node1, node2) {
  return typeof node1 !== typeof node2 ||
         (typeof node1 === 'string' && node1 !== node2) ||
         (!node1.isNode && node1 !== node2) ||
         node1.type !== node2.type ||
         (node1.props && node1.props.forceUpdate);
}

export function extractEventName(name) {
  return name.slice(2).toLowerCase();
}

export function isEventProp(name) {
  return /^on/.test(name);
}

export function isCustomProp(name) {
  return (
    name ===
    'forceUpdate' ||
    name === 'shouldUpdate' ||
    name === 'onCreated' ||
    name === 'onUpdated'
  );
}
