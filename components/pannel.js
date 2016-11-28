var React = require('react')
var TradePanel = require('./TradePanel')
var PubSub = require('pubsub-js')
var MarketMGR = require('./parts/MarketMGR')


var Pannel = React.createClass({
   getInitialState:function(){
    return{
      number:[
              {col:'col-sm-12',id:"zz_0",index:'1',h:'1'}
              ]
    }
   },
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
   btn_1:function(){
      this.setState({number:[{col:'col-sm-12',id:"zz_0",index:'1',h:1}
                              ]})
   },
   btn_4:function(){
      this.setState({number:[{col:'col-sm-6',id:"zz_0",index:'1',h:2},
                              {col:'col-sm-6',id:"zz_1",index:'2',h:2},
                              {col:'col-sm-6',id:"zz_2",index:'3',h:2},
                              {col:'col-sm-6',id:"zz_3",index:'4',h:2}
                              ]})
   },
   btn_6:function(){
      this.setState({number:[{col:'col-sm-4',id:"zz_0",index:'1',h:2},
                              {col:'col-sm-4',id:"zz_1",index:'2',h:2},
                              {col:'col-sm-4',id:"zz_2",index:'3',h:2},
                              {col:'col-sm-4',id:"zz_3",index:'4',h:2},
                              {col:'col-sm-4',id:"zz_4",index:'5',h:2},
                              {col:'col-sm-4',id:"zz_5",index:'6',h:2}
                              ]})
   },
   btn_9:function(){
      this.setState({number:[{col:'col-sm-4',id:"zz_0",index:'1',h:3},
                              {col:'col-sm-4',id:"zz_1",index:'2',h:3},
                              {col:'col-sm-4',id:"zz_2",index:'3',h:3},
                              {col:'col-sm-4',id:"zz_3",index:'4',h:3},
                              {col:'col-sm-4',id:"zz_4",index:'5',h:3},
                              {col:'col-sm-4',id:"zz_5",index:'6',h:3},
                              {col:'col-sm-4',id:"zz_6",index:'6',h:3},
                              {col:'col-sm-4',id:"zz_7",index:'7',h:3},
                              {col:'col-sm-4',id:"zz_8",index:'8',h:3}
                              ]})
   },
  
   render:function(){
      var kk = window.document.body.offsetHeight
      var list = this.state.number.map(function(data,index){
        return <div className={"chart "+data.col}  id={data.id} style={{height: kk / data.h}}> <TradePanel name={index}/></div>
      });
      return (
         <div id='stockcharts'>
            {list}
         <div className="control">
             <button id="btn_1" onClick={this.btn_1}>1</button>
             <button id="btn_4" onClick={this.btn_4}>4</button>
             <button id="btn_6" onClick={this.btn_6}>6</button>
             <button id="btn_9" onClick={this.btn_9}>9</button>
          </div>
         </div>
        )
   }
})

module.exports = Pannel;