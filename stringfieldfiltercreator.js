function createStringFieldFilter(execlib,FieldFilter){
  'use strict';
  var lib = execlib.lib;

  function StringFieldFilter(filterdescriptor){
    FieldFilter.call(this,filterdescriptor);
    this.caseinsensitive = filterdescriptor.caseinsensitive;
    this.fieldvalue = this.valueForTest(this.fieldvalue);
  }
  lib.inherit(StringFieldFilter,FieldFilter);
  StringFieldFilter.prototype.destroy = function () {
    this.caseinsensitive = null;
    FieldFilter.prototype.destroy.call(this);
  };
  StringFieldFilter.prototype.isFieldOK = function(fieldvalue){
    return lib.isString(fieldvalue);
  };
  StringFieldFilter.prototype.valueForTest = function (val) {
    if (!lib.isString(val)) {
      return null;
    }
    return this.caseinsensitive ? val.toLowerCase() : val;
  };
  return StringFieldFilter;
}

module.exports = createStringFieldFilter;
