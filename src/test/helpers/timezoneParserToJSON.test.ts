import { timezoneParser } from '../../toJSON/timezoneParser';

const assert = require('assert');

describe('Timezone parser toJSON', function () {
  it('should format long CET to short CET format', function () {
    const result = timezoneParser('Central European Standard Time');

    assert.equal(result, 'CET');
  });
});
