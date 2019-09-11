(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function createAllPassFilter(execlib,Filter){
  'use strict';
  var lib = execlib.lib;
  function AllPass(filterdescriptor){
    Filter.call(this,filterdescriptor);
  }
  lib.inherit(AllPass,Filter);
  AllPass.prototype.isOK = function(datahash){
    return true;
  }
  return AllPass;
}

module.exports = createAllPassFilter;

},{}],2:[function(require,module,exports){
function createAndFilters(execlib,BooleanFilters){
  'use strict';
  var lib = execlib.lib;

  function AndFilters(filterdescriptor){
    BooleanFilters.call(this,filterdescriptor);
  }
  lib.inherit(AndFilters,BooleanFilters);
  AndFilters.prototype.arrayOperation = 'every';
  return AndFilters;
}

module.exports = createAndFilters;

},{}],3:[function(require,module,exports){
function createBooleanFilters(execlib,Filter,filterFactory){
  'use strict';
  var lib = execlib.lib;

  function BooleanFilters(filterdescriptor){
    Filter.call(this,filterdescriptor);
    this.filters = [];
    if(!(filterdescriptor && lib.isArray(filterdescriptor.filters))){
      throw new Error("No filters array in filterdescriptor");
    }
    filterdescriptor.filters.forEach(this.addFilter.bind(this));
  }
  lib.inherit(BooleanFilters,Filter);
  BooleanFilters.prototype.destroy = function(){
    lib.arryDestroyAll(this.filters);
    this.filters = null;
    Filter.prototype.destroy.call(this);
  };
  BooleanFilters.prototype.addFilter = function(filterdescriptor){
    this.filters.push(filterFactory.createFromDescriptor(filterdescriptor));
  };
  function isFilterOk(datahash,filter){
    var ret = filter ? filter.isOK(datahash) : false;
    filter = null;
    datahash = null;
    return ret;
  }
  BooleanFilters.prototype.isOK = function(datahash){
    var ifok = isFilterOk.bind(null,datahash);
    var ret = this.filters[this.arrayOperation](ifok);
    datahash = null;
    ifok = null;
    return ret;
  };
  return BooleanFilters;
}

module.exports = createBooleanFilters;

},{}],4:[function(require,module,exports){
ALLEX.execSuite.libRegistry.register('allex_datafilterslib',require('./factorycreator')(ALLEX));

},{"./factorycreator":10}],5:[function(require,module,exports){
function createContainsFilter(execlib,StringFieldFilter){
  'use strict';
  var lib = execlib.lib;

  function ContainsFilter(filterdescriptor){
    StringFieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(ContainsFilter,StringFieldFilter);
  ContainsFilter.prototype.isFieldOK = function(fieldvalue){
    return StringFieldFilter.prototype.isFieldOK(fieldvalue) && 
      (fieldvalue.indexOf(this.fieldvalue)>=0);
  };
  return ContainsFilter;
}

module.exports = createContainsFilter;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
function createEndsWithFilter(execlib,StringFieldFilter){
  'use strict';
  var lib = execlib.lib;

  function EndsWithFilter(filterdescriptor){
    StringFieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(EndsWithFilter,StringFieldFilter);
  EndsWithFilter.prototype.isFieldOK = function(fieldvalue){
    return StringFieldFilter.prototype.isFieldOK(fieldvalue) && 
      (fieldvalue.lastIndexOf(this.fieldvalue)===fieldvalue.length-this.fieldvalue.length);
  };
  return EndsWithFilter;
}

module.exports = createEndsWithFilter;

},{}],8:[function(require,module,exports){
function createEQFilter(execlib,FieldFilter){
  'use strict';
  var lib = execlib.lib;

  function EQFilter(filterdescriptor){
    FieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(EQFilter,FieldFilter);
  EQFilter.prototype.isFieldOK = function(fieldvalue){
    return fieldvalue===this.fieldvalue;
  };
  return EQFilter;
}

module.exports = createEQFilter;

},{}],9:[function(require,module,exports){
function createExistsFilter(execlib,FieldFilter){
  'use strict';
  var lib = execlib.lib;

  function ExistsFilter(filterdescriptor){
    FieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(ExistsFilter,FieldFilter);
  ExistsFilter.prototype.isFieldOK = function(fieldvalue){
    return (!(fieldvalue===null || typeof fieldvalue === 'undefined'));
  };
  return ExistsFilter;
}

module.exports = createExistsFilter;

},{}],10:[function(require,module,exports){
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
    StringFieldFilter = require('./stringfieldfiltercreator')(execlib,FieldFilter),
    StartsWithFilter = require('./startswithfiltercreator')(execlib,StringFieldFilter),
    EndsWithFilter = require('./endswithfiltercreator')(execlib,StringFieldFilter),
    ContainsFilter = require('./containsfiltercreator')(execlib,StringFieldFilter);

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
  factory.add('startswith',StartsWithFilter);
  factory.add('endswith',EndsWithFilter);
  factory.add('contains',ContainsFilter);

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
  
  return factory;
}

module.exports = createFilterFactory;

},{"./allpasscreator":1,"./andfilterscreator":2,"./booleanfilterscreator":3,"./containsfiltercreator":5,"./creator":6,"./endswithfiltercreator":7,"./eqfiltercreator":8,"./existsfiltercreator":9,"./fieldfiltercreator":11,"./gtefiltercreator":12,"./gtfiltercreator":13,"./hashfiltercreator":14,"./infiltercreator":15,"./ltefiltercreator":16,"./ltfiltercreator":17,"./nefiltercreator":18,"./notexistsfiltercreator":19,"./notfiltercreator":20,"./orfilterscreator":21,"./startswithfiltercreator":22,"./stringfieldfiltercreator":23}],11:[function(require,module,exports){
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
      throw new Error("No fieldname in filterdescriptor");
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
    throw new Error("Generic FieldFilter does not implement isFieldOK");
  };
  return FieldFilter;
};

module.exports = createFieldFilter;

},{}],12:[function(require,module,exports){
function createGTEFilter(execlib,FieldFilter){
  'use strict';
  var lib = execlib.lib;

  function GTEFilter(filterdescriptor){
    FieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(GTEFilter,FieldFilter);
  GTEFilter.prototype.isFieldOK = function(fieldvalue){
    return fieldvalue>=this.fieldvalue;
  };
  return GTEFilter;
}

module.exports = createGTEFilter;

},{}],13:[function(require,module,exports){
function createGTFilter(execlib,FieldFilter){
  'use strict';
  var lib = execlib.lib;

  function GTFilter(filterdescriptor){
    FieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(GTFilter,FieldFilter);
  GTFilter.prototype.isFieldOK = function(fieldvalue){
    return fieldvalue>this.fieldvalue;
  };
  return GTFilter;
}

module.exports = createGTFilter;

},{}],14:[function(require,module,exports){
function createHashFilter(execlib,Filter){
  'use strict';
  var lib = execlib.lib;

  function HashFilter(filterdescriptor){
    Filter.call(this,filterdescriptor);
    this.hash = filterdescriptor.d;
  }
  lib.inherit(HashFilter,Filter);
  HashFilter.prototype.destroy = function(){
    this.hash = null;
  };
  HashFilter.prototype.isOK = function(record){
    return record.matches(this.hash);
  };
  return HashFilter;
}

module.exports = createHashFilter;


},{}],15:[function(require,module,exports){
function createInFilter(execlib,FieldFilter){
  'use strict';
  var lib = execlib.lib;

  function InFilter(filterdescriptor){
    FieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(InFilter,FieldFilter);
  InFilter.prototype.isFieldOK = function(fieldvalue){
    if (!lib.isArray(this.fieldvalue)) {
      throw new Error('Value for "in" filter needs to be an array');
    }
    return this.fieldvalue.indexOf(fieldvalue) >= 0;
  };
  return InFilter;
}

module.exports = createInFilter;

},{}],16:[function(require,module,exports){
function createLTEFilter(execlib,FieldFilter){
  'use strict';
  var lib = execlib.lib;

  function LTEFilter(filterdescriptor){
    FieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(LTEFilter,FieldFilter);
  LTEFilter.prototype.isFieldOK = function(fieldvalue){
    return fieldvalue<=this.fieldvalue;
  };
  return LTEFilter;
}

module.exports = createLTEFilter;

},{}],17:[function(require,module,exports){
function createLTFilter(execlib,FieldFilter){
  'use strict';
  var lib = execlib.lib;

  function LTFilter(filterdescriptor){
    FieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(LTFilter,FieldFilter);
  LTFilter.prototype.isFieldOK = function(fieldvalue){
    return fieldvalue<this.fieldvalue;
  };
  return LTFilter;
}

module.exports = createLTFilter;

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
function createNotExistsFilter(execlib,FieldFilter){
  'use strict';
  var lib = execlib.lib;

  function NotExistsFilter(filterdescriptor){
    FieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(NotExistsFilter,FieldFilter);
  NotExistsFilter.prototype.isFieldOK = function(fieldvalue){
    return fieldvalue===null || typeof fieldvalue === 'undefined';
  };
  return NotExistsFilter;
}

module.exports = createNotExistsFilter;


},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
function createOrFilters(execlib,BooleanFilters){
  'use strict';
  var lib = execlib.lib;

  function OrFilters(filterdescriptor){
    BooleanFilters.call(this,filterdescriptor);
  }
  lib.inherit(OrFilters,BooleanFilters);
  OrFilters.prototype.arrayOperation = 'some';
  return OrFilters;
}

module.exports = createOrFilters;

},{}],22:[function(require,module,exports){
function createStartsWithFilter(execlib,StringFieldFilter){
  'use strict';
  var lib = execlib.lib;

  function StartsWithFilter(filterdescriptor){
    StringFieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(StartsWithFilter,StringFieldFilter);
  StartsWithFilter.prototype.isFieldOK = function(fieldvalue){
    return StringFieldFilter.prototype.isFieldOK(fieldvalue) && 
      (fieldvalue.indexOf(this.fieldvalue)===0);
  };
  return StartsWithFilter;
}

module.exports = createStartsWithFilter;

},{}],23:[function(require,module,exports){
function createStringFieldFilter(execlib,FieldFilter){
  'use strict';
  var lib = execlib.lib;

  function StringFieldFilter(filterdescriptor){
    FieldFilter.call(this,filterdescriptor);
  }
  lib.inherit(StringFieldFilter,FieldFilter);
  StringFieldFilter.prototype.isFieldOK = function(fieldvalue){
    return lib.isString(fieldvalue);
  };
  return StringFieldFilter;
}

module.exports = createStringFieldFilter;

},{}]},{},[4]);
