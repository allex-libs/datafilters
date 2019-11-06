function createNearFilter (execlib, Filter) {
  'use strict';
  var lib = execlib.lib;

  function NearFilter(filterdescriptor) {
    Filter.call(this, filterdescriptor);
  }
  lib.inherit(NearFilter, Filter);
  NearFilter.prototype.isOK = function (record) {
    return true;
  }
  return NearFilter;
}
module.exports = createNearFilter;
