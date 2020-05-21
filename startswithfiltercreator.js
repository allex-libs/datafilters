function createStartsWithFilter(execlib,StringFieldFilter){
  'use strict';
  var lib = execlib.lib;

  function StartsWithFilter(filterdescriptor){
    StringFieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(StartsWithFilter,StringFieldFilter);
  StartsWithFilter.prototype.isFieldOK = function(fieldvalue){
    var fv = this.valueForTest(fieldvalue);
    return StringFieldFilter.prototype.isFieldOK(fv) && 
      (fv.indexOf(this.fieldvalue)===0);
  };
  return StartsWithFilter;
}

module.exports = createStartsWithFilter;
