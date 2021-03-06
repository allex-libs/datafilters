function createFilter(execlib){
  'use strict';
  function Filter(filterdescriptor){
    this.__descriptor = filterdescriptor;
  }
  Filter.prototype.destroy = function(){
    this.__descriptor = null;
  };
  Filter.prototype.isOK = function(datahash){
    throw new Error("Generic filter does not implement isOK");
  };
  Filter.prototype.descriptor = function(){
    return this.__descriptor;
  };
  return Filter;
}

module.exports = createFilter;
