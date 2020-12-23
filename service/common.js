var moment = require('moment');
var ms = require("ms");

function formatDate(date, format) {
    if (typeof format === 'undefined' || format === null) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    } else {
        return moment(date).format(format);
    }
}

function momentDate(date) {
    return moment(date)
}
function dateDiff(pastDate, futureDate, unitOfTime) {
    return moment(futureDate).diff(pastDate, unitOfTime);
}

function getISODate(date) {
    if (date) {
        return moment(date).utc()._d;
    } else {
        return moment().utc()._d;
    }
}

function isValidOTP(now, then) {
    var diff = moment.duration(moment(now).diff(moment(then)));
    if (diff.asMinutes() > 15) {
        return false;
    }
    return true;
}

function getRelativeDateTime(now, then) {

    var diff = moment.duration(moment(now).diff(moment(then)));
    let days = diff.get('d');
    let hours = diff.get('hours');
    let minutes = diff.get('minutes');
    let seconds = diff.get('seconds');
    let totalHours = (days * 24) + hours;
    return ms((totalHours * 60 * 60000) + (minutes * 60000) + (seconds * 1000), {
        long: true
    })
}

function findArrayObj(array, findNode, findValue) {
    let returnObj;
    //console.log(findValue);
    for (let i = 0; i < array.length; i++) {
        if (array[i][findNode] === findValue) {
            returnObj = array[i];
            break
        }
    }
    return returnObj;
}
function removeEmptyFields(object) {
    let newObj = {}
    Object.keys(object).forEach(key => {
        if (object[key] !== undefined && object[key] !== null && object[key] !== "") {
            newObj[key] = object[key]
        }
    })
    return newObj;
}
createOtpCode = () => {  //Generate 6 digit numbers for OTP 
    var possible = '123456789', code = '';
    for (var i = 0; i <= 5; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return code;
}

const getFirstLettersCaps = (value) => {  // Change 1st letters in Caps 
    const result = value.split(' ')
        .map(ele => ele ? ele[0].toUpperCase() + ele.substr(1).toLowerCase() : '')
        .join(' ');
    return result;
};
enumerateDaysBetweenDates = (startDate, endDate) => {
    var now = startDate.clone();
    let dates = [];
    while (now.isSameOrBefore(endDate)) {
        dates.push(moment(now.format('YYYY-MM-DD')));
        now = now.add(1, 'day');
    }
    return dates;
};
calculateDoctorUpdatedExperience = (experience) => {
    const updatedDate = momentDate(experience.updated_date);
    let getDocExpInMonthsByUpToDate = this.dateDiff(updatedDate, this.momentDate(new Date()), 'months');
    let expInMonthsByUpdated = (experience.year * 12) + experience.month
    let expInMonths = getDocExpInMonthsByUpToDate + expInMonthsByUpdated;
    return {
        month: expInMonths % 12,
        year: parseInt(expInMonths / 12),
        isPrivate: experience.isPrivate
    };
}

module.exports.dateDiff = dateDiff;
module.exports.removeEmptyFields = removeEmptyFields;
module.exports.formatDate = formatDate;
module.exports.isValidOTP = isValidOTP;
module.exports.findArrayObj = findArrayObj;
module.exports.getRelativeDateTime = getRelativeDateTime;
module.exports.ISODate = getISODate;
module.exports.momentDate = momentDate;
module.exports.createOtpCode = createOtpCode;
module.exports.getFirstLettersCaps = getFirstLettersCaps;
module.exports.enumerateDaysBetweenDates = enumerateDaysBetweenDates;
module.exports.calculateDoctorUpdatedExperience = calculateDoctorUpdatedExperience;