function successExpecter (filter, data) {
  expect(filter.isOK(data)).to.equal(true);
}
function failExpecter (filter, data) {
  expect(filter.isOK(data)).to.equal(false);
}
function caseRunner(kase) {
  var filter = factory.createFromDescriptor(kase.filter);
  kase.success.forEach(successExpecter.bind(null, filter));
  kase.fail.forEach(failExpecter.bind(null, filter));
  filter = null;
}

function caseIt (kase) {
  it ('Testing the "'+kase.filter.op+'" filter', caseRunner.bind(null, kase));
}

module.exports = caseIt;
