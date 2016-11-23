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
  FieldFilter.prototype.isOK = function(datahash){
    if (!datahash) return false; //whatever question is, id datahash is null, there is no way to determine correct answer ...
    //makes no sense to test for presence of this.fieldname in datahash
    if('function' === typeof datahash.get){
      return this.isFieldOK(datahash.get(this.fieldname));
    }else{
      return this.isFieldOK(datahash[this.fieldname]);
    }
  };
  FieldFilter.prototype.isFieldOK = function(fieldvalue){
    throw "Generic FieldFilter does not implement isFieldOK";
  };
  return FieldFilter;
};

module.exports = createFieldFilter;
