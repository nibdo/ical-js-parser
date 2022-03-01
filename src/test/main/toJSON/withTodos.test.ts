import ICalParser from '../../../index';
import mocks from '../../mocksToJSON';

const assert = require('assert');

describe('Parse to JSON from string with todos', function () {
  it('should return event and todo item', function () {
    const parsedEvent = ICalParser.toJSON(mocks.withTodos);

    assert.equal(parsedEvent.events[0].begin, 'VEVENT');
    assert.equal(parsedEvent.events[0].summary, 'texasa');
    assert.equal(parsedEvent.events.length, 2);

    assert.equal(parsedEvent.todos[0].begin, 'VTODO');
    assert.equal(parsedEvent.todos[0].summary, 'Milk');
    assert.equal(parsedEvent.todos.length, 2);
  });
});
