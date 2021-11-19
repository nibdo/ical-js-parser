import {
  extractAlwaysStringValue,
  normalizeKey,
  normalizeString,
  splitRowsToArray,
} from '../../src/toJSON/formatHelpers';

const assert = require('assert');

describe('Format helpers toJSON', function () {
  describe('extractAlwaysStringValue', function () {
    it("should extract only string value after ':'", function () {
      const result = extractAlwaysStringValue('LANGUAGE=en-US:ada');

      assert.equal(result, 'ada');
    });
    it('should return empty string with no value', function () {
      const result = extractAlwaysStringValue(undefined);

      assert.equal(result, '');
    });
  });
  describe('normalizeString', function () {
    it('should return empty string with no value', function () {
      const result = normalizeString(undefined);

      assert.equal(result, '');
    });
    it('should return original value if it is not string', function () {
      const result = normalizeString({ test: 'nest' });

      assert.equal(result.test, 'nest');
    });
    it('should return trimmed string', function () {
      const result = normalizeString(' abc ');

      assert.equal(result, 'abc');
    });
    it('should cut /r from ending', function () {
      const result = normalizeString('test/r');

      assert.equal(result, 'test');
    });
  });
  describe('normalizeKey', function () {
    it('should return original key with correct format', function () {
      const result = normalizeKey('dtstart');

      assert.equal(result, 'dtstart');
    });
    it('should return lower cased key', function () {
      const result = normalizeKey('DTSTART');

      assert.equal(result, 'dtstart');
    });
    it('should return replace dashes with camel case', function () {
      const result = normalizeKey('LAST-MODIFIED');

      assert.equal(result, 'lastModified');
    });
  });
  describe('splitRowsToArray', function () {
    it('should split simple rows to array', function () {
      const result = splitRowsToArray(
        `BEGIN:VCALENDAR
PRODID:Calendar V1.1`
      );

      assert.equal(result.length, 2);
      assert.equal(result[0], 'BEGIN:VCALENDAR');
      assert.equal(result[1], 'PRODID:Calendar V1.1');
    });
    it('should connect rows for same key', function () {
      const result = splitRowsToArray(
        `SUMMARY:This is some text,
 text is ending here`
      );

      assert.equal(result.length, 1);
      assert.equal(result[0], 'SUMMARY:This is some text, text is ending here');
    });
  });
});
