function createEndsWithFilter(execlib,StringFieldFilter){
  'use strict';
  var lib = execlib.lib;

  function EndsWithFilter(filterdescriptor){
    StringFieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(EndsWithFilter,StringFieldFilter);
  EndsWithFilter.prototype.isFieldOK = function(fieldvalue){
    var fv = this.valueForTest(fieldvalue);
    return StringFieldFilter.prototype.isFieldOK(fv) && 
      (fv.lastIndexOf(this.fieldvalue)===fv.length-this.fieldvalue.length);
  };
  return EndsWithFilter;
}

module.exports = createEndsWithFilter;
