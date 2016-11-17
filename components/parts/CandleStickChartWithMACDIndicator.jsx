"use strict";

import React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart, series, scale, coordinates, ,annotation, algorithm,tooltip, axes, indicator, helper } from "react-stockcharts";


var { CandlestickSeries, BarSeries, LineSeries, AreaSeries, MACDSeries } = series;
var { discontinuousTimeScaleProvider } = scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = coordinates;
var { EdgeIndicator } = coordinates;

var { Annotate, LabelAnnotation, Label } = annotation;

var { TooltipContainer, OHLCTooltip, MovingAverageTooltip, MACDTooltip } = tooltip;

var { XAxis, YAxis } = axes;
var { macd, ema, sma } = indicator;

var { fitWidth, TypeChooser } = helper;

var algorithm = algorithm.default;

class CandleStickChartWithMACDIndicator extends React.Component {
  getChartCanvas() {
    return this.refs.chartCanvas;
  }
  render() {
    var { data, type, width, title } = this.props;    

    var ema5 = ema()
      .id(0)
      .windowSize(5)
      .merge((d, c) => {d.ema5 = c})
      .accessor(d => d.ema5);
      
    var ema10 = ema()
      .id(1)
      .windowSize(10)
      .merge((d, c) => {d.ema10 = c})
      .accessor(d => d.ema10);

    var ema20 = ema()
      .id(2)
      .windowSize(20)
      .merge((d, c) => {d.ema20 = c})
      .accessor(d => d.ema20);  
      
    var ema60 = ema()
      .id(3)
      .windowSize(60)
      .merge((d, c) => {d.ema60 = c})
      .accessor(d => d.ema60);    

    var macdCalculator = macd()
      .fast(5)
      .slow(10)
      .signal(9)
      .merge((d, c) => {d.macd = c})
      .accessor(d => d.macd);

    var smaVolume50 = sma()
      .id(5)
      .windowSize(10)
      .source(d => d.volume)
      .merge((d, c) => {d.smaVolume50 = c})
      .accessor(d => d.smaVolume50);
    
    var annotationProps = {
      fontFamily: "Glyphicons Halflings",
      fontSize: 20,
      fill: "#060F8F",
      opacity: 0.8,
      text: d => d.match_items,
      y: ({ yScale }) => yScale.range()[0],
      onClick: console.log.bind(console),
      tooltip: d => d.match_items,
    };    
    
    return (
      <ChartCanvas ref="chartCanvas" width={width} height={750}
          margin={{left: 70, right: 70, top:20, bottom: 30}} type={type}
          seriesName="MSFT"
          data={data} calculator={[ema5, ema10, ema20, ema60, smaVolume50, macdCalculator]}
          xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}>
        
        <Label x={(width-140)/ 2} y={30}
          fontSize="30" text={title} />
        
        <Chart id={1} height={400}
            yExtents={[d => [d.high, d.low], ema5.accessor(), ema60.accessor()]}
            padding={{ top: 10, bottom: 20 }}>
          <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
          <YAxis axisAt="right" orient="right" ticks={5} />

          <MouseCoordinateY id={0}
            at="right"
            orient="right"
            displayFormat={d3.format(".2f")} />

          <CandlestickSeries fill={d => d.close > d.open ? "#FF0000" : "#6BA583" }/>
          
          <LineSeries yAccessor={ema5.accessor()} stroke={ema5.stroke()}/>
          <LineSeries yAccessor={ema10.accessor()} stroke={ema10.stroke()}/>
          <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
          <LineSeries yAccessor={ema60.accessor()} stroke={ema60.stroke()}/>

          <CurrentCoordinate id={1} yAccessor={ema60.accessor()} fill={ema60.stroke()} />
          <CurrentCoordinate id={2} yAccessor={ema5.accessor()} fill={ema5.stroke()} />

          <EdgeIndicator itemType="last" orient="right" edgeAt="right"
            yAccessor={d => d.close} fill={d => d.close > d.open ? "#FF0000" : "#6BA583" }/>
        </Chart>
        <Chart id={2} height={150}
            yExtents={[d => d.volume, smaVolume50.accessor()]}
            origin={(w, h) => [0, h - 300]}>
          <YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format("s")}/>

          <MouseCoordinateY id={0}
            at="left"
            orient="left"
            displayFormat={d3.format(".4s")} />

          <BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#FF0000" : "#6BA583" } />
          
        </Chart>
        <Chart id={3} height={150}
            yExtents={macdCalculator.accessor()}
            origin={(w, h) => [0, h - 150]} padding={{ top: 10, bottom: 10 }} >
          <XAxis axisAt="bottom" orient="bottom"/>
          <YAxis axisAt="right" orient="right" ticks={2} />

          <MouseCoordinateX id={0}
            at="bottom"
            orient="bottom"
            displayFormat={d3.time.format("%Y-%m-%d %H:%M:%S")} />
          <MouseCoordinateY id={0}
            at="right"
            orient="right"
            displayFormat={d3.format(".2f")} />

          <MACDSeries calculator={macdCalculator} />
        </Chart>
        <CrossHairCursor />
        <EventCapture mouseMove zoom pan />
        <TooltipContainer>
          <OHLCTooltip forChart={1} origin={[-40, 0]}/>
          <MovingAverageTooltip forChart={1} onClick={(e) => console.log(e)} origin={[-38, 15]}
            calculators={[ema5, ema10, ema20, ema60]}/>
          <MACDTooltip forChart={3} origin={[-38, 15]} calculator={macdCalculator}/>
        </TooltipContainer>
        
        <Annotate id={0} chartId={1} with={LabelAnnotation}
          when={d => d.interest == 1 /* some condition */}
          usingProps={annotationProps} />
      </ChartCanvas>
    );
  }
};

CandleStickChartWithMACDIndicator.propTypes = {
  data: React.PropTypes.array.isRequired,
  width: React.PropTypes.number.isRequired,
  type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithMACDIndicator.defaultProps = {
  type: "svg",
};

CandleStickChartWithMACDIndicator = fitWidth(CandleStickChartWithMACDIndicator);

export default CandleStickChartWithMACDIndicator;
