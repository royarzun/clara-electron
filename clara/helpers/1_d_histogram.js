const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);
var ipc = require('electron').ipcRenderer;

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

function loadIHistogram1D(obj) {
    var xAxisInfo = getAxisInfo(obj.annotation.xUnits);
    var xAxisLabel = obj.annotation.xAxisLabel;

    if (xAxisInfo.type == "datetime") {
        xAxisLabel = xAxisLabel.concat(" (UTC time)");
    } else if (obj.annotation.xUnits) {
        xAxisLabel = xAxisLabel.concat(" (" + obj.annotation.xUnits + ")");
    }

    // build series data
    var counts = new Array();
    for (var i = 0; i < obj.counts.length; i++) {
        counts.push([xAxisInfo.func(obj.xAxis.centers[i]), obj.counts[i]]);
    }

    // 1D histogam config
    Highcharts.chart('1d-chart', {
        chart: {
            defaultSeriesType: 'column',
            borderColor: '#ccc',
            plotBackgroundColor: '#fff',
            backgroundColor: '#ffffff',
            plotBorderColor: '#ccc',
            marginRight: 150,
            zoomType: 'xy'
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: true
        },
        title: {
            text: "title"
        },
        subtitle: {
            text: "1D Histogram: " // + path
        },
        legend: {
            align: 'right',
            verticalAlign: 'top',
            layout: 'vertical',
            y: 100
        },
        tooltip: {
            borderWidth: 1,
            formatter: (function() {
                // bin width could be in newer unit
                var binWidth = xAxisInfo.func(obj.xAxis.centers[0] + obj.xAxis.binWidth) - xAxisInfo.func(obj.xAxis.centers[0]);
                var isdate = xAxisInfo.type == "datetime";
                return function() {

                    var min = (+this.x) - binWidth / 2.0;
                    var max = (+this.x) + binWidth / 2.0;

                    if (isdate) {
                        var d = new Date(min);
                        min = d.toUTCString();
                        d = new Date(max);
                        max = d.toUTCString();
                    } else {
                        min = +min.toFixed(6);
                        max = +max.toFixed(6);
                    }

                    return '<b>Bin:</b> ' + min + ' to ' + max + '<br/>' + '<b>Count:</b> ' + this.y;
                }
            })()
        },
        plotOptions: {
            column: {
                shadow: false,
                borderWidth: 1,
                borderColor: '#666',
                pointPadding: 0,
                groupPadding: 0,
            }
        },
        xAxis: {
            title: {
                text: xAxisLabel
            },
            labels: {
                rotation: -90,
                y: 40,
                style: {
                    fontWeight: 'normal',
                },
            },
            lineWidth: 0,
            lineColor: '#999',
            tickLength: 20,
            tickColor: '#ccc',
            type: xAxisInfo.type
        },
        yAxis: {
            title: {
                text: 'Counts'
            },
            maxPadding: 0,
            gridLineColor: '#e9e9e9',
            tickWidth: 1,
            tickLength: 3,
            tickColor: '#ccc',
            lineColor: '#ccc',
        },
        series: [{
            name: 'Counts',
            data: counts
        }]
    });

    var mean, std;

    if (xAxisInfo.type == "datetime") {
        var d = new Date(xAxisInfo.func(obj.mean));
        mean = d.toUTCString();
        mean = mean.slice(0, -17) + "<br/>" + mean.slice(-17);
        std = (xAxisInfo.func(obj.mean + obj.std_dev) - xAxisInfo.func(obj.mean)) / 1000 + " (s)";
    } else {
        mean = +(obj.mean.toFixed(6));
        std = +(obj.std_dev.toFixed(6));
    }

    chartbox(chart, "<b>Count:</b> " + obj.count + "<br/>" +
        "<b>Mean:</b> " + mean + "<br/>" +
        "<b>Std Dev:</b> " + std);
}

function noop(val) {
    return val;
}

function jq(myid) {
    return "C" + myid.replace(/\(|\)|:|\.|\[|\]|,|\/| |=/g, '');
}

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

exports.oneDimensionalHisto = loadIHistogram1D;