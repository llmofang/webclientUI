'use strict';
var { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } = ReStock;

var { CandlestickSeries } = series;
var { discontinuousTimeScaleProvider } = scale;
var { XAxis, YAxis } = axes;

var { fitWidth, TypeChooser } = helper;

class CandleStickStockScaleChart extends React.Component {
    render() {
        var { type, data, width, ratio } = this.props;
        return (
            <ChartCanvas ratio={ratio} width={width} height={400}
                         margin={{ left: 50, right: 50, top: 10, bottom: 30 }} type={type}
                         seriesName="MSFT"
                         data={data}
                         xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
                         xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>

                <Chart id={1} yExtents={d => [d.high, d.low]}>
                    <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
                    <YAxis axisAt="left" orient="left" ticks={5} />
                    <CandlestickSeries />
                </Chart>
            </ChartCanvas>
        );
    }
}

CandleStickStockScaleChart.propTypes = {
    data: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired,
    ratio: React.PropTypes.number.isRequired,
    type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickStockScaleChart.defaultProps = {
    type: "svg",
};
CandleStickStockScaleChart = fitWidth(CandleStickStockScaleChart);


var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
d3["tsv"]("//rrag.github.io/react-stockcharts/data/MSFT.tsv", (err, data) => {
    /* change MSFT.tsv to MSFT_full.tsv above to see how this works with lots of data points */
    data.forEach((d, i) => {
        d.date = new Date(d3.timeParse("%Y-%m-%d")(d.date).getTime());
        d.open = +d.open;
        d.high = +d.high;
        d.low = +d.low;
        d.close = +d.close;
        d.volume = +d.volume;
        // console.log(d);
    });
    /* change the type from hybrid to svg to compare the performance between svg and canvas */
    ReactDOM.render(<TypeChooser type="hybrid">{type => <CandleStickStockScaleChart data={data} type={type} />}</TypeChooser>, document.getElementById("chart"));
});