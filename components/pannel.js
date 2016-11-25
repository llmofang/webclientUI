var React = require('react')
var TradePanel = require('./TradePanel')
var SearchInput = require('./search')
var PubSub = require('pubsub-js')
var Code = require('./CodeTable')


var Pannel = React.createClass({
   
   componentDidMount:function(){
      window.onresize = function () {
        var xx = document.getElementById("zz_1").clientHeight
        PubSub.publish('resizeHandler', xx);
      }
      var words = Code.stockData()

      $('.search').autocomplete({
        hints: words
      });
      /*this.showHowmany()*/
   },

   /*showHowmany:function(){
        
      return (
          <div className="chart col-xs-4 col-sm-4" id="zz_1" style={{height: kk/3}}> <TradePanel /> </div>
             )
         
   },*/
   render:function(){
      var kk = window.document.body.offsetHeight

      return (
         <div id='stockcharts'>
            <div className="chart col-xs-4 col-sm-4" id="zz_1" style={{height: kk/3}}> <TradePanel /> <SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" id="zz_2" style={{height: kk/3}}> <TradePanel /> <SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" id="zz_3" style={{height: kk/3}}> <TradePanel /> <SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" id="zz_4" style={{height: kk/3}}> <TradePanel /> <SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" id="zz_5" style={{height: kk/3}}> <TradePanel /> <SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" id="zz_6" style={{height: kk/3}}> <TradePanel /> <SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" id="zz_7" style={{height: kk/3}}> <TradePanel /> <SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" id="zz_8" style={{height: kk/3}}> <TradePanel /> <SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" id="zz_9" style={{height: kk/3}}> <TradePanel /> <SearchInput /></div>
         </div>
        )
   }
})

module.exports = Pannel;