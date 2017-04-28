var caseIt = require('./lib/caserunner');
var cases = [{
  filter: {
    op: 'exists',
    field: 'a.first'
  },
  success: [{
    a: {
      first: 'meh'
    },
    b: 'blah'
  }],
  fail: [{
  },{
    b: 8
  }]
},{
  filter: {
    op: 'notexists',
    field: 'blah.meh',
  },
  success: [{
    bla: {
      meh: 5
    }
  },{
    blah: {
      me: 5
    }
  }],
  fail: [{
    blah: {
      meh: 8
    }
  }]
},{
  filter: {
    op: 'eq',
    field: 'a.p',
    value: 'ninetynine'
  },
  success: [{
    a: {
      p: 'ninetynine'
    }
  }],
  fail: [{
    b: {
      p: 'ninetynine'
    }
  }]
},{
  filter: {
    op: 'ne',
    field: 'a.p',
    value: 'ninetynine'
  },
  success: [{
    a: {
      p: 'ninetinine'
    }
  }],
  fail: [{
    a: {
      p: 'ninetynine'
    }
  }]
},{
  filter: {
    op: 'in',
    field: 'a.profile.id',
    value: [5, 6, 7, 8]
  },
  success: [{
    a: { profile: {id: 5} }
  },{
    a: { profile: {id: 6} }
  },{
    a: { profile: {id: 7} }
  },{
    a: { profile: {id: 8} }
  }],
  fail: [{
    a: { profile: {id: 9} }
  }]
}];

describe ('Basic tests', function () {
  setGlobal('factory', require('..')(execlib));
  cases.forEach(caseIt);
});
