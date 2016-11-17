var React = require('react');
var ReStock =  require("react-stockcharts");
var d3 = require('d3');
var MarketMGR=require('./parts/MarketMGR')

/*var CandleStickChartWithUpdatingData = require('./parts/CandleStickChartWithUpdatingData');*/
var CandleStickStockScaleChart = require("./parts/CandleStickStockScaleChart") 
/*var CandleStickChartWithZoomPan = require("./parts/zoom") */
/*var  MarketMGR = require('../components/MarketMGR')*/
var TradePannel = React.createClass({
    getInitialState:function() {
        var arr=[]
        for(var i=0; i<2;i++){
            var temp={};
            temp.date=new Date(d3.timeParse("%Y-%m-%d")('2012-02-04').getTime());
            temp.open=0;
            temp.high=0;
            temp.low=0;
            temp.close=0;
            temp.volume=0;
          arr.push(temp)
        }
        return {
            data: arr
        }
    },
    componentWillMount:function(){
        MarketMGR.init()
        //MarketMGR.*/
        d3["tsv"]("//rrag.github.io/react-stockcharts/data/MSFT.tsv", (err, data) => {
            data.forEach((d, i) => {
                d.date = new Date(d3.timeParse("%Y-%m-%d")(d.date).getTime());
                d.open = +d.open;
                d.high = +d.high;
                d.low = +d.low;
                d.close = +d.close;
                d.volume = +d.volume;
            });
            this.setState({data:data})   
        });
    },
    
    render: function () {
        console.log('123');
        var { type } = this.props;
        return (
            <CandleStickStockScaleChart type={type}  data={this.state.data} />
        );
    }
});

TradePannel.propTypes = {
    type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};
TradePannel.defaultProps = {
    type:"svg",
    title:'hello!'
};


module.exports = TradePannel;

