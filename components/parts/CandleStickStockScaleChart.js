
'use strict';
var React = require('react');

import { format } from "d3-format";
import { timeFormat} from "d3-time-format";

var ReStock = require("react-stockcharts") ;

var { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper ,annotation} = ReStock;

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries, MACDSeries } = series;
var { discontinuousTimeScaleProvider } = scale;
var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = coordinates;
var { EdgeIndicator } = coordinates;
var { XAxis, YAxis } = axes;
var {Label} = annotation;
var { OHLCTooltip, MovingAverageTooltip, MACDTooltip } = tooltip;
var { macd, ema, sma } = indicator;
var { fitWidth,fitDimensions } = helper;

class CandleStickStockScaleChart extends React.Component{
    getChartCanvas() {
        return this.refs.chartCanvas;
    }
    render() {
        var { type,data,width,height,ratio,title} = this.props;

        var sma5 = sma()
            .windowSize(5)
            .sourcePath("close")
            .merge((d, c) => {d.sma5 = c})
            .accessor(d => d.sma5)
        var sma10 = sma()
            .windowSize(10)
            .sourcePath("close")
            .merge((d, c) => {d.sma10 = c})
            .accessor(d => d.sma10)
        var sma20 = sma()
            .windowSize(20)
            .sourcePath("close")
            .merge((d, c) => {d.sma20 = c})
            .accessor(d => d.sma20)
        var sma60 = sma()
            .windowSize(60)
            .sourcePath("close")
            .merge((d, c) => {d.sma60 = c})
            .accessor(d => d.sma60)
        var smaVolume50 = sma()
            .id(3)
            .windowSize(10)
            .sourcePath("volume")
            .merge((d, c) => {d.smaVolume50 = c})
            .accessor(d => d.smaVolume50);
        return (
            <ChartCanvas ref='ChartCanvas' width={width} height={height} ratio={ratio}
                    margin={{left: 70, right: 100, top:20, bottom: 10}} type={type}
                    seriesName="MSFT"
                    data={data}    calculator={[sma5,sma10 ,sma20,sma60, smaVolume50]}
                    xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider} >  
                <Chart  id={1} height={height*(4/5)}
                        yExtents={[d => [d.high, d.low*0.997], sma5.accessor(), sma10.accessor(),sma20.accessor(),sma60.accessor()]}
                        padding={{ top: 70, bottom: 20 }} >
                    <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} opacity={0}/>
                    <YAxis axisAt="right" orient="right" ticks={5}  tickStroke="#FFFFFF" />
                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format(".2f")} />
                    <CandlestickSeries  wickStroke={d => d.close > d.open ? "#DB0000":"#6BA583" }
                            fill={d => d.close > d.open ? "#DB0000":"#6BA583" }/>

                    <LineSeries yAccessor={sma5.accessor()} stroke={sma5.stroke()}/>
                    <LineSeries yAccessor={sma10.accessor()} stroke={sma10.stroke()}/>
                    <LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()}/>
                    <LineSeries yAccessor={sma60.accessor()} stroke={sma60.stroke()}/>

                    <CurrentCoordinate yAccessor={sma5.accessor()} fill={sma5.stroke()} />
                    <CurrentCoordinate yAccessor={sma10.accessor()} fill={sma10.stroke()} />
                    <CurrentCoordinate yAccessor={sma20.accessor()} fill={sma20.stroke()} />
                    <CurrentCoordinate yAccessor={sma60.accessor()} fill={sma60.stroke()} />

                    <EdgeIndicator itemType="last" orient="right" edgeAt="right"
                        yAccessor={d => d.close} fill={d => d.close > d.open ? "#DB0000":"#6BA583" } />

                    <OHLCTooltip origin={[-40, 5]}  fontSize={10} />
                    <MovingAverageTooltip onClick={(e) => console.log(e)} origin={[-38, 15]}
                        calculators={[sma5, sma10,sma20,sma60]}  fontSize={12}/>
                </Chart>
                <Chart id={2} height={height*0.25}
                        yExtents={[d => d.volume, smaVolume50.accessor()]}
                        origin={(w, h) => [0, h - height*(2/6)]}>
                    <XAxis axisAt="bottom" orient="bottom" tickStroke="#FFFFFF" stroke="#FFFFFF"  />
                    <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".0s")}  showTicks={false}
                              tickStroke="#FFFFFF"  /> 
                     <MouseCoordinateX
                        at="bottom"
                        orient="bottom"
                        displayFormat={timeFormat("%H:%M")} />
                    <MouseCoordinateY
                        at="left"
                        orient="left"
                        displayFormat={format(".4s")} />

                    <BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#DB0000":"#6BA583" } />
                    <AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()}/>
                </Chart>
              {/* <Chart id={3} height={150}
                        yExtents={macdCalculator.accessor()}
                        origin={(w, h) => [0, h-150 ]} padding={{ top: 20, bottom: 10 }} >
                    <XAxis axisAt="bottom" orient="bottom" tickStroke="#FFFFFF" stroke="#FFFFFF"/>
                    <YAxis axisAt="right" orient="right" ticks={2} tickStroke="#FFFFFF" />

                    <MouseCoordinateX
                        at="bottom"
                        orient="bottom"
                        displayFormat={timeFormat("%H:%M")} />
                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format(".2f")} />

                    <MACDSeries calculator={macdCalculator} />
                    <MACDTooltip origin={[-38, 15]} calculator={macdCalculator}/>
                </Chart> */}
                <CrossHairCursor />
            </ChartCanvas>
        );
    }
}

CandleStickStockScaleChart.propTypes = {
    width: React.PropTypes.number.isRequired,
    ratio: React.PropTypes.number.isRequired,
    type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};
CandleStickStockScaleChart.defaultProps = {
    type: "svg",
};
CandleStickStockScaleChart = fitWidth(CandleStickStockScaleChart);

module.exports = CandleStickStockScaleChart;

