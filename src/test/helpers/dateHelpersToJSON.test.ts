import { formatToIsoDate, parseICalDate } from '../../toJSON/utils/dates';

const assert = require('assert');

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
      try {
        formatToIsoDate(invalidDateWithTime);
      } catch (e: any) {
        assert.equal(e.message, 'Date is not valid: 20210402T930000Z');
      }
    });

    it('should throw error with text string', function () {
      try {
        formatToIsoDate('some string');
      } catch (e: any) {
        assert.equal(e.message, 'Invalid date: some string');
      }
    });
  });
  describe('parseICalDate', function () {
    it('should format date with time', function () {
      const result = parseICalDate(validDateWithTime);

      assert.equal(result.value, '20210402T030000Z');
    });
    it('should format date without time', function () {
      const result = parseICalDate(validDateWithoutTime);

      assert.equal(result.value, '20210402');
    });
    it('should throw error for invalid date without time', function () {
      try {
        parseICalDate(invalidDateWithoutTime);
      } catch (e: any) {
        assert.equal(e.message, 'Invalid date: 20219402');
      }
    });
    it('should format date with timezone', function () {
      const result = parseICalDate(validDateWithTimezone);

      assert.equal(result.value, '20210402T030000');
      assert.equal(result.timezone, 'Europe/Berlin');
    });
  });
});
