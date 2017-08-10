import {
  isEventProp,
  isCustomProp,
} from './utils';

import {
  removeEventListener,
  addEventListener,
} from './events';

export function removeBooleanProp(target, name) {
  target.removeAttribute(name);
}

export function setBooleanProp(target, name, value) {
  if (value) {
    target.setAttribute(name, value);
  } else {
    removeBooleanProp(target, name);
  }
}

export function setProp(target, name, value) {
  if (name === 'className') {
    target.setAttribute('class', value);
  } else if (typeof value === 'boolean') {
    setBooleanProp(target, name, value);
  } else {
    target.setAttribute(name, value);
  }
}

export function removeProp(target, name, value) {
  if (name === 'className') {
    target.removeAttribute('class');
  } else if (typeof value === 'boolean') {
    removeBooleanProp(target, name);
  } else {
    target.removeAttribute(name);
  }
}

export function updateProp(target, name, newVal, oldVal) {
  if (isEventProp(name)) {
    if (newVal === undefined || newVal !== oldVal) {
      removeEventListener(target, name, oldVal);
    }

    if (newVal !== undefined) {
      addEventListener(target, name, newVal);
    }
  } else if (newVal === undefined) {
    removeProp(target, name, oldVal);
  } else {
    setProp(target, name, newVal);
  }
}

export function setProps(target, props = {}) {
  Object.keys(props).forEach((name) => {
    if (!isCustomProp(name)) {
      updateProp(target, name, props[name]);
    }
  });
}

export function updateProps(target, newProps = {}, oldProps = {}) {
  const props = { ...oldProps, ...newProps };
  Object.keys(props).forEach((name) => {
    if (!isCustomProp(name)) {
      updateProp(target, name, newProps[name], oldProps[name]);
    }
  });
}

export function havePropsChanged(oldProps = {}, newProps = {}) {
  let shallowEquality = false;
  Object.keys(oldProps).forEach((key) => {
    if (
      Object.prototype.hasOwnProperty.call(oldProps, key) &&
      !isCustomProp(key)
    ) {
      if (oldProps[key] !== newProps[key]) {
        shallowEquality = true;
      }
    }
  });

  return shallowEquality;
}
