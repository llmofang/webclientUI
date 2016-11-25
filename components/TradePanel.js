var React = require('react');
var ReStock =  require("react-stockcharts");
var { helper } = ReStock;
var { fitWidth,fitDimensions } = helper;
var d3 = require('d3');
var CandleStickStockScaleChart = require("./parts/CandleStickStockScaleChart") 
var MarketMGR = require('./parts/MarketMGR')
//var resize = require('./parts/resize')
var PubSub = require('pubsub-js')

var TradePannel = React.createClass({
    getInitialState:function() {
        var parentHeight = document.getElementById("zz_1").offsetHeight
        //console.log(document.getElementById("zz_1").offsetHeight)
        var arr=[]
        for(var i=0; i<2;i++){
          var temp={};
            temp.date=new Date(d3.timeParse("%Y-%m-%d %H:%M")('2016-11-21 09:01').getTime());
            temp.open=27;
            temp.high=27;
            temp.low=27;
            temp.close=27;
            temp.volume=2120;
          arr.push(temp)
        }
        return {
            data: arr,
            height: parentHeight
        }
    },
    componentWillMount:function(){
        MarketMGR.init()
    },
    componentDidMount:function(){

        PubSub.subscribe('resizeHandler',(topic,data)=>{
          //console.log('resize',data)
          this.setState({height:data})
        })   
    

        var first = true
        var flag = false
        PubSub.subscribe('receiveData',(topic,data)=>{
          
            var parHeight = document.getElementById("zz_1").clientHeight
            var parWidth = document.getElementById('zz_1').clientWidth
            console.log("parHeight",parHeight)
            this.setState({height:parHeight,width:parWidth})

          

          var flag = false
          console.log("开始receiveData",data) 
          console.log("stateData",this.state.data)

          var olddata = this.state.data,
               oldLength = olddata.length,
               lastMinutes = olddata[oldLength-1].date.getMinutes(),
               newMinutes = data[0].date.getMinutes(),
               newdata
         /* if(flag == false && oldLength > 4){
               olddata.splice(0,2)
               flag = true
          }*/
            //console.log('first:' + first) 
          if(first){
              newdata = [data[0],data[0]]
              first = false
          }else{
               if(newMinutes != lastMinutes){
                   newdata = olddata.concat(data[0])
                }else{
                   console.log()
                   olddata.splice((oldLength-1) , 1 ,data[0])
                   newdata = olddata
                } 
          }
          this.setState({data:newdata})
        }) 
    },
    render: function () {
        var { type,width } = this.props;
        return (
            <CandleStickStockScaleChart type={type}  data={this.state.data} height={this.state.height}/>
        );
    }
});

TradePannel = fitDimensions(TradePannel)

TradePannel.propTypes = {
    type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};
TradePannel.defaultProps = {
    type:"svg",
};

module.exports = TradePannel;

