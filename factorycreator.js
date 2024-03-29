function createFilterFactory(execlib){
  'use strict';
  var lib = execlib.lib,
    Filter = require('./creator')(execlib),
    AllPass = require('./allpasscreator')(execlib,Filter);

  function Factory(){
    lib.Map.call(this);
  }
  lib.inherit(Factory,lib.Map);
  Factory.prototype.createFromDescriptor = function(filterdescriptor){
    if(!filterdescriptor){
      return new AllPass;
    }
    var op = filterdescriptor.op;
    if(!op){
      return new AllPass;
    }
    var ctor = this.get(op);
    if(!ctor){
      console.log('No Filter factory for operator "'+op+'"');
      return null;
    }
    return new ctor(filterdescriptor);
  };

  var factory = new Factory,
    HashFilter = require('./hashfiltercreator')(execlib,Filter),
    NotFilter = require('./notfiltercreator')(execlib,Filter,factory),
    BooleanFilters = require('./booleanfilterscreator')(execlib,Filter,factory),
    AndFilters = require('./andfilterscreator')(execlib,BooleanFilters),
    OrFilters = require('./orfilterscreator')(execlib,BooleanFilters),
    FieldFilter = require('./fieldfiltercreator')(execlib,Filter),
    ExistsFilter = require('./existsfiltercreator')(execlib,FieldFilter),
    NotExistsFilter = require('./notexistsfiltercreator')(execlib,FieldFilter),
    EQFilter = require('./eqfiltercreator')(execlib,FieldFilter),
    NEFilter = require('./nefiltercreator')(execlib,FieldFilter),
    GTFilter = require('./gtfiltercreator')(execlib,FieldFilter),
    GTEFilter = require('./gtefiltercreator')(execlib,FieldFilter),
    LTFilter = require('./ltfiltercreator')(execlib,FieldFilter),
    LTEFilter = require('./ltefiltercreator')(execlib,FieldFilter),
    InFilter = require('./infiltercreator')(execlib,FieldFilter),
    NinFilter = require('./ninfiltercreator')(execlib,FieldFilter),
    StringFieldFilter = require('./stringfieldfiltercreator')(execlib,FieldFilter),
    StartsWithFilter = require('./startswithfiltercreator')(execlib,StringFieldFilter),
    EndsWithFilter = require('./endswithfiltercreator')(execlib,StringFieldFilter),
    ContainsFilter = require('./containsfiltercreator')(execlib,StringFieldFilter),
    RegExFilter = require('./regexfiltercreator')(execlib,StringFieldFilter),
    NearFilter = require('./nearfiltercreator')(execlib,Filter),
    BitMaskBaseFilter = require('./bitmaskbasefiltercreator')(execlib,FieldFilter),
    BitMaskAnyFilter = require('./bitmaskanyfiltercreator')(execlib,BitMaskBaseFilter),
    BitMaskAllFilter = require('./bitmaskallfiltercreator')(execlib,BitMaskBaseFilter),
    CidrMatchFilter = require('./cidrmatchfiltercreator')(execlib,FieldFilter);

  factory.add('hash',HashFilter);
  factory.add('not',NotFilter);
  factory.add('and',AndFilters);
  factory.add('or',OrFilters);
  factory.add('exists',ExistsFilter);
  factory.add('notexists',NotExistsFilter);
  factory.add('eq',EQFilter);
  factory.add('ne',NEFilter);
  factory.add('gt',GTFilter);
  factory.add('gte',GTEFilter);
  factory.add('lt',LTFilter);
  factory.add('lte',LTEFilter);
  factory.add('in',InFilter);
  factory.add('nin',NinFilter);
  factory.add('startswith',StartsWithFilter);
  factory.add('endswith',EndsWithFilter);
  factory.add('contains',ContainsFilter);
  factory.add('near',NearFilter);
  factory.add('bitmaskany', BitMaskAnyFilter);
  factory.add('bitmaskall', BitMaskAllFilter);
  factory.add('regex', RegExFilter);
  factory.add('cidr_match', CidrMatchFilter);

  Factory.prototype.extend = function (filtername, creatorfunc) {
    var filter = creatorfunc(execlib,{
      Filter: Filter,
      AllPassFilter: AllPass,
      BooleanFilters: BooleanFilters,
      FieldFilter: FieldFilter,
      StringFieldFilter: StringFieldFilter
    });
    if (filter) {
      this.replace(filtername, filter);
    } else {
      console.log('No filter produced for',filtername,'from',creatorfunc.toString());
    }
  };
  function and2Descriptors (desc1, desc2) {
    return desc1 ? 
    {
      op: "and",
      filters: [
        desc1,
        desc2
      ]
    }
    :
    desc2;
  }
  Factory.prototype.andDescriptors = function (descarry) {
    return lib.isArray(descarry) 
    ?
    descarry.reduce(and2Descriptors, null)
    :
    descarry;
  };
  function or2Descriptors (desc1, desc2) {
    return desc1 ? 
    {
      op: "or",
      filters: [
        desc1,
        desc2
      ]
    }
    :
    desc2;
  }
  Factory.prototype.orDescriptors = function (descarry) {
    return lib.isArray(descarry)
    ?
    descarry.reduce(or2Descriptors, null)
    :
    descarry;
  }
  
  return factory;
}

module.exports = createFilterFactory;
