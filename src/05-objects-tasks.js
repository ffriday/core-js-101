/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const params = JSON.parse(json);
  const obj = Object.create(proto);
  Object.assign(obj, params);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  pref: {
    element: ['', '', 1],
    id: ['#', '', 2],
    class: ['.', '', 3],
    attr: ['[', ']', 4],
    pseudoClass: [':', '', 5],
    pseudoElement: ['::', '', 6],
  },

  arr: [],

  e1: 'Element, id and pseudo-element should not occur more then one time inside the selector',
  e2: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',

  copy() {
    const obj = { ...this };
    obj.arr = obj.arr.map((value) => ({ ...value }));
    return obj;
  },

  errorCheck(elType) {
    if (elType === 'element' || elType === 'id' || elType === 'pseudoElement') {
      if (this.arr.filter((value) => value.type === elType).length) {
        throw new Error(this.e1);
      }
    }
    if (this.arr.length > 0 && this.arr[this.arr.length - 1].delim[2] > this.pref[elType][2]) {
      throw new Error(this.e2);
    }
  },

  add(type, value) {
    const obj = this.copy();
    this.errorCheck(type);
    obj.arr.push({ type, value, delim: this.pref[type] });
    return obj;
  },

  element(value) {
    return this.add('element', value);
  },

  id(value) {
    return this.add('id', value);
  },

  class(value) {
    return this.add('class', value);
  },

  attr(value) {
    return this.add('attr', value);
  },

  pseudoClass(value) {
    return this.add('pseudoClass', value);
  },

  pseudoElement(value) {
    return this.add('pseudoElement', value);
  },

  combine(selector1, combinator, selector2) {
    const obj = selector1.copy();
    obj.arr.push({ type: 'combine', value: combinator, delim: [' ', ' '] });
    obj.arr = obj.arr.concat(selector2.arr);
    return obj;
  },

  stringify() {
    return this.arr.reduce((acc, value) => {
      acc.push(`${value.delim[0]}${value.value}${value.delim[1]}`);
      return acc;
    }, []).join('');
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
