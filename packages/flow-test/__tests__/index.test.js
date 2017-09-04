// @flow

import Test from '../index';

test('should be 5', () => {
  expect(() => new Test(5)).not.toThrow();

  let instance: Test = new Test(5);
  
  expect(instance.bar).toBe(5);
});
