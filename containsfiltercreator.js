function createContainsFilter(execlib,StringFieldFilter){
  'use strict';
  var lib = execlib.lib;

  function ContainsFilter(filterdescriptor){
    StringFieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(ContainsFilter,StringFieldFilter);
  ContainsFilter.prototype.isFieldOK = function(fieldvalue){
    var fv = this.valueForTest(fieldvalue);
    return StringFieldFilter.prototype.isFieldOK(fv) && 
      (fv.indexOf(this.fieldvalue)>=0);
  };
  return ContainsFilter;
}

module.exports = createContainsFilter;
