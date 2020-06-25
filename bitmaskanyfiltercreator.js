function createBitMaskAnyFilter(execlib, BitMaskBaseFilter) {
  'use strict';

  var lib = execlib.lib;

  function BitMaskAnyFilter(filterdescriptor) {
    BitMaskBaseFilter.call(this,filterdescriptor);
  }
  lib.inherit(BitMaskAnyFilter,BitMaskBaseFilter);
  BitMaskAnyFilter.prototype.isFieldOK = function (fieldvalue) {
    return (fieldvalue&this.fieldvalue)!=0;
  };

  return BitMaskAnyFilter;
}
module.exports = createBitMaskAnyFilter;
