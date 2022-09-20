function createCidrMatchFilter(execlib,FieldFilter) {
  'use strict';
  var lib = execlib.lib;

  function CidrMatchFilter(filterdescriptor) {
    FieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(CidrMatchFilter,FieldFilter);
  CidrMatchFilter.prototype.isFieldOK = function (fieldvalue) {
    var ret;
    if (!lib.isString(fieldvalue)) {
      return false;
    }
    if (lib.isArray(this.fieldvalue)) {
      ret = this.fieldvalue.some(match.bind(null, fieldvalue));
      fieldvalue = null;
      return ret;
    }
    return match(this.fieldvalue, fieldvalue);
  };

  function match (range, ip) {
    return lib.cidrMatch(range, ip);
  }
  return CidrMatchFilter;
}
module.exports = createCidrMatchFilter;