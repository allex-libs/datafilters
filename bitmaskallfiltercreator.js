function createBitMaskAllFilter(execlib, BitMaskBaseFilter) {
  'use strict';

  var lib = execlib.lib;

  function BitMaskAllFilter(filterdescriptor) {
    BitMaskBaseFilter.call(this,filterdescriptor);
  }
  lib.inherit(BitMaskAllFilter,BitMaskBaseFilter);
  BitMaskAllFilter.prototype.isFieldOK = function (fieldvalue) {
    return (fieldvalue&this.fieldvalue)===this.fieldvalue;
  };

  return BitMaskAllFilter;
}
module.exports = createBitMaskAllFilter;
