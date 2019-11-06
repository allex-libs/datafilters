function createNinFilter(execlib,FieldFilter){
  'use strict';
  var lib = execlib.lib;

  function NinFilter(filterdescriptor){
    FieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(NinFilter,FieldFilter);
  NinFilter.prototype.isFieldOK = function(fieldvalue){
    if (!lib.isArray(this.fieldvalue)) {
      throw new Error('Value for "in" filter needs to be an array');
    }
    return this.fieldvalue.indexOf(fieldvalue) < 0;
  };
  return NinFilter;
}

module.exports = createNinFilter;
