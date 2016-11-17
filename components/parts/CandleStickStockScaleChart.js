
'use strict';
var React = require('react');

import { format } from "d3-format";
import { timeFormat} from "d3-time-format";

var ReStock = require("react-stockcharts") ;

var { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } = ReStock;

var { CandlestickSeries,LineSeries } = series;
var { discontinuousTimeScaleProvider } = scale;
var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = coordinates;
var { EdgeIndicator } = coordinates;
var { XAxis, YAxis } = axes;
var { OHLCTooltip, MovingAverageTooltip, MACDTooltip } = tooltip;
var { macd, ema, sma } = indicator;
var { fitWidth } = helper;

class CandleStickStockScaleChart extends React.Component{

    render() {
        var { type, data, width,ratio} = this.props;
        var ema26 = ema()
            .id(0)
            .windowSize(26)
            .merge((d, c) => {d.ema26 = c})
            .accessor(d => d.ema26);

        var ema12 = ema()
            .id(1)
            .windowSize(12)
            .merge((d, c) => {d.ema12 = c})
            .accessor(d => d.ema12);

        var macdCalculator = macd()
            .fast(12)
            .slow(26)
            .signal(9)
            .merge((d, c) => {d.macd = c})
            .accessor(d => d.macd);

        var smaVolume50 = sma()
            .id(3)
            .windowSize(10)
            .sourcePath("volume")
            .merge((d, c) => {d.smaVolume50 = c})
            .accessor(d => d.smaVolume50);
        
        return (
            <ChartCanvas  width={width} height={400} ratio={ratio}
                    margin={{ left: 50, right: 50, top: 10, bottom: 30 }} type={type}
                    seriesName="MSFT"
                    data={data}    calculator={[ema26, ema12, smaVolume50, macdCalculator]}
                    xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider} 
                    xExtents={[new Date(2012, 0, 1), new Date(2012, 6, 2)]}>
                <Chart id={0} 
                       yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}  >
                    <XAxis axisAt="bottom" orient="bottom" ticks={15}  />
                    <YAxis axisAt="right" orient="right" ticks={5}  />
                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format(".2f")} />
                   <MouseCoordinateX
                      rectWidth="180"
                        at="bottom"
                        orient="bottom"
                        displayFormat={timeFormat("%Y-%m-%d")} />
                    <CandlestickSeries />
                    <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()}/>
                    <LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()}/>

                    <CurrentCoordinate yAccessor={ema26.accessor()} fill={ema26.stroke()} />
                    <CurrentCoordinate yAccessor={ema12.accessor()} fill={ema12.stroke()} />

                    <EdgeIndicator itemType="last" orient="right" edgeAt="right"
                        yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

                    <OHLCTooltip origin={[-40, 0]}/>
                    <MovingAverageTooltip onClick={(e) => console.log(e)} origin={[-38, 15]}
                        calculators={[ema26, ema12]}/>
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
};
CandleStickStockScaleChart = fitWidth(CandleStickStockScaleChart);

module.exports = CandleStickStockScaleChart;

