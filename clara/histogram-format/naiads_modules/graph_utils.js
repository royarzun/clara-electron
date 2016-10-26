const Highcharts = require('highcharts');


function chartbox(chart, text) {

    var label = chart.renderer.label(text)
        .css({
            width: '180px'
        })
        .attr({
            'stroke': 'silver',
            'stroke-width': 1,
            'r': 5,
            'padding': 10
        })
        .add();

    label.align(Highcharts.extend(label.getBBox(), {
        align: 'right',
        x: 0, // offset
        verticalAlign: 'bottom',
        y: 0 // offset
    }), null, 'spacingBox');
}

function getAxisInfo(units, func, type) {
    if (units == "day") {
        return {
            type: "datetime",
            func: julienDayToUTC
        };
    } else if (units == "UTC - yymmdd.ffffffff") {
        return {
            type: "datetime",
            func: yymmddToUTC
        };
    } else if (units == "iec") {
        return {
            type: "datetime",
            func: iecToUTC
        };
    } else {
        return {
            type: "linear",
            func: noop
        };
    }
}

function formatNumeric(n, p) {

    if (n == null) {
        return "N/A";
    }

    if (isNumeric(n)) {
        return +(n.toFixed(p))
    }
    return n
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function jq(myid) {
    return "C" + myid.replace(/\(|\)|:|\.|\[|\]|,|\/| |=/g, '');
}

function julienDayToUTC(jd) {
    // check for illegal value
    if (jd == null || jd == 0) return null;

    var unix_zero = 2440587.5,
        msc = (jd - unix_zero) * 8640000, // in 10ms increments
        unix_secs = Math.floor(msc + 0.5) / 100;

    return unix_secs * 1000;
}

var iecToUNIX = Date.parse("Jan 1, 1958");

function iecToUTC(iec) {
    // iet is microseconds since 1/1/1958
    return iec / 1000.0 + iecToUNIX;
}

function noop(val) {
    return val;
}

function yymmddToUTC(yymmdd) {
    // check for illegal value
    if (yymmdd == null || yymmdd == 0) return null;

    var datestr = yymmdd.toString();

    // going to assume 20xx
    var year = "20" + datestr.substring(0, 2),
        month = datestr.substring(2, 4),
        day = datestr.substring(4, 6),
        fracday = datestr.substring(6),
        hours = Math.floor(fracday * 24),
        frachrs = fracday * 24 - hours,
        minutes = Math.floor(frachrs * 60),
        fracmins = frachrs * 60 - minutes,
        seconds = Math.floor(fracmins * 60),
        fracsecs = fracmins * 60 - seconds,
        d = new Date(year, month, day, hours, minutes, seconds, fracsecs * 1000);
    return d.getTime();
}


exports.chartbox = chartbox;
exports.formatNumeric = formatNumeric;
exports.getAxisInfo = getAxisInfo;
exports.iecToUNIX = iecToUNIX;
exports.iecToUTC = iecToUTC;
exports.jq = jq;
exports.julienDayToUTC = julienDayToUTC;
exports.noop = noop;
exports.yymmddToUTC = yymmddToUTC;
