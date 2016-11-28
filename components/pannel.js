var React = require('react')
var TradePanel = require('./TradePanel')
var PubSub = require('pubsub-js')
var MarketMGR = require('./parts/MarketMGR')


var Pannel = React.createClass({

   componentWillMount:function(){
      MarketMGR.init()
   },
   
   componentDidMount:function(){

      window.onresize = function () {
        var h = document.getElementById("zz_0").clientHeight
        var w = document.getElementById("zz_0").clientWidth
        var size = {
          height:h,
          width:w
        }
        
        PubSub.publish('resizeHandler', size);
      }

   },
   

   render:function(){
      var kk = window.document.body.offsetHeight

      return (
         <div id='stockcharts'>
            <div className="chart col-xs-4 col-sm-4" id="zz_0" style={{height: kk/3}}> <TradePanel name={1}/></div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <TradePanel name={2}/></div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <TradePanel name={3}/></div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <TradePanel name={4}/></div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <TradePanel name={5}/></div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <TradePanel name={6}/></div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <TradePanel name={7}/></div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <TradePanel name={8}/></div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <TradePanel name={9}/></div>
         </div>
        )
   }
})

module.exports = Pannel;