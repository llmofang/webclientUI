
var WSMGR=require('./WSMGR');
var PubSub = require('pubsub-js');
var d3 = require('d3');

var KlineMGR=(function(){
  //var onOpenCallBack;
	var ws;
	var subsyms=[];
  var isOpen = false;

	var handleOnOpen=function(e) {
		console.log('连接行情源成功');
    isOpen=true
    //onOpenCallBack()

	};
  
	var handleOnMessage=function(e) {
		console.log('marketws onmessage',e);
		var payload=JSON.parse(e.data);
		if (payload.length == 3 && payload[0] == "upd" && payload[1] == "ohlcv_ws") {
         var data=payload[2];
         for (var i = 0; i < data.length; i++) {
            var ohcv=formatData(data[i]);
            PubSub.publish(data[i].sym, ['kline',ohcv]);
            //console.log('postdata',Market)
         }
         //console.log('原始数据',data)	
		}
      //TODO 浮盈计算
    };

    var handleOnClose=function(e) {
    	console.log("行情源断开连接");
       //  alert("行情服务器未能连接,请刷新重新连接！！");
       //TradePanelMGR.changeState({marketWS:"未连接"});
      alert('行情服务器断开连接！！请刷新重试！！');
   };

   var handleOnError=function(e) {

   	//TradePanelMGR.changeState({marketWS:"错误"});
   	console.log('marketws onerror',e.data);
   };


   var init=function(callback){
      //this.onOpenCallBack=callback;
   	  ws=WSMGR.init('ws://139.196.77.165:5034',handleOnOpen,handleOnClose,handleOnMessage,handleOnError);
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
   		
        subData('ohlcv_ws', subsyms);
        console.log('subscribe stockcodes:',subsyms);
     
   		
   	}
   };

   var unsubscribe=function(sym){
   	for (var i = 0; i < subsyms.length; i++) {
   		if (subsyms[i].key == sym) {
   			if (subsyms[i].count <= 1) {
   				subsyms.splice(i, 1);
   				subData('ohlcv_ws', subsyms);
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
    if(isOpen){
   	  ws.send(serialize(cmdtxt));
     }else{
        console.log('can not subscribe stockcode marketws is connecting.....')
      }
   };



   
   var formatData = function(data){
     var Market = [{
      date:'',
      high:0,
      low:0,
      open:0,
      close:0,
      volume:0
     }]
     var year = new Date().getFullYear()
     var month = new Date().getMonth() + 1
     var today = new Date().getDate()
     if(month<10){
      month = "0"+month
     }
     if (today<10) {
      today = "0"+today
     }
     data.minute = year+"-"+month+"-"+today+" "+data.minute
     //console.log(data.minute)
     Market[0].date = new Date(d3.timeParse("%Y-%m-%d %H:%M")(data.minute).getTime())
     Market[0].high = (data.high / 10000).toFixed(2)
     Market[0].low = (data.low / 10000).toFixed(2)
     Market[0].open = (data.open /10000).toFixed(2)
     Market[0].close = (data.close / 10000).toFixed(2)
     Market[0].volume = data.size

     return Market
   }


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

module.exports = KlineMGR;