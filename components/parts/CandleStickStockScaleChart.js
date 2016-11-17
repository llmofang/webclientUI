
'use strict';
var React = require('react');

import { format } from "d3-format";

var ReStock = require("react-stockcharts") ;

var { ChartCanvas, Chart, series, scale,annotation, coordinates, tooltip, axes, indicator, helper } = ReStock;

var { CandlestickSeries } = series;
var { discontinuousTimeScaleProvider } = scale;
var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } = coordinates;
var {  Label } = annotation;
var { XAxis, YAxis } = axes;
var { OHLCTooltip } = tooltip;

var { fitWidth } = helper;

class CandleStickStockScaleChart extends React.Component{

    render() {
        var { type, data, width,title ,disableMouseMoveEvent, disablePanEvent, disableZoomEvent} = this.props;

        
        return (
            <ChartCanvas  width={width} height={400}
                    margin={{ left: 50, right: 50, top: 10, bottom: 30 }} type={type}
                    seriesName="MSFT"
                    data={data}  
                    disableMouseMoveEvent={disableMouseMoveEvent}
                    disablePanEvent={disablePanEvent}
                    disableZoomEvent={disableZoomEvent}
                    xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider} 
                    xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
                <Chart id={0} yExtents={d => [d.high, d.low]}  >
                    <XAxis axisAt="bottom" orient="bottom" ticks={15}  zoomEnabled={disableZoomEvent}/>
                    <YAxis axisAt="right" orient="right" ticks={5} zoomEnabled={disableZoomEvent} />
                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format(".2f")} />
                    <CandlestickSeries />
                </Chart>
                <CrossHairCursor />
            </ChartCanvas>
        );
    }
}

/*CandleStickStockScaleChart.propTypes = {
    data: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired,
    type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};*/

CandleStickStockScaleChart.defaultProps = {
    type: "svg",
    disableMouseMoveEvent: false,
    disablePanEvent: false,
    disableZoomEvent: false,
};
CandleStickStockScaleChart = fitWidth(CandleStickStockScaleChart);

module.exports = CandleStickStockScaleChart;

