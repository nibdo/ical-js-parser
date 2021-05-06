const chai = require('chai');
const assert = chai.assert;

const { timezoneParser } = require('../dist/toJSON/timezoneParser');

describe('Timezone parser toJSON', function () {
  it('should format long CET to short CET format', function () {
    const result = timezoneParser('Central European Standard Time');

    assert.equal(result, 'CET');
  });
});
