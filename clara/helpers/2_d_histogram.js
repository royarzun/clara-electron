const Highcharts = require('highcharts');
require('highcharts/modules/heatmap')(Highcharts);

var utils = require('./graph_utils');


function loadIHistogram2D(obj) {
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

    if (obj.annotation.yAxisLabel) {
        yAxisLabel = obj.annotation.yAxisLabel;
    } else {
        yAxisLabel = "Unknown Variable";
    }

    var yaxis_x = -20;
    if (yAxisInfo.type == "datetime") {
        yAxisLabel = yAxisLabel.concat("<br/>(UTC time)");
    } else if (obj.annotation.yUnits) {
        yAxisLabel = yAxisLabel.concat("<br>(" + obj.annotation.yUnits + ")");
    } else {
        yaxis_x = 0;
    }

    // ADB: highcharts seems to muck up the yAxis max somehow...?
    var ymin = yAxisInfo.func(obj.yAxis.centers[0]),
        ymax = yAxisInfo.func(obj.yAxis.centers[0]);
    for (var j = 0; j < obj.yAxis.centers.length; j++) {
        var yhi = yAxisInfo.func(obj.yAxis.centers[j] + obj.yAxis.binWidth);
        var ylo = yAxisInfo.func(obj.yAxis.centers[j] - obj.yAxis.binWidth);
        if (yhi > ymax) {
            ymax = yhi;
        } else if (ylo < ymin) {
            ymin = ylo;
        }
    }

    var countmax = null,
        countmin = null,
        counts = new Array();

    for (var i = 0; i < obj.xAxis.centers.length; i++) {

        for (var j = 0; j < obj.yAxis.centers.length; j++) {

            if (obj.counts[i][j] > 0) {
                counts.push([xAxisInfo.func(obj.xAxis.centers[i]), yAxisInfo.func(obj.yAxis.centers[j]), obj.counts[i][j]]);

                if (obj.counts[i][j] > countmax || countmax == null) {
                    countmax = obj.counts[i][j];
                } else if (obj.counts[i][j] < countmin || countmin == null) {
                    countmin = obj.counts[i][j];
                }
            } else {
                counts.push([xAxisInfo.func(obj.xAxis.centers[i]), yAxisInfo.func(obj.yAxis.centers[j]), null]);
            }
        }
    }

    var xbinWidth = xAxisInfo.func(obj.xAxis.centers[0] + obj.xAxis.binWidth) - xAxisInfo.func(obj.xAxis.centers[0]),
        ybinWidth = yAxisInfo.func(obj.yAxis.centers[0] + obj.yAxis.binWidth) - yAxisInfo.func(obj.yAxis.centers[0]);

    Highcharts.chart('2d-chart', {
        chart: {
            marginTop: 70,
            marginBottom: 80,
            plotBorderWidth: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            marginRight: 100,
            zoomType: 'xy'
        },
        title: {
            text: obj.annotation.Title
        },
        subtitle: {
            text: "2D Histogram: " + obj.annotation.FullPath
        },
        xAxis: {
            title: {
                text: xAxisLabel
            },
            type: xAxisInfo.type
        },
        yAxis: {
            title: {
                text: yAxisLabel,
                x: yaxis_x
            },
            type: yAxisInfo.type,
            max: ymax,
            min: ymin,
            endOnTick: false
        },
        colorAxis: {
            min: countmin,
            max: countmax,
            stops: [
                [0, '#3060cf'],
                [0.5, '#fffbbc'],
                [0.9, '#c4463a']
            ]
        },
        legend: {
            align: 'right',
            verticalAlign: 'top',
            layout: 'vertical',
            y: 50
        },
        tooltip: {
            borderWidth: 1,
            formatter: (function() {
                // bin width could be in newer unit
                var xbinWidth = xAxisInfo.func(obj.xAxis.centers[0] + obj.xAxis.binWidth) - xAxisInfo.func(obj.xAxis.centers[0]),
                    ybinWidth = yAxisInfo.func(obj.yAxis.centers[0] + obj.yAxis.binWidth) - yAxisInfo.func(obj.yAxis.centers[0]);

                var isxdate = xAxisInfo.type == "datetime",
                    isydate = yAxisInfo.type == "datetime";
                return function() {

                    var xmin = (+this.point.x) - xbinWidth / 2.0,
                        xmax = (+this.point.x) + xbinWidth / 2.0,
                        ymin = (+this.point.y) - ybinWidth / 2.0,
                        ymax = (+this.point.y) + ybinWidth / 2.0;

                    if (isxdate) {
                        var d = new Date(xmin);
                        xmin = d.toUTCString();
                        d = new Date(xmax);
                        xmax = d.toUTCString();
                    } else {
                        xmin = +xmin.toFixed(6);
                        xmax = +xmax.toFixed(6);
                    }

                    if (isydate) {
                        var d = new Date(ymin);
                        ymin = d.toUTCString();
                        d = new Date(ymax);
                        ymax = d.toUTCString();
                    } else {
                        ymin = +ymin.toFixed(6);
                        ymax = +ymax.toFixed(6);
                    }

                    var count = this.point.value;
                    if (count == null) {
                        count = "N/A";
                    }

                    return '<b>X bin:</b> ' + xmin + ' to ' + xmax + '<br/>' +
                        '<b>Y bin:</b> ' + ymin + ' to ' + ymax + '<br/>' +
                        '<b>Count:</b> ' + count;
                }
            })()
        },
        plotOptions: {
            heatmap: {
                shadow: false,
                colsize: xbinWidth,
                rowsize: ybinWidthz
            }
        },
        series: [{
            name: 'Counts',
            data: counts,
            type: 'heatmap'
        }]
    });

    var ymean, ystd;

    if (yAxisInfo.type == "datetime") {
        var d = new Date(yAxisInfo.func(obj.yMean));
        ymean = d.toUTCString();
        ymean = ymean.slice(0, -17) + "<br/>" + ymean.slice(-17);
        ystd = (yAxisInfo.func(obj.yMean + obj.yStd_dev) - yAxisInfo.func(obj.yMean)) / 1000 + " (s)";
    } else {
        ymean = +(obj.yMean.toFixed(6));
        ystd = +(obj.yStd_dev.toFixed(6));
    }

    var xmean, xstd;
    if (xAxisInfo.type == "datetime") {
        var d = new Date(xAxisInfo.func(obj.xMean));
        xmean = d.toUTCString();
        xmean = xmean.slice(0, -17) + "<br/>" + xmean.slice(-17);
        xstd = (xAxisInfo.func(obj.xMean + obj.xStd_dev) - yAxisInfo.func(obj.xMean)) / 1000 + " (s)";
    } else {
        xmean = +(obj.xMean.toFixed(6));
        xstd = +(obj.xStd_dev.toFixed(6));
    }

    utils.chartbox(chart, "<b>Count:</b> " + obj.count + "<br/>" +
        "<b>X mean:</b> " + xmean + "<br/>" +
        "<b>X std dev:</b> " + xstd + "<br/>" +
        "<b>Y mean:</b> " + ymean + "<br/>" +
        "<b>Y std dev:</b> " + ystd);
}

exports.twoDimensionalHisto = loadIHistogram2D;
