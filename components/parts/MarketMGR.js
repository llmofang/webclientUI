var Config=require('../parts/Config');
var TradePanelMGR=require('./TradePanelMGR');
var WSMGR=require('./WSMGR');
var PubSub = require('pubsub-js');
var MarketMGR=(function(){
	var ws;
	var subsyms=[];

	var handleOnOpen=function(e) {
		console.log('连接行情源成功');
		TradePanelMGR.changeState({marketWS:"连通"});
	};

	var handleOnMessage=function(e) {
		//console.log('marketws onmessage',e);
		var payload=JSON.parse(e.data);
		if (payload.length == 3 && payload[0] == "upd" && payload[1] == "Market") {
         var data=payload[2];
         for (var i = 0; i < data.length; i++) {
            var Market=conver2Makert(data[i]);
            PubSub.publish(Market.Sym, Market);
            //console.log('marketws onmessage',Market.Sym);
         }
			
		}
        //TODO 浮盈计算

    };

    var handleOnClose=function(e) {
    	console.log("行情源断开连接");
       //  alert("行情服务器未能连接,请刷新重新连接！！");
       TradePanelMGR.changeState({marketWS:"未连接"});
        alert('行情服务器断开连接！！请刷新重试！！');
   };

   var handleOnError=function(e) {

   	TradePanelMGR.changeState({marketWS:"错误"});
   	console.log('marketws onerror',e.data);
   };


   var init=function(){
   	ws=WSMGR.init(Config.MARKETWS,handleOnOpen,handleOnClose,handleOnMessage,handleOnError);
      return ws;

   };

   var subscribe=function(sym){
   	var found = false;
   	for (var i = 0; i < subsyms.length; i++) {
   		if (subsyms[i].key ==sym) {
   			found = true;
   			subsyms[i].count++;
   			break;
   		}
   	}
   	if (!found) {
   		subsyms.push({
   			key: sym,
   			count: 1
   		});
   		console.log('subscribe stockcodes:',subsyms);
   		subData('Market', subsyms);
   	}
   };

   var unsubscribe=function(sym){
   	for (var i = 0; i < subsyms.length; i++) {
   		if (subsyms[i].key == sym) {
   			if (subsyms[i].count <= 1) {
   				subsyms.splice(i, 1);
   				subData('Market', subsyms);
   				break;
   			} else {
   				subsyms[i].count--
   			}
   		}
   	}
   };

   var subData=function(tab, subs) {
   	var cmdtxt = ".u.sub[`" + tab + ";";
   	if (subs.length > 0) {
   		for (var i = 0; i < subs.length; i++) {
   			cmdtxt += "`";
   			cmdtxt += subs[i].key;
   		}
   	} else {
   		cmdtxt += "`NOTEXIT"
   	}
   	cmdtxt += "]";
   	console.log("Sending Subscribe Command:", cmdtxt);
   	ws.send(serialize(cmdtxt));
   };



   var conver2Makert=function(data){
   		var rawMarket = data;
   		if (rawMarket.sym != undefined) {
   			var Market = {
   				Sym: rawMarket.sym,
   				DataType: 'Market',
   				AskPrices: [],
   				AskVols: [],
   				BidPrices: [],
   				BidVols: []
   			};
   			for (var j = 1; j <= 10; j++) {
   				Market.AskPrices.push((rawMarket["nAskPrice" + j] / 10000).toFixed(2));
   				Market.AskVols.push((rawMarket["nAskVol" + j] / 100).toFixed(0));
   				Market.BidPrices.push((rawMarket["nBidPrice" + j] / 10000).toFixed(2));
   				Market.BidVols.push((rawMarket["nBidVol" + j] / 100).toFixed(0));
   			}
   			Market.Match = (rawMarket.nMatch / 10000).toFixed(2);
   			Market.Open = (rawMarket.nOpen / 10000).toFixed(2);
   			Market.High = (rawMarket.nHigh / 10000).toFixed(2);
   			Market.Low = (rawMarket.nLow / 10000).toFixed(2);
   			Market.Increase = (Market.Match - rawMarket.nPreClose/10000).toFixed(2);
   			Market.IncreaseP = ((Market.Increase * 100) / (rawMarket.nPreClose/10000)).toFixed(2);
   			return Market;

   		};
   	
   };


   var close=function(){
        ws.close();
    };


   return{
   	init:init,
   	subscribe:subscribe,
   	unsubscribe:unsubscribe,
      close:close

   };


})();

module.exports = MarketMGR;