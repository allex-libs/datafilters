function createNotFilter(execlib,Filter,factory){
  'use strict';
  var lib = execlib.lib;
  function NotFilter(filterdescriptor ){
    Filter.call(this,filterdescriptor );
    if(!(filterdescriptor && 'filter' in filterdescriptor)){
      throw new Error("No filter field in filterdescriptor");
    }
    this.filter = factory.createFromDescriptor(filterdescriptor.filter);
  }
  lib.inherit(NotFilter,Filter);
  NotFilter.prototype.destroy = function(){
    this.filter.destroy();
    this.filter = null;
    Filter.prototype.destroy.call(this);
  };
  NotFilter.prototype.isOK = function(datahash){
    return !(this.filter.isOK(datahash));
  };
  return NotFilter;
}

module.exports = createNotFilter;
