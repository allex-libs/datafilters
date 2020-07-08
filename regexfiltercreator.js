function createRegExFilter(execlib,StringFieldFilter){
  'use strict';
  var lib = execlib.lib;

  function RegExFilter(filterdescriptor){
    this.flags = filterdescriptor ? filterdescriptor.flags : '';
    StringFieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(RegExFilter,StringFieldFilter);
  RegExFilter.prototype.destroy = function () {
    StringFieldFilter.prototype.destroy.call(this);
    this.flags = null;
  };
  RegExFilter.prototype.valueForTest = function (value) {
    return new RegExp(value, this.flags);
  }
  RegExFilter.prototype.isFieldOK = function(fieldvalue){
    return StringFieldFilter.prototype.isFieldOK(fieldvalue) && 
      this.fieldvalue.test(fieldvalue);
  };
  return RegExFilter;
}

module.exports = createRegExFilter;
