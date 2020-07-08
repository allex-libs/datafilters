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
},{
  filter: {
    op: 'contains',
    field: 'id',
    value: 'nd'
  },
  success: [{
    id: 'Andra'
  },{
    id: 'India'
  },{
    id: 'nd56'
  },{
    id: '78nd'
  }],
  fail: [{
    id: 'aNdra'
  },{
    id: 'InDia'
  }]
},{
  title: 'contains case insensitive',
  filter: {
    caseinsensitive: true,
    op: 'contains',
    field: 'id',
    value: 'nd'
  },
  success: [{
    id: 'Andra'
  },{
    id: 'India'
  },{
    id: 'aNdra'
  },{
    id: 'InDia'
  },{
    id: 'Nd56'
  },{
    id: '78nD'
  }],
  fail: [{
    id: 'Nesto'
  }]
},{
  filter: {
    op: 'startswith',
    field: 'id',
    value: 'Pa'
  },
  success: [{
    id: 'Pasadena'
  }],
  fail: [{
    id: 'PAR'
  },{
    id: 'pA78'
  },{
    id: 'rPa'
  },{
    id: 'rpA353'
  }]
},{
  title: 'startswith case insensitive',
  filter: {
    caseinsensitive: true,
    op: 'startswith',
    field: 'id',
    value: 'Pa'
  },
  success: [{
    id: 'Pasadena'
  },{
    id: 'PAR'
  },{
    id: 'pA78'
  }],
  fail: [{
    id: 'rpA353'
  },{
    id: 'rPa'
  }]
},{
  filter: {
    op: 'endswith',
    field: 'id',
    value: 'b7E'
  },
  success: [{
    id: 'Viewb7E'
  }],
  fail: [{
    id: 'ViewB7E'
  },{
    id: 'Ab7E?'
  },{
    id: 'b7EK'
  }]
},{
  title: 'endswith case insensitive',
  filter: {
    caseinsensitive: true,
    op: 'endswith',
    field: 'id',
    value: 'b7E'
  },
  success: [{
    id: 'Viewb7E'
  },{
    id: 'ViewB7E'
  },{
    id: '668b7e'
  }],
  fail: [{
    id: 'Ab7E?'
  },{
    id: 'b7EK'
  }]
},{
  title: 'regex with ^',
  filter: {
    op: 'regex',
    field: 'id',
    value: '^What'
  },
  success: [{
    id: 'What'
  },{
    id: 'What the'
  },{
    id: 'What the *'
  }],
  fail: [{
    id: 'So What'
  }]
},{
  title: 'regex with $',
  filter: {
    op: 'regex',
    field: 'id',
    value: 'What$'
  },
  success: [{
    id: 'So What'
  }],
  fail: [{
    id: 'What?'
  },{
    id: 'What the'
  },{
    id: 'What the *'
  }]
},{
  title: 'regex with i',
  filter: {
    op: 'regex',
    field: 'id',
    value: 'What$',
    flags: 'i'
  },
  success: [{
    id: 'So What'
  },{
    id: 'what'
  },{
    id: 'wHAt'
  },{
    id: '3 235 lsf whaT'
  }],
  fail: [{
    id: 'What?'
  },{
    id: 'What the'
  },{
    id: 'What the *'
  }]
},{
  title: 'bitmaskany',
  filter: {
    op: 'bitmaskany',
    field: 'id',
    value: 3
  },
  success: [{
    id: 1
  },{
    id: 2
  },{
    id: 3
  },{
    id: 5
  }],
  fail: [{
    id: 4
  },{
    id: 8
  }]
},{
  title: 'bitmaskany from Array',
  filter: {
    op: 'bitmaskany',
    field: 'id',
    value: [0, 1, 1], //numbers intentionally doubled
  },
  success: [{
    id: 1
  },{
    id: 2
  },{
    id: 3
  },{
    id: 5
  }],
  fail: [{
    id: 4
  },{
    id: 8
  }]
},{
  title: 'bitmaskall',
  filter: {
    op: 'bitmaskall',
    field: 'id',
    value: 3
  },
  success: [{
    id: 3
  }],
  fail: [{
    id: 1
  },{
    id: 2
  },{
    id: 4
  },{
    id: 8
  }]
},{
  title: 'bitmaskall from array',
  filter: {
    op: 'bitmaskall',
    field: 'id',
    value: [0, 1]
  },
  success: [{
    id: 3
  }],
  fail: [{
    id: 1
  },{
    id: 2
  },{
    id: 4
  },{
    id: 8
  }]
}];

describe ('Basic tests', function () {
  setGlobal('factory', require('..')(execlib));
  cases.forEach(caseIt);
});
