const Highcharts = require('highcharts');
require('highcharts/modules/heatmap')(Highcharts);

var utils = require('./graph_utils');


function loadIProfile2D(obj) {
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

    // get data axis min/max if available
    var meanmax = null,
        meanmin = null;

    // set requested mean & max
    if (obj.annotation.dataMin) {
        meanmin = +obj.annotation.dataMin;
    }
    if (obj.annotation.dataMax) {
        meanmax = +obj.annotation.dataMax;
    }

    // build the series data
    // 2D array, X & Y values and count for each point
    // X is the center of the histo x bin, Y is center of histo y bin
    var means = new Array();
    for (var i = 0; i < obj.xAxis.centers.length; i++) {

        for (var j = 0; j < obj.yAxis.centers.length; j++) {
            if (obj.counts[i][j] != 0) {
                means.push([xAxisInfo.func(obj.xAxis.centers[i]), yAxisInfo.func(obj.yAxis.centers[j]), obj.means[i][j]]);

                if (!obj.annotation.dataMax && (obj.means[i][j] > meanmax || meanmax == null)) {
                    meanmax = obj.means[i][j];
                } else if (!obj.annotation.dataMin && (obj.means[i][j] < meanmin || meanmin == null)) {
                    meanmin = obj.means[i][j];
                }
            } else {
                // count is zero so there can be no real "mean"
                means.push([xAxisInfo.func(obj.xAxis.centers[i]), yAxisInfo.func(obj.yAxis.centers[j]), null]);
            }
        }
    }

    var xbinWidth = xAxisInfo.func(obj.xAxis.centers[0] + obj.xAxis.binWidth) - xAxisInfo.func(obj.xAxis.centers[0]),
        ybinWidth = yAxisInfo.func(obj.yAxis.centers[0] + obj.yAxis.binWidth) - yAxisInfo.func(obj.yAxis.centers[0]);

    var chart = Highcharts.chart('p2f-graph', {
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
            text: "2D Profile: " + obj.annotation.FullPath
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
            endontick: !obj.annotation.dataMax,
            min: meanmin,
            max: meanmax,
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
                    isydate = yAxisInfo.type == "datetime",
                    counts = obj.counts,
                    errors = obj.errors;
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

                    var mean = this.point.value;
                    if (mean == null) {
                        mean = "N/A";
                    } else {
                        mean = mean.toFixed(6);
                    }

                    // only works because 2nd dim always same size
                    var i = Math.floor(this.point.index / counts[0].length),
                        j = this.point.index - (i * counts[0].length);

                    return '<b>X bin:</b> ' + xmin + ' to ' + xmax + '<br/>' +
                        '<b>Y bin:</b> ' + ymin + ' to ' + ymax + '<br/>' +
                        '<b>Mean:</b> ' + mean + '<br/>' +
                        '<b>Std err:</b> ' + errors[i][j].toFixed(6) + '<br/>' +
                        '<b>Count:</b> ' + counts[i][j];
                }
            })()
        },
        plotOptions: {
            heatmap: {
                shadow: false,
                colsize: xbinWidth,
                rowsize: ybinWidth
            }
        },
        series: [{
            name: 'Means',
            data: means,
            type: 'heatmap'
        }]
    });

    var zmean, zstd;

    zmean = +(obj.zMean.toFixed(6));

    if (!isNaN(obj.zStd_dev) && isFinite(obj.zStd_dev)) {
        zstd = +(obj.zStd_dev.toFixed(6));
    } else {
        zstd = obj.zStd_dev;
    }


    utils.chartbox(chart, "<b>Count:</b> " + obj.count + "<br/>" +
        "<b>Mean:</b> " + zmean + "<br/>" +
        "<b>Std Dev:</b> " + zstd);
}

exports.twoDimensionalProfile = loadIProfile2D;
