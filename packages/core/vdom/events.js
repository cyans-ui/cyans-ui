import {
  extractEventName,
} from './utils';

export function addEventListener($target, event, listener) {
  $target.addEventListener(
    extractEventName(event),
    listener,
  );
}

export function removeEventListener($target, event, listener) {
  $target.addEventListener(
    extractEventName(event),
    listener,
  );
}

