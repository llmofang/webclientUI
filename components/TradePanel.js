var React = require('react');
var ReStock =  require("react-stockcharts");
var { helper } = ReStock;
var { fitWidth,fitDimensions } = helper;
var d3 = require('d3');
var CandleStickStockScaleChart = require("./parts/CandleStickStockScaleChart") 
var MarketMGR = require('./parts/MarketMGR')
var TradePanel = require('./TradePanel')
var SearchInput = require('./search')
var TenMarket =require('./TenMarket')
var Code = require('./CodeTable')
var PubSub = require('pubsub-js')

var TradePannel = React.createClass({
    getInitialState:function() {
        var parentHeight = document.getElementById("zz_0").clientHeight
        var parentWidth = document.getElementById('zz_0').clientWidth
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
            height: parentHeight,
            width:parentWidth,
            stockcode:"",
            SubTopic: 'SubStock',
            first:true
        }
    },
    componentDidMount:function(){

        PubSub.subscribe('resizeHandler',(topic,data)=>{
          //console.log('resize',data)
          this.setState({height:data.height})
          this.setState({width:data.width})

        }) 
        var words = Code.stockData()

        $('.search_'+this.props.name).autocomplete({
          hints: words,
          onSubmit:(arg)=>{
             this.unsubscribe(this.state.stockcode)
             this.setState({first:true})
             this.subscribe(arg)
          }
        })  
    },


    subHandler: function(topic, data) {
 
      var flag = false
      var parHeight = document.getElementById("zz_0").clientHeight
          var parWidth = document.getElementById('zz_0').clientWidth
          //console.log("parHeight",parHeight)
          this.setState({height:parHeight})
          this.setState({width:parWidth})

        console.log("开始receiveData",data) 
        console.log("stateData",this.state.data)

        var olddata = this.state.data,
             oldLength = olddata.length,
             lastMinutes = olddata[oldLength-1].date.getMinutes(),
             newMinutes = data[0].date.getMinutes(),
             newdata 
        if(this.state.first){
            newdata = [data[0],data[0]]
            this.setState({first:false})
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
    },

     subscribe: function(sym) {
              MarketMGR.subscribe(sym);
              var token=PubSub.subscribe(sym, this.subHandler);
              this.setState({subTopic:token});
              this.setState({stockcode:sym})
              console.log('subscribe    ',sym);
              //console.log('subscribe subtopic',token);

      },

      unsubscribe: function(sym) {
              console.log('unsubscribe ',sym);
              console.log('unsubscribe subtopic',this.state.subTopic);
              MarketMGR.unsubscribe(sym);
              if (this.state.subTopic) {
                  PubSub.unsubscribe(this.state.subTopic);
              }
      },

      render: function () {
          var { type,width } = this.props;
          var kk = window.document.body.offsetHeight
          return (
            <div>
              <div className='col-sm-9' style={{height: kk/3}} width={this.state.width *0.75 } >
                <CandleStickStockScaleChart type={type}  data={this.state.data} height={this.state.height}/>
              </div> 
              
              <TenMarket  height={this.state.height} width={this.state.width *0.25 } />
            
              <SearchInput name={'search_'+this.props.name}/>
             </div> 
              
            
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