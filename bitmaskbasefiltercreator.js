function createBitMaskBaskBaseFilter(execlib, FieldFilter) {
  'use strict';

  var lib = execlib.lib;

  function conditionallyadd(number, power) {
    var test;
    if ((Math.round(power) != power) || (power<0) || (power>31)) {
      throw new Error('bit positions in the array must be integers in the range [0,31]');
    }
    test = (1<<power);
    if (number&test) {
      return number;
    }
    return number+test;
  }

  function arry2bitmask(arry) {
    var ret = 0, i;
    for(i=0; i<arry.length; i++){
      ret = conditionallyadd(ret,arry[i]);
    }
    return ret;
  }

  function BitMaskBaseFilter(filterdescriptor) {
    FieldFilter.call(this,filterdescriptor);
    if (lib.isArray(this.fieldvalue)) {
      this.fieldvalue = arry2bitmask(this.fieldvalue);
    }
  }
  lib.inherit(BitMaskBaseFilter, FieldFilter);

  return BitMaskBaseFilter;
}
module.exports = createBitMaskBaskBaseFilter;
