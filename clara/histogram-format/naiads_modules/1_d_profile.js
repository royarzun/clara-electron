const Highcharts = require('highcharts');
require('highcharts-more')(Highcharts);

var utils = require('./graph_utils');


function loadProfile1D(obj) {
    var xAxisInfo = utils.getAxisInfo(obj.annotation.xUnits),
        yAxisInfo = utils.getAxisInfo(obj.annotation.yUnits);

    var xAxisLabel, yAxisLabel;

    // set axis label if provided
    if (obj.annotation.xAxisLabel) {
        xAxisLabel = obj.annotation.xAxisLabel;
    } else {
        xAxisLabel = "Unknown Variable";
    }

    if (xAxisInfo.type == "datetime") {
        xAxisLabel = xAxisLabel.concat(" (UTC time)");
    } else if (obj.annotation.xUnits) {
        xAxisLabel = xAxisLabel.concat(" (" + obj.annotation.xUnits + ")");
    }

    if (obj.annotation.dataAxisLabel) {
        yAxisLabel = obj.annotation.dataAxisLabel;
    } else {
        yAxisLabel = "Unknown Variable";
    }

    var yaxis_x = -20;
    if (yAxisInfo.type == "datetime") {
        yAxisLabel = yAxisLabel.concat("<br/>(UTC time)");
    } else if (obj.annotation.dataUnits) {
        yAxisLabel = yAxisLabel.concat("<br/>(" + obj.annotation.dataUnits + ")");
    } else {
        yaxis_x = 0;
    }

    var means = new Array(),
        errors = new Array();

    for (var i = 0; i < obj.means.length; i++) {

        if (obj.counts[i]) {
            var yval = yAxisInfo.func(obj.means[i]);
            means.push([xAxisInfo.func(obj.xAxis.centers[i]), yval]);
            if (yval != null) {
                errors.push([xAxisInfo.func(obj.xAxis.centers[i]), +yAxisInfo.func(obj.means[i] - obj.errors[i]), +yAxisInfo.func(obj.means[i] + obj.errors[i])]);
            } else {
                errors.push([xAxisInfo.func(obj.xAxis.centers[i]), null, null]);
            }
        } else {
            means.push([xAxisInfo.func(obj.xAxis.centers[i]), null]);
            errors.push([xAxisInfo.func(obj.xAxis.centers[i]), null, null]);
        }
    }

    // 1D profile prototype
    var chart = Highcharts.chart('p1f-graph', {
        chart: {
            defaultSeriesType: 'line',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: '#ccc',
            plotBorderColor: '#ccc',
            marginRight: 100,
            zoomType: 'xy'
        },
        title: {
            text: obj.annotation.Title
        },
        subtitle: {
            text: "1D Profile: " + obj.annotation.FullPath
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: true
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
                var binWidth = xAxisInfo.func(obj.xAxis.centers[0] + obj.xAxis.binWidth) - xAxisInfo.func(obj.xAxis.centers[0]);
                var isxdate = xAxisInfo.type == "datetime";
                var isydate = yAxisInfo.type == "datetime";
                var counts = obj.counts;
                return function() {

                    var min = (+this.points[0].x) - binWidth / 2.0;
                    var max = (+this.points[0].x) + binWidth / 2.0;

                    if (isxdate) {
                        var d = new Date(min);
                        min = d.toUTCString();
                        d = new Date(max);
                        max = d.toUTCString();
                    } else {
                        min = +min.toFixed(6);
                        max = +max.toFixed(6);
                    }

                    var mean = this.points[0].y;
                    var err;
                    if (isydate) {
                        var d = new Date(mean);
                        mean = d.toUTCString();
                        err = (+this.points[1].point.high - this.points[1].point.low) / 2000.0 + " (s)";
                    } else {
                        err = (+this.points[1].point.high - this.points[1].point.low) / 2.0;
                    }

                    return '<b>Bin:</b> ' + min + ' to ' + max + '<br/>' +
                        '<b>Mean:</b> ' + mean + '<br/>' +
                        '<b>Std Dev:</b> ' + err + '<br/>' +
                        '<b>Count:</b> ' + counts[this.points[0].point.index];
                }
            })(),
            shared: true // shared tooltip b/c two series in this chart!
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
                text: yAxisLabel,
                x: yaxis_x
            },
            maxPadding: 0,
            gridLineColor: '#e9e9e9',
            tickWidth: 1,
            tickLength: 3,
            tickColor: '#ccc',
            lineColor: '#ccc',
            type: yAxisInfo.type
        },
        series: [{
            name: 'Means',
            connectNulls: true,
            data: means
        }, {
            name: 'Errors',
            type: 'errorbar',
            data: errors
        }]
    });

    var mean, std = "N/A";

    if (yAxisInfo.type == "datetime") {
        var d = new Date(yAxisInfo.func(obj.mean));
        mean = d.toUTCString();
        mean = mean.slice(0, -17) + "<br/>" + mean.slice(-17);
        std = (yAxisInfo.func(obj.mean + obj.std_dev) - yAxisInfo.func(obj.mean)) / 1000 + " (s)";
    } else {
        mean = +(obj.mean.toFixed(6));
        if (!isNaN(obj.std_dev)) {
            std = +(obj.std_dev.toFixed(6));
        }
    }

    utils.chartbox(chart, "<b>Count:</b> " + obj.count + "<br/>" +
        "<b>Mean:</b> " + mean + "<br/>" +
        "<b>Std Dev:</b> " + std);
}

exports.oneDimensionalProfile = loadProfile1D;
