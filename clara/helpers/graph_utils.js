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


function jq(myid) {
    return "C" + myid.replace(/\(|\)|:|\.|\[|\]|,|\/| |=/g, '');
}

function noop(val) {
    return val;
}

exports.chartbox = chartbox;
exports.getAxisInfo = getAxisInfo;
exports.jq = jq;
exports.noop = noop;
