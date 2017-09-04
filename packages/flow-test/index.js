export class Test {
  /**
   * @type {number}
   * @memberof Test
   */
  bar: number;
  baz: number;

  /**
   * Creates an instance of Test.
   * @param {number} bar 
   * @memberof Test
   */
  constructor(bar: number) {
    this.bar = bar;
    this.baz = bar ** 2;
  }  
}

export default Test;