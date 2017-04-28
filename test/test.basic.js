var caseIt = require('./lib/caserunner');
var cases = [{
  filter: {
    op: 'exists',
    field: 'a'
  },
  success: [{
    a: 5,
    b: 'blah'
  }],
  fail: [{
  },{
    b: 8
  }]
},{
  filter: {
    op: 'notexists',
    field: 'c'
  },
  success: [{
  }],
  fail: [{
    c: 1
  },{
    c: 2
  }]
},{
  filter: {
    op: 'eq',
    field: 'a',
    value: '5'
  },
  success: [{
    a: '5'
  }],
  fail: [{
    a: 5
  },{
    a: 4
  }]
},{
  filter: {
    op: 'ne',
    field: 'a',
    value: 5
  },
  success: [{
    a: '5'
  }],
  fail: [{
    a: 5
  }]
},{
  filter: {
    op: 'in',
    field: 'id',
    value: [5, 6, 7, 8]
  },
  success: [{
    id: 5
  },{
    id: 6
  },{
    id: 7
  },{
    id: 8
  }],
  fail: [{
    id: 9
  }]
}];

describe ('Basic tests', function () {
  setGlobal('factory', require('..')(execlib));
  cases.forEach(caseIt);
});
