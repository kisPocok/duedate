oneDayInHours = 24
workHourStarts = 9
workHourEnds = 17
workdayHours = workHourEnds - workHourStarts
nonWorkingHours = oneDayInHours - workHourEnds + workHourStarts

var isWorkingHours = function(d) {
    var hours = d.getUTCHours()
    return hours >= workHourStarts && hours < workHourEnds
}

var afterWorkingHours = function(d) {
    return !isWorkingHours(d)
}

var isWeekend = function(d) {
    // 0 = Sunday, 6 = Saturday
    dayNumber = d.getDay()
    return dayNumber == 0 || dayNumber == 6
}

/*
Date.prototype.addHours = function(h){
    this.setUTCHours(this.getUTCHours() + h);
    return this
}
*/

var addHours = function(d, h) {
    d.setUTCHours(d.getUTCHours() + h);
    return d
}

var CalculateDueDate = function(submitDate, turnaroundHours) {
    if (isWeekend(submitDate) || afterWorkingHours(submitDate)) {
        throw "An issue can only be reported during working hours."
    }

    dueDate = submitDate
    currentHour = submitDate.getUTCHours()

    // Remaining hours on that day
    remainingHoursToday = workHourEnds - currentHour

    workHours = turnaroundHours % workdayHours
    workDays = (turnaroundHours - workHours) / workdayHours

    if (workHours <= remainingHoursToday) {
        // spend the hours today, don't have to check hours anymore
        dueDate = addHours(dueDate, workHours);
        workHours = 0
    } else {
        // spend the remaining hours first
        workHours -= remainingHoursToday
        // then set the dueDate to the next day
        dueDate = addHours(dueDate, nonWorkingHours + remainingHoursToday);
        // it might be a case when the "next day" is weekend
        while (isWeekend(dueDate)) {
            dueDate = addHours(dueDate, oneDayInHours);
        }
    }

    // Spend remaining hours if so
    dueDate = addHours(dueDate, workHours);

    // Spend days
    while (workDays > 0) {
        dueDate = addHours(dueDate, oneDayInHours);
        if (!isWeekend(dueDate)) {
            workDays--
        }
    }

    return dueDate
}

exports.dueDate = {
    Calculate: CalculateDueDate,
    _isWorkingHours: isWorkingHours,
    _afterWorkingHours: afterWorkingHours,
    _isWeekend: isWeekend,
    _addHours: addHours,
}