"use strict";

var { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } = ReStock;

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries, MACDSeries } = series;
var { discontinuousTimeScaleProvider } = scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = coordinates;
var { EdgeIndicator } = coordinates;

var { OHLCTooltip, MovingAverageTooltip, MACDTooltip } = tooltip;

var { XAxis, YAxis } = axes;
var { macd, ema, sma } = indicator;

var { fitWidth, TypeChooser } = helper;

function getDisplayName(ChartComponent) {
  var name = ChartComponent.displayName || ChartComponent.name || "ChartComponent";
  return name;
}

function updatingDataWrapper(ChartComponent) {
  const LENGTH = 130;

  class UpdatingComponentHOC extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        length: LENGTH,
        data: this.props.data.slice(0, LENGTH),
      }
      this.speed = 1000;
      this.onKeyPress = this.onKeyPress.bind(this);
    }
    componentDidMount() {
      document.addEventListener("keyup", this.onKeyPress);
    }
    componentWillUnmount() {
      if (this.interval) clearInterval(this.interval);
      document.removeEventListener("keyup", this.onKeyPress);
    }
    onKeyPress(e) {
      var keyCode = e.which;
      console.log(keyCode);
      switch (keyCode) {
        case 50: {
          // 2 (50) - Start alter data
          this.func = () => {
            if (this.state.length < this.props.data.length) {
              this.setState({
                length: this.state.length + 1,
                data: this.props.data.slice(0, this.state.length + 1),
              })
            }
          };
          break;
        }
        case 80:
          // P (80)
        case 49: {
          // 1 (49) - Start Push data
          this.func = () => {
            if (this.state.length < this.props.data.length) {
              this.setState({
                length: this.state.length + 1,
                data: this.props.data.slice(0, this.state.length + 1),
              })
            }
          };
          break;
        }
        case 27: {
          // ESC (27) - Clear interval
          this.func = null;
          if (this.interval) clearInterval(this.interval);
          break;
        }
        case 107: {
          // + (107) - increase the this.speed
          this.speed = Math.max(this.speed / 2, 50);
          break;
        }
        case 109:
        case 189: {
          // - (189, 109) - reduce the this.speed
          var delta = Math.min(this.speed, 1000);
          this.speed = this.speed + delta;
          break;
        }
      }
      if (this.func) {
        if (this.interval) clearInterval(this.interval);
        console.log("this.speed  = ", this.speed);
        this.interval = setInterval(this.func, this.speed);
      }
    }
    render() {
      var { type } = this.props;
      var { data } = this.state;

      return <ChartComponent ref="component" data={data} type={type} />;
    }
  }
  UpdatingComponentHOC.defaultProps = {
    type: "svg",
  };
  UpdatingComponentHOC.displayName = `updatingDataWrapper(${ getDisplayName(ChartComponent) })`;

  return UpdatingComponentHOC;
}


class CandleStickChartWithMACDIndicator extends React.Component {
  getChartCanvas() {
    return this.refs.chartCanvas;
  }
  render() {
    var { data, type, width, ratio } = this.props;

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
      <ChartCanvas ref="chartCanvas" ratio={ratio} width={width} height={600}
          margin={{left: 70, right: 70, top:20, bottom: 30}} type={type}
          seriesName="MSFT"
          data={data} calculator={[ema26, ema12, smaVolume50, macdCalculator]}
          xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}>
        <Chart id={1} height={400}
            yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
            padding={{ top: 10, bottom: 20 }}>
          <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
          <YAxis axisAt="right" orient="right" ticks={5} />

          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={d3.format(".2f")} />

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
        <Chart id={2} height={150}
            yExtents={[d => d.volume, smaVolume50.accessor()]}
            origin={(w, h) => [0, h - 300]}>
          <YAxis axisAt="left" orient="left" ticks={5} tickFormat={d3.format(".0s")}/>

          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={d3.format(".4s")} />

          <BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
          <AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()}/>
        </Chart>
        <Chart id={3} height={150}
            yExtents={macdCalculator.accessor()}
            origin={(w, h) => [0, h - 150]} padding={{ top: 10, bottom: 10 }} >
          <XAxis axisAt="bottom" orient="bottom"/>
          <YAxis axisAt="right" orient="right" ticks={2} />

          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={d3.timeFormat("%Y-%m-%d")} />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={d3.format(".2f")} />

          <MACDSeries calculator={macdCalculator} />
          <MACDTooltip origin={[-38, 15]} calculator={macdCalculator}/>
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }
};

CandleStickChartWithMACDIndicator.propTypes = {
  data: React.PropTypes.array.isRequired,
  width: React.PropTypes.number.isRequired,
  ratio: React.PropTypes.number.isRequired,
  type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithMACDIndicator.defaultProps = {
  type: "svg",
};

CandleStickChartWithMACDIndicator = fitWidth(CandleStickChartWithMACDIndicator);



var UpdatingComponentHOC = updatingDataWrapper(CandleStickChartWithMACDIndicator)

var parseDate = d3.timeParse("%Y-%m-%d");
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
  ReactDOM.render(
                   <UpdatingComponentHOC data={data} type="svg" />,
                   document.getElementById("chart")
                 );
});
