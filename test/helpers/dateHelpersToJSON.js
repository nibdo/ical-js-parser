const chai = require('chai');
const assert = chai.assert;

const { INVALID_DATE_ERROR } = require('../../dist/constants');
const {
  parseICalDate,
  formatToIsoDate,
} = require('../../dist/toJSON/dateHelpers');

const validDateWithTime = '20210402T030000';
const invalidDateWithTime = '20210402T930000';
const validDateWithoutTime = 'DATE:20210402';
const invalidDateWithoutTime = '20219402';
const validDateWithTimezone = 'TZID=Europe/Berlin:20210402T030000';

describe('Date helpers toJSON', function () {
  describe('formatToIsoDate', function () {
    it('should format date to ISO date', function () {
      const result = formatToIsoDate(validDateWithTime);

      assert.equal(result, '20210402T030000Z');
    });

    it('should throw error with wrong date', function () {
      assert.throws(
        () => formatToIsoDate(invalidDateWithTime),
        INVALID_DATE_ERROR
      );
    });

    it('should throw error with text string', function () {
      assert.throws(() => formatToIsoDate('some string'), INVALID_DATE_ERROR);
    });
  });
  describe('parseICalDate', function () {
    it('should format date with time', function () {
      const result = parseICalDate(validDateWithTime);

      assert.equal(result, '20210402T030000Z');
    });
    it('should format date without time', function () {
      const result = parseICalDate(validDateWithoutTime);

      assert.equal(result.value, '20210402');
    });
    it('should throw error for invalid date without time', function () {
      assert.throws(
        () => parseICalDate(invalidDateWithoutTime),
        INVALID_DATE_ERROR
      );
    });
    it('should format date with timezone', function () {
      const result = parseICalDate(validDateWithTimezone);

      assert.equal(result.value, '20210402T010000Z');
      assert.equal(result.timezone, 'Europe/Berlin');
    });
  });
});
