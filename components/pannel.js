var React = require('react')
var TradePanel = require('./TradePanel')
var SearchInput = require('./search')
var PubSub = require('pubsub-js')
var Code = require('./CodeTable')


var Pannel = React.createClass({
   
   componentDidMount:function(){
      window.onresize = function () {
        var xx = document.getElementById("zz_0").clientHeight
        PubSub.publish('resizeHandler', xx);
      }
      var words = Code.stockData()

      $('.search').autocomplete({
        hints: words,
      });

   },

   render:function(){
      var kk = window.document.body.offsetHeight

      return (
         <div id='stockcharts'>
            <div className="chart col-xs-4 col-sm-4" id="zz_0" style={{height: kk/3}}> <div id="zz_1" className='col-sm-10' style={{height: kk/3}}><TradePanel /></div> <div className='col-sm-2' style={{height: kk/3}}>十档行情</div> <SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <div id="zz_2" className='col-sm-10' style={{height: kk/3}}><TradePanel /></div>  <div className='col-sm-2' style={{height: kk/3}}>十档行情</div><SearchInput /></div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <div id="zz_3" className='col-sm-10' style={{height: kk/3}}><TradePanel /></div>  <div className='col-sm-2' style={{height: kk/3}}>十档行情</div><SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <div id="zz_4" className='col-sm-10' style={{height: kk/3}}><TradePanel /></div>  <div className='col-sm-2' style={{height: kk/3}}>十档行情</div><SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <div id="zz_5" className='col-sm-10' style={{height: kk/3}}><TradePanel /></div>  <div className='col-sm-2' style={{height: kk/3}}>十档行情</div><SearchInput /></div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <div id="zz_6" className='col-sm-10' style={{height: kk/3}}><TradePanel /></div>  <div className='col-sm-2' style={{height: kk/3}}>十档行情</div><SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <div id="zz_7" className='col-sm-10' style={{height: kk/3}}><TradePanel /></div> <div className='col-sm-2' style={{height: kk/3}}>十档行情</div> <SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <div id="zz_8" className='col-sm-10' style={{height: kk/3}}><TradePanel /></div>  <div className='col-sm-2' style={{height: kk/3}}>十档行情</div><SearchInput /> </div>
            <div className="chart col-xs-4 col-sm-4" style={{height: kk/3}}> <div id="zz_9" className='col-sm-10' style={{height: kk/3}}><TradePanel /></div>  <div className='col-sm-2' style={{height: kk/3}}>十档行情</div><SearchInput /></div>
         </div>
        )
   }
})

module.exports = Pannel;