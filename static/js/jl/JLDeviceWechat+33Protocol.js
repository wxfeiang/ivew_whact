var TAG="JLDeviceWechar+33Protocol";var ble=require("./JLBleManager");var protocolRequest=require("./JLObuWechat33Request");var onfire=require("./onfire");var timeOut=require("./timeOut");var request33=require("./JLObuWechat33Request");var reveive33=require("./JLObuWechat33Reveice");var Code=require("./errorCode");var config=require("./JLZJConfig");var service=require("./JLService");var dataTool=require("./dataTool");var dataArray=[];var isConnect=false;var frame_total=1;var frame_count=1;var fireFlag="";var timeId;var receive_data="";var receive_data_total_len="";var wechat1=false;var wechat2=false;var timeId;export function scanDevice(nameFlag,timeOut,callBack){timeId=setTimeout(res=>{ble.stopScanDevice(res=>{callBack.call(this,{code:Code.timeOutCode(),err_msg:"扫描超时",data:null,msg:""})})},timeOut);ble.scanDevice(nameFlag,res=>{clearTimeout(timeId);callBack.call(this,res)})};export function stopScanDevice(callBack){ble.stopScanDevice(res=>{callBack.call(this,res)})};export function connectDevice(device,callBack){receive_data="";if(device==null||device=="undefined"){callBack.call(this,{code:10003,err_msg:"参数错误",data:null,msg:""});return}timeId=setTimeout(res=>{disConnectDevice();callBack.call(this,{code:Code.timeOutCode(),err_msg:"连接超时",data:null,msg:""})},timeOut.connectTimeOut());ble.stopScanDevice(res=>{if(res.code==Code.successCode()){ble.connectDevice(device,res=>{if(res.code==Code.successCode()){ble.characticValueChange(res.data,res=>{console.info(JSON.stringify(res));ble.initModule(res.data.id);if(res.code!=Code.successCode()){disConnectDevice();callBack.call(this,{code:Code.bleErrorCode(),err_msg:"连接失败",data:null,msg:""})}},res1=>{console.info("监听特征值变化:"+JSON.stringify(res1));dealReceiveData(res1.data.value,res=>{clearTimeout(timeId);callBack.call(this,{code:Code.bleSuccessCode(),err_msg:"连接成功",data:null,msg:""})})})}else{callBack.call(this,res)}})}else{callBack.call(this,res)}})};export function onDisconnet(callBack){ble.onDeviceDisconnect(res=>{isConnect=false;dataArray=[];frame_count=0;frame_total=0;onfire.clear();receive_data="";clearTimeout(timeId);callBack.call(this,res)})};export function disConnectDevice(callBack){receive_data="";ble.disConnect(res=>{isConnect=false;dataArray=[];frame_count=0;frame_total=0;onfire.clear();clearTimeout(timeId);callBack.call(this,res)})};export function checkCard(callBack){receive_data="";var cmd_arr=request33.checkCardRequest();timeId=setTimeout(res=>{callBack.call(this,{code:Code.timeOutCode(),err_msg:"检查卡片超时",data:null,msg:""});receive_data=""},timeOut.sendTime());ble.sendCommand(cmd_arr,res=>{if(res.code==Code.successCode()){clearTimeout(timeId);reveive33.recevieShakeHands(res=>{callBack.call(this,res)})}else{callBack.call(this,res)}})};export function getSystemInfo(callBack){receive_data="";timeId=setTimeout(res=>{callBack.call(this,{code:Code.timeOutCode(),err_msg:"读系统信息超时",data:null,msg:""});receive_data=""},timeOut.sendTime());service.getSystemInfo(res1=>{fireFlag=res1.fireFlag;receive_data=""},res2=>{clearTimeout(timeId);callBack.call(this,res2)})};export function getCarInfo(random,callBack){receive_data="";timeId=setTimeout(res=>{callBack.call(this,{code:Code.timeOutCode(),err_msg:"读车辆信息超时",data:null,msg:""});receive_data=""},timeOut.sendTime());service.getCarInfo(random,res1=>{console.log(TAG+"-----fireFlag--------"+JSON.stringify(res1));fireFlag=res1.fireFlag;receive_data=""},res2=>{clearTimeout(timeId);callBack.call(this,res2)})};export function writeObuIfo(type,value,callBack){receive_data="";timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:type=1?"写系统信息超时":"写车辆信息超时",data:null,msg:""})},timeOut.sendTime());service.systemInfo_WriteObuInfoFile([value],res1=>{receive_data="";fireFlag=res1.fireFlag},res2=>{clearTimeout(timeId);callBack.call(this,res2)})};export function getCardInfo(callBack){receive_data="";timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:"读取卡信息超时",data:null,msg:""})},timeOut.sendTime());service.getCardInfo(res1=>{fireFlag=res1.fireFlag;receive_data=""},res2=>{clearTimeout(timeId);callBack.call(this,res2)})};export function getCardholderInfo(callBack){receive_data="";timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:"读取持卡人信息超时",data:null,msg:""})},timeOut.sendTime());service.getCardholderInfo(res1=>{fireFlag=res1.fireFlag;receive_data=""},res2=>{clearTimeout(timeId);callBack.call(this,res2)})};export function writeCardInfomation(type,value,callBack){receive_data="";timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:type=1?"读写卡片发行信息超时":"写持卡人信息超时",data:null,msg:""})},timeOut.sendTime());service.cardInfo_WriteCardInfoFile([value],res1=>{fireFlag=res1.fireFlag;receive_data=""},res2=>{clearTimeout(timeId);callBack.call(this,res2)})};export function ICCReset(callBack){receive_data="";timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:"ICC复位超时",data:null,msg:""})},timeOut.sendTime());console.log(TAG+"cardInfo_ICCReset--------ICC复位");var cmd_arr=protocolRequest.ICCResetRequest();ble.sendCommand(cmd_arr,res=>{if(res.code==Code.successCode()){fireFlag=config.ICCReset();reveive33.receiveICCReset(res=>{clearTimeout(timeId);callBack.call(this,res)})}else{callBack.call(this,res)}})};export function ESAMRset(callBack){receive_data="";timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:"ICC复位超时",data:null,msg:""})},timeOut.sendTime());console.log(TAG+"carInfo_ESAMReset--------ESAM 复位");var cmd_arr=protocolRequest.ESAMReset();ble.sendCommand(cmd_arr,res=>{console.log(TAG+"sendCommand--------res"+JSON.stringify(res));fireFlag=config.ESAMReset();reveive33.receiveEsamReset(res=>{clearTimeout(timeId);console.log(TAG+"receiveEsamReset--------res"+JSON.stringify(res));callBack.call(this,res)})})};export function ICCChannel(cmd,callBack){var cmd_arr=protocolRequest.ICCChannelTransmission("00",[cmd]);timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:"ICC透传超时",data:null,msg:""})},timeOut.sendTime());ble.sendCommand(cmd_arr,res=>{if(res.code==Code.successCode()){fireFlag=config.ICCChannel();reveive33.receiveICCChannel(res=>{clearTimeout(timeId);callBack.call(this,res)})}else{callBack.call(this,res)}})};export function ESAMChannel(cmd,callBack){console.log(TAG+"ESAMChannel--------ESAM透传");var cmd_arr=protocolRequest.ESAMChannelTransmission("00",[cmd]);var cmd_arr=protocolRequest.ICCChannelTransmission("00",[cmd]);timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:"ESAM透传超时",data:null,msg:""})},timeOut.sendTime());ble.sendCommand(cmd_arr,res=>{console.log(TAG+"sendCommand--------res"+JSON.stringify(res));fireFlag=config.ESAMChannel();reveive33.receiveESAMChannel(res=>{clearTimeout(timeId);callBack.call(this,res)})})};export function creditForLoad_Init(pinCode,keyIndex,terminalNo,money,callBack){receive_data="";timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:"圈存初始化超时",data:null,msg:""})},timeOut.sendTime());service.creditForLoadInit(pinCode,keyIndex,terminalNo,money,res1=>{fireFlag=res1.fireFlag;receive_data=""},res2=>{clearTimeout(timeId);callBack.call(this,res2)})};export function creditForLoad_Load(time,mac2,callBack){receive_data="";timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:"圈存写卡超时",data:null,msg:""})},timeOut.sendTime());service.creditForLoad(time,mac2,res1=>{fireFlag=res1.fireFlag;receive_data=""},res2=>{clearTimeout(timeId);callBack.call(this,res2)})};export function readRetainFile(fileName,len,callBack){receive_data="";timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:"读取"+fileName+"文件信息超时",data:null,msg:""})},timeOut.sendTime());service.readRetainFile(fileName,len,res1=>{fireFlag=res1.fireFlag;receive_data=""},res2=>{clearTimeout(timeId);callBack.call(this,res2)})};export function writeRetainFile(value,callBack){receive_data="";timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:"写卡片信息超时",data:null,msg:""})},timeOut.sendTime());service.cardInfo_WriteCardInfoFile([value],res1=>{fireFlag=res1.fireFlag;receive_data=""},res2=>{clearTimeout(timeId);callBack.call(this,res2)})};export function getCardNum(callBack){receive_data="";timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:"读取卡号超时",data:null,msg:""})},timeOut.sendTime());service.getCardInfo(res1=>{fireFlag=res1.fireFlag;receive_data=""},res2=>{clearTimeout(timeId);if(res2.code==Code.successCode()){callBack.call(this,{code:Code.successCode(),err_msg:"获取卡号成功",data:res2.data.substr(24,16),msg:""})}else{callBack.call(this,res2)}})};export function getObuSN(callBack){receive_data="";timeId=setTimeout(res=>{callBack.call(this,{code:Code.timeOutCode(),err_msg:"获取合同序列号超时",data:null,msg:""});receive_data=""},timeOut.sendTime());service.getSystemInfo(res1=>{fireFlag=res1.fireFlag;receive_data=""},res2=>{clearTimeout(timeId);callBack.call(this,{code:Code.successCode(),err_msg:"获取合同序列号成功",data:res2.data.substr(20,16),msg:""})})};export function getCardRandNum(type,callBack){receive_data="";timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:"读取卡片随机数",data:null,msg:""})},timeOut.sendTime());service.getCardRandom(type,"04",res1=>{fireFlag=res1.fireFlag;receive_data=""},res2=>{clearTimeout(timeId);callBack.call(this,res2)})};export function getObuRadom(type,callBack){receive_data="";timeId=setTimeout(res=>{receive_data="";callBack.call(this,{code:Code.timeOutCode(),err_msg:"读随机数超时",data:null,msg:""})},timeOut.sendTime());console.log(TAG+"-----getObuRadom--------");service.getObuRandom(type,res1=>{fireFlag=res1.fireFlag;receive_data=""},res2=>{clearTimeout(timeId);callBack.call(this,res2)})};function dealReceiveData(data,callBack){if(receive_data.length>0){if(receive_data.indexOf("FE01")==-1){receive_data=""}}if(data!="0000000000000000000000000000000000000000"){if(data!=receive_data){receive_data+=data}}var blg=parseInt(receive_data.substring(4,8),16)*2==receive_data.length?true:false;if(blg){console.log("receive_data:"+receive_data);var flag_protocol=receive_data.substr(24,2);var flag_wechat=receive_data.substr(8,4);if(flag_protocol=="33"){console.log(TAG+"----fireFlag:"+fireFlag);onfire.fire(fireFlag,receive_data);receive_data=""}else if(flag_wechat=="2711"||flag_wechat=="2713"){if(flag_wechat=="2711"){var mac=receive_data.substring(40,44);var cmd_arr=protocolRequest.wechatInit1(mac);receive_data="";console.log("认证1",cmd_arr);ble.sendCommand(cmd_arr,res=>{console.log("发送认证1 :"+JSON.stringify(res))})}else if(flag_wechat=="2713"){console.log("认证2");var cmd_arr=protocolRequest.wechatInit2(mac);receive_data="";ble.sendCommand(cmd_arr,res=>{console.log("发送认证2 :"+JSON.stringify(res));receive_data="";callBack.call(this,{code:Code.bleSuccessCode(),msg:"连接成功",data:null})})}else{callBack.call(this,{code:Code.bleErrorCode,msg:"非法连接",data:null})}}else{callBack.call(this,{code:Code.bleErrorCode,msg:"非法连接",data:null})}}}