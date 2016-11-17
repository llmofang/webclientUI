var WSMGR=(function(){
	var init=function(addr,onopen,onclose,onmessage,onerror){
		var ws;
		if ("WebSocket" in window) {
                     //连接行情kdb
                     ws = new WebSocket(addr);
                     ws.binaryType = 'arraybuffer';
                     ws.onopen =onopen;
                     ws.onclose = onclose;
                     ws.onmessage = onmessage;
                     ws.onerror = onerror;
                     
                 } 
        else alert("WebSockets not supported on your browser.");

        return ws;


	};
	return{
		init:init
	}

})();

module.exports=WSMGR