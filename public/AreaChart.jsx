"use strict";
var { ChartCanvas, Chart, series, axes, helper } = ReStock;
var { AreaSeries } = series;
var { XAxis, YAxis } = axes;
var { fitWidth, TypeChooser } = helper;

class AreaChart extends React.Component {
	render() {
		var { data, type, width, ratio } = this.props;
		return (
			<ChartCanvas ratio={ratio} width={width} height={400}
					margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
					seriesName="MSFT"
					data={data} type={type}
					xAccessor={d => d.date} xScale={d3.scaleTime()}
					xExtents={[new Date(2011, 0, 1), new Date(2013, 0, 2)]}>
				<Chart id={0} yExtents={d => d.close}>
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" />
					<AreaSeries yAccessor={(d) => d.close}/>
				</Chart>
			</ChartCanvas>
		);
	}
}

/*

*/

AreaChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

AreaChart.defaultProps = {
	type: "svg",
};
AreaChart = fitWidth(AreaChart);


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
	ReactDOM.render(<TypeChooser type="hybrid">{type => <AreaChart data={data} type={type} />}</TypeChooser>, document.getElementById("chart"));
});