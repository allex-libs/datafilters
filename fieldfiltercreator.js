function createFieldFilter(execlib,Filter){
  'use strict';
  var lib = execlib.lib;
  function FieldFilter(filterdescriptor){
    Filter.call(this,filterdescriptor);
    if(!filterdescriptor.hasOwnProperty('field')){
      throw "No fieldname in filterdescriptor";
    }
    this.fieldname = filterdescriptor.field;
    this.fieldvalue = filterdescriptor.value;
  }
  lib.inherit(FieldFilter,Filter);
  FieldFilter.prototype.destroy = function(){
    this.fieldname = null;
    Filter.prototype.destroy.call(this);
  };
  FieldFilter.prototype.isOK = function(value){
    var val;
    if (lib.isVal(this.fieldname)) {
      if('function' === typeof value.get){
        val = value.get(this.fieldname);
      }else{
        val = value[this.fieldname];
      }
    } else {
      val = value;
    }
    return this.isFieldOK(val);
  };
  FieldFilter.prototype.isFieldOK = function(fieldvalue){
    throw "Generic FieldFilter does not implement isFieldOK";
  };
  return FieldFilter;
};

module.exports = createFieldFilter;
