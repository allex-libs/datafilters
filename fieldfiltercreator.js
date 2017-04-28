function createFieldFilter(execlib,Filter){
  'use strict';
  var lib = execlib.lib;

  function getter (value, fieldname) {
    if(lib.isFunction(value.get)){
      return value.get(fieldname);
    }else{
      return value[fieldname];
    }
  }

  function arrygetter (value, fields) {
    var l = fields.length, ret = value, i;
    for (i=0; i<l && lib.isVal(ret); i++) {
      ret = getter(ret, fields[i]);
    }
    return ret;
  }

  function checkForDotFieldName (filter) {
    if (lib.isString(filter.fieldname) && filter.fieldname.indexOf('.') > 0) {
      filter.fieldname = filter.fieldname.split('.');
      filter.getter = arrygetter;
    }
  }

  function FieldFilter(filterdescriptor){
    Filter.call(this,filterdescriptor);
    if(!filterdescriptor.hasOwnProperty('field')){
      throw "No fieldname in filterdescriptor";
    }
    this.fieldname = filterdescriptor.field;
    this.fieldvalue = filterdescriptor.value;
    this.getter = getter;
    checkForDotFieldName(this);
  }
  lib.inherit(FieldFilter,Filter);
  FieldFilter.prototype.destroy = function(){
    this.getter = null;
    this.fieldvalue = null;
    this.fieldname = null;
    Filter.prototype.destroy.call(this);
  };
  FieldFilter.prototype.isOK = function(value){
    var val;
    if (lib.isVal(this.fieldname)) {
      val = this.getter(value, this.fieldname);
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
