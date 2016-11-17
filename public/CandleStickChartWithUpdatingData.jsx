"use strict";

import CandleStickChartWithMACDIndicator from "./CandleStickChartWithMACDIndicator";
import updatingDataWrapper from "./updatingDataWrapper";

var CandleStickChartWithUpdatingData = updatingDataWrapper(CandleStickChartWithMACDIndicator)

//export default CandleStickChartWithUpdatingData;
var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
d3["tsv"]("//rrag.github.io/react-stockcharts/data/MSFT.tsv", (err, data) => {
	
	data.forEach((d, i) => {
		d.date = new Date(d3.timeParse("%Y-%m-%d")(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		// console.log(d);
	});
	
	ReactDOM.render(<TypeChooser type="hybrid">{type => <CandleStickChartWithUpdatingData  type={type} data={data} />}</TypeChooser>, document.getElementById("chart"));
});