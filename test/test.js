var assert = require('assert');
var dd = require("../duedate").dueDate;

describe('DueDate class', function() {
    describe('check weekends', function() {
        it('Monday is not weekend', function() {
            assert.equal(dd._isWeekend(new Date('2017-06-05T10:00:00Z')), false);
        });
        it('Tuesday is not weekend', function() {
            assert.equal(dd._isWeekend(new Date('2017-06-06T10:00:00Z')), false);
        });
        it('Wednesday is not weekend', function() {
            assert.equal(dd._isWeekend(new Date('2017-06-07T10:00:00Z')), false);
        });
        it('Thursday is not weekend', function() {
            assert.equal(dd._isWeekend(new Date('2017-06-08T10:00:00Z')), false);
        });
        it('Friday is not weekend', function() {
            assert.equal(dd._isWeekend(new Date('2017-06-09T10:00:00Z')), false);
        });
        it('Saturday is weekend', function() {
            assert.equal(dd._isWeekend(new Date('2017-06-10T10:00:00Z')), true);
        });
        it('Sunday is weekend', function() {
            assert.equal(dd._isWeekend(new Date('2017-06-11T10:00:00Z')), true);
        });
    });

    describe('add hours to date', function() {
        it('add 2 hours', function() {
            d = new Date('2017-06-01T10:00:00Z')
            expected = new Date('2017-06-01T12:00:00Z')
            assert.equal(dd._addHours(d, 2).toString(), expected.toString());
        });
        it('add 24 hours', function() {
            d = new Date('2017-06-01T10:00:00Z')
            expected = new Date('2017-06-02T10:00:00Z')
            assert.equal(dd._addHours(d, 24).toString(), expected.toString());
        });
        it('add negative hours', function() {
            d = new Date('2017-06-01T10:00:00Z')
            expected = new Date('2017-06-01T08:00:00Z')
            assert.equal(dd._addHours(d, -2).toString(), expected.toString());
        });
    });

    describe('after working hours', function() {
        tooEarly = new Date('2017-06-01T08:00:00Z')
        tooLate = new Date('2017-06-01T17:00:00Z')
        ok = new Date('2017-06-01T09:00:00Z')
        alsoOK = new Date('2017-06-01T16:00:00Z')

        it('too early date should be accepted', function() {
            assert.equal(dd._afterWorkingHours(tooEarly), true);
            assert.equal(dd._isWorkingHours(tooEarly), false);
        });
        it('too late date should be accepted', function() {
            assert.equal(dd._afterWorkingHours(tooLate), true);
            assert.equal(dd._isWorkingHours(tooLate), false);
        });
        it('work time should be denied', function() {
            assert.equal(dd._afterWorkingHours(ok), false);
            assert.equal(dd._isWorkingHours(ok), true);

            assert.equal(dd._afterWorkingHours(alsoOK), false);
            assert.equal(dd._isWorkingHours(alsoOK), true);
        });
    });

    describe('invalid submit dates', function() {
        tooEarlyDate = new Date('2017-06-01T08:59:00Z')
        tooLateDate = new Date('2017-06-01T17:01:00Z')
        saturday = new Date('2017-06-03T10:00:00Z')
        sunday = new Date('2017-06-04T10:00:00Z')

        it('too early date should throws error', function() {
            assert.throws(function() { dd.Calculate(tooEarlyDate, 0) });
        });
        it('too late date should throws error', function() {
            assert.throws(function() { dd.Calculate(tooLateDate, 0) });
        });
        it('Saturday and Sunday should throws error', function() {
            assert.throws(function() { dd.Calculate(saturday, 0) });
            assert.throws(function() { dd.Calculate(sunday, 0) });
        });
    });

    describe('in working hours', function() {
        workinghour1 = new Date('2017-06-01T10:00:00Z')
        workinghour2 = new Date('2017-06-01T16:59:00Z')

        it('should respond valid date', function() {
            assert.equal(dd.Calculate(workinghour1, 0), workinghour1);
            assert.equal(dd.Calculate(workinghour2, 0), workinghour2);
        });
    });

    describe('adding hours within day', function() {
        it('add zero hour should be fine', function() {
            validDate = new Date('2017-06-01T10:00:00Z')
            assert.equal(dd.Calculate(validDate, 0).toString(), validDate.toString());
        });

        it('add one hour should be fine', function() {
            validDate = new Date('2017-06-01T10:00:00Z')
            plusOneHour = new Date('2017-06-01T11:00:00Z')
            assert.equal(dd.Calculate(validDate, 1).toString(), plusOneHour.toString());
        });
    });

    describe('adding hours that exceed the day', function() {
        it('adding lower than 8 hours but exceed the working day', function() {
            d = new Date('2017-06-01T15:00:00Z')
            expectFriday = new Date('2017-06-02T15:00:00Z')
            assert.equal(dd.Calculate(d, 8).toString(), expectFriday.toString());
        });

        it('adding lower than 8 hours should eschew the weekend', function() {
            friday = new Date('2017-06-02T15:00:00Z')
            expectNextMonday = new Date('2017-06-05T15:00:00Z')
            assert.equal(dd.Calculate(friday, 8).toString(), expectNextMonday.toString());
        });
    });

    describe('add 8 hours', function() {
        it('should +1 day instead', function() {
            validDate = new Date('2017-06-01T10:00:00Z')
            plusOneDay = new Date('2017-06-02T10:00:00Z')
            assert.equal(dd.Calculate(validDate, 8).toString(), plusOneDay.toString());
        });

        it('should eschew the weekend', function() {
            friday = new Date('2017-06-02T10:00:00Z')
            nextMonday = new Date('2017-06-05T10:00:00Z')
            assert.equal(dd.Calculate(friday, 8).toString(), nextMonday.toString());
        });
    });

    describe('adding days', function() {
        oneDayInWorkdayHours = 8
        
        it('add 1 day', function() {
            d = new Date('2017-06-01T10:00:00Z')
            expectNextDay = new Date('2017-06-02T10:00:00Z')
            assert.equal(dd.Calculate(d, oneDayInWorkdayHours).toString(), expectNextDay.toString());
        });
        it('add 1 working day should avoid weekend', function() {
            d = new Date('2017-06-02T10:00:00Z')
            expectNextMonday = new Date('2017-06-05T10:00:00Z')
            assert.equal(dd.Calculate(d, oneDayInWorkdayHours).toString(), expectNextMonday.toString());
        });
        it('add 3 working days should avoid weekend', function() {
            d = new Date('2017-06-01T10:00:00Z')
            expectNextWeek = new Date('2017-06-06T10:00:00Z')
            assert.equal(dd.Calculate(d, oneDayInWorkdayHours * 3).toString(), expectNextWeek.toString());
        });
        it('add 5 working days', function() {
            d = new Date('2017-06-01T10:00:00Z')
            expectNextWeek = new Date('2017-06-08T10:00:00Z')
            assert.equal(dd.Calculate(d, oneDayInWorkdayHours * 5).toString(), expectNextWeek.toString());
        });
        it('add 10 working days', function() {
            d = new Date('2017-06-01T10:00:00Z')
            expected = new Date('2017-06-15T10:00:00Z')
            assert.equal(dd.Calculate(d, oneDayInWorkdayHours * 10).toString(), expected.toString());
        });
        it('add 14 working days', function() {
            d = new Date('2017-06-01T10:00:00Z')
            expected = new Date('2017-06-21T10:00:00Z')
            assert.equal(dd.Calculate(d, oneDayInWorkdayHours * 14).toString(), expected.toString());
        });
    });

    describe('adding days and hours mixed', function() {
        it('add 9 hours', function() {
            d = new Date('2017-06-01T10:00:00Z')
            assert.equal(dd.Calculate(d, 9).toString(), new Date('2017-06-02T11:00:00Z').toString());
        });
        it('add 10 hours', function() {
            d = new Date('2017-06-01T10:00:00Z')
            assert.equal(dd.Calculate(d, 10).toString(), new Date('2017-06-02T12:00:00Z').toString());
        });
        it('add 10 hours with weekend', function() {
            d = new Date('2017-06-02T10:00:00Z')
            expected = new Date('2017-06-05T12:00:00Z')
            assert.equal(dd.Calculate(d, 10).toString(), expected.toString());
        });
        it('add 15 hours without weekend', function() {
            d = new Date('2017-05-31T16:00:00Z')
            assert.equal(dd.Calculate(d, 15).toString(), new Date('2017-06-02T15:00:00Z').toString());
        });
        it('add 15 hours with weekend', function() {
            d = new Date('2017-06-01T16:00:00Z')
            assert.equal(dd.Calculate(d, 15).toString(), new Date('2017-06-05T15:00:00Z').toString());
        });

        it('on Thursday 15:00 get 7h works', function() {
            d = new Date('2017-06-01T15:00:00Z')
            expectFriday = new Date('2017-06-02T14:00:00Z')
            assert.equal(dd.Calculate(d, 7).toString(), expectFriday.toString());
        });

        it('on friday 15:00 get 7h works', function() {
            d = new Date('2017-06-02T15:00:00Z')
            expectFriday = new Date('2017-06-05T14:00:00Z')
            assert.equal(dd.Calculate(d, 7).toString(), expectFriday.toString());
        });
    });
});
