function createNEFilter(execlib,FieldFilter){
  'use strict';
  var lib = execlib.lib;

  function NEFilter(filterdescriptor){
    FieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(NEFilter,FieldFilter);
  NEFilter.prototype.isFieldOK = function(fieldvalue){
    return fieldvalue!==this.fieldvalue;
  };
  return NEFilter;
}

module.exports = createNEFilter;
