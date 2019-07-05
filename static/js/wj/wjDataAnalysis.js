"use strict";var _wjUtils=require("./wjUtils.js"),_wjUtils2=_interopRequireDefault(_wjUtils);function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function analysisinitIC(e){var r=_wjUtils2.default.hexStr2byteArray(e),t={};return 73==r.byteLength?(0==(128&r[1])?(t.serviceCode=0,t.serviceInfo="初始化成功"):128==(128&r[1])?(t.serviceCode=1,t.serviceInfo="初始化失败"):(t.serviceCode=-3,t.serviceInfo="初始化异常"),t.serviceData={},t.serviceData.dataBuff=e):(t.serviceCode=-2,t.serviceInfo="获取卡片初始化失败，信息长度有误"),t}function analysisCardInfo(e){var r=_wjUtils2.default.hexStr2byteArray(e),t={},a=r.byteLength,s=_analysisIs9000(e);if(0!=s.serviceCode)return t=s;if(55!=a)return t.serviceCode=-3,t.serviceInfo="获取卡片信息失败，信息长度有误",t;var i=r.slice(2,10),l=r.slice(10,11),c=(r.slice(11,12),r.slice(12,14)),n=r.slice(14,22),o=r.slice(22,26),y=(r.slice(26,30),r.slice(30,42)),d=r.slice(42,43),f=r.slice(43,44),u=r.slice(44,45),v=r.slice(49,53),w=parseInt((255&v[0])<<24);return w+=parseInt((255&v[1])<<16),w+=parseInt((255&v[2])<<8),w+=parseInt(255&v[3]),_wjUtils2.default.showLog("cardIssuerID：",_wjUtils2.default.byteArray2hexStr(i),"bindedPlate",_wjUtils2.default.byteArray2hexStr(y),"balance:",w),t.serviceCode=0,t.serviceInfo="获取卡片信息成功",t.serviceData={},t.serviceData.cardIssuerID=_wjUtils2.default.byteArray2hexStr(i),t.serviceData.cardType=_wjUtils2.default.byteArray2hexStr(l),t.serviceData.roadswebID=_wjUtils2.default.byteArray2hexStr(c),t.serviceData.cardNo=_wjUtils2.default.byteArray2hexStr(n),t.serviceData.SignedDate=_wjUtils2.default.byteArray2hexStr(o),t.serviceData.bindedPlate=_wjUtils2.default.byteArray2hexStr(y),t.serviceData.userType=_wjUtils2.default.byteArray2hexStr(d),t.serviceData.vehColor=_wjUtils2.default.byteArray2hexStr(f),t.serviceData.vehType=_wjUtils2.default.byteArray2hexStr(u),t.serviceData.intbalance=w,t}function analysisCardOwnerRecord(e){var r=_wjUtils2.default.hexStr2byteArray(e),t={},a=r.byteLength,s=_analysisIs9000(e);if(0!=s.serviceCode)return t=s;if(59!=a)return t.serviceCode=-3,t.serviceInfo="获取持卡人信息失败，信息长度有误",t;var i=r.slice(2,3),l=r.slice(3,4),c=r.slice(4,24),n=r.slice(24,56),o=r.slice(56,57);return _wjUtils2.default.showLog("ownerName：",_wjUtils2.default.byteArray2hexStr(c),"ownerLicenseNumber：",_wjUtils2.default.byteArray2hexStr(n),"ownerLicenseType:",o),t.serviceCode=0,t.serviceInfo="获取持卡人信息成功",t.serviceData={},t.serviceData.ownerId=_wjUtils2.default.byteArray2hexStr(i),t.serviceData.staffId=_wjUtils2.default.byteArray2hexStr(l),t.serviceData.ownerName=_wjUtils2.default.byteArray2hexStr(c),t.serviceData.ownerLicenseNumber=_wjUtils2.default.byteArray2hexStr(n),t.serviceData.ownerLicenseType=_wjUtils2.default.byteArray2hexStr(o),t}function analysisCardTransactionRecord(e){var r=0,t=_wjUtils2.default.hexStr2byteArray(e),a=t.byteLength,s={};if(4<=a){for(s.serviceCode=0,s.serviceInfo="获取交易记录信息成功",s.serviceData={},s.serviceData.CardTransactionRecordData=[];r<a;){var i=t[r++],l=t[r]-1;if(console.log("WJ9000校验第"+i+"条：",t[r+l],t[r+l+1]),144!=t[r+l]||0!=t[r+l+1])return console.log("交易记录：",s),s;var c={};if(r++,c.onlineSn=_wjUtils2.default.byteArray2hexStr(t.slice(r,r+2)),r+=2,c.overdrawLimit=_wjUtils2.default.byteArray2hexStr(t.slice(r,r+3)),r+=3,c.transAmount=_wjUtils2.default.byteArray2hexStr(t.slice(r,r+4)),r+=4,c.transType=_wjUtils2.default.byteArray2hexStr(t.slice(r,r+1)),r+=1,c.terminalNo=_wjUtils2.default.byteArray2hexStr(t.slice(r,r+6)),r+=6,c.transDate=_wjUtils2.default.byteArray2hexStr(t.slice(r,r+4)),r+=4,c.transTime=_wjUtils2.default.byteArray2hexStr(t.slice(r,r+3)),r+=3,r+=2,s.serviceData.CardTransactionRecordData.push(c),"ffff"==_wjUtils2.default.byteArray2hexStr(c.onlineSn)||"0000"==_wjUtils2.default.byteArray2hexStr(c.onlineSn))return console.log("交易记录：",s),s}return console.log("交易记录：",s),s}return s.serviceCode=-3,s.serviceInfo="获取交易记录失败，信息长度有误",s}function analysisgetCardConsumeRecord(e){var r=_wjUtils2.default.hexStr2byteArray(e),t={},a=r.byteLength,s=0;if(4<=a){for(t.serviceCode=0,t.serviceInfo="获取过站信息成功",t.serviceData={},t.serviceData.CardConsumeRecordData=[];s<a;){var i=r[s++],l=r[s]-1;if(_wjUtils2.default.showLog("WJ9000校验第"+i+"条：",r[s+l],r[s+l+1]),144!=r[s+l]||0!=r[s+l+1])break;var c={};s++,c.tollRoadNetworkId=r.slice(2,4),s+=2,c.tollStationId=r.slice(4,6),s+=2,c.tollLaneId=r.slice(6,7),s+=1,c.timeUnix=r.slice(7,11),s+=4,c.vehicleModel=r.slice(11,12),s+=1,c.passStatus=r.slice(12,13),s+=1,c.reserve1=r.slice(13,22),s+=9,c.staffNo=r.slice(22,25),s+=3,c.mtcSequenceNo=r.slice(25,26),s+=1,c.staffNo=r.slice(26,38),s+=12,c.mtcSequenceNo=r.slice(38,42),s+=4,s+=2,t.serviceData.CardConsumeRecordData.push(c),console.log("cardConsumeRecordBean",c,s)}return console.log("过站信息：",t),t}return t.serviceCode=-3,t.serviceInfo="获取过站信息失败，信息长度有误",t}function analysisInitInfo(e){var r=_wjUtils2.default.hexStr2byteArray(e),t={},a=r.byteLength,s=_analysisIs9000(e);if(0!=s.serviceCode)return t=s;if(20!=a)return t.serviceCode=-3,t.serviceInfo="解析圈存初始化失败，信息长度有误",t;var i=r.slice(2,6),l=r.slice(6,8),c=r.slice(8,9),n=r.slice(9,10),o=r.slice(10,14),y=r.slice(14,18),d=parseInt((255&i[0])<<24);return d+=parseInt((255&i[1])<<16),d+=parseInt((255&i[2])<<8),d+=parseInt(255&i[3]),_wjUtils2.default.showLog("intbalance：",d,"pseudoRand:",_wjUtils2.default.byteArray2hexStr(o),"Mac1:",_wjUtils2.default.byteArray2hexStr(y),"CardSeq:",_wjUtils2.default.byteArray2hexStr(l)),t.serviceCode=0,t.serviceInfo="解析圈存初始化成功",t.serviceData={},t.serviceData.intbalance=d,t.serviceData.CardSeq=_wjUtils2.default.byteArray2hexStr(l),t.serviceData.keyVersion=_wjUtils2.default.byteArray2hexStr(c),t.serviceData.algTag=_wjUtils2.default.byteArray2hexStr(n),t.serviceData.pseudoRand=_wjUtils2.default.byteArray2hexStr(o),t.serviceData.Mac1=_wjUtils2.default.byteArray2hexStr(y),t}function analysisLoadCreadit(e){var r=_wjUtils2.default.hexStr2byteArray(e),t={},a=r.byteLength,s=_analysisIs9000(e);if(0!=s.serviceCode)return t=s;if(8!=a)return t.serviceCode=-3,t.serviceInfo="圈存解析失败，长度有误",t;var i=r.slice(2,6);return _wjUtils2.default.showLog("TAG",_wjUtils2.default.byteArray2hexStr(i)),t.serviceCode=0,t.serviceInfo="圈存成功",t.serviceData={},t.serviceData.TAG=_wjUtils2.default.byteArray2hexStr(i),t}function analysisgetObuSysInfo(e){var r=_wjUtils2.default.hexStr2byteArray(e),t={},a=r.byteLength,s=_analysisIs9000(e);if(0!=s.serviceCode)return t=s;if(31!=a)return t.serviceCode=-1,t.serviceInfo="OBU系统信息解析失败，长度有误",t;var i=r.slice(2,10),l=r.slice(10,11),c=r.slice(11,12),n=r.slice(12,20),o=r.slice(20,24),y=r.slice(24,28),d=r.slice(28,29);return _wjUtils2.default.showLog("contractProvider",_wjUtils2.default.byteArray2hexStr(i),"contractSerialNumber",_wjUtils2.default.byteArray2hexStr(n),"issueFlag",_wjUtils2.default.byteArray2hexStr(d)),t.serviceCode=0,t.serviceInfo="获取OBU系统成功",t.serviceData={},t.serviceData.contractProvider=_wjUtils2.default.byteArray2hexStr(i),t.serviceData.contractType=_wjUtils2.default.byteArray2hexStr(l),t.serviceData.contractVersion=_wjUtils2.default.byteArray2hexStr(c),t.serviceData.contractSerialNumber=_wjUtils2.default.byteArray2hexStr(n),t.serviceData.contractSignedDate=_wjUtils2.default.byteArray2hexStr(o),t.serviceData.contractExpiredDate=_wjUtils2.default.byteArray2hexStr(y),t.serviceData.issueFlag=_wjUtils2.default.byteArray2hexStr(d),t}function analysisGetRand(e){var r=_wjUtils2.default.hexStr2byteArray(e),t={},a=r.byteLength,s=_analysisIs9000(e);if(0!=s.serviceCode)return t=s;if(8!=a)return t.serviceCode=-1,t.serviceInfo="获取随机数失败，长度有误",t;var i=r.slice(2,6);return _wjUtils2.default.showLog("rand",_wjUtils2.default.byteArray2hexStr(i)),t.serviceCode=0,t.serviceInfo="获取随机数成功",t.serviceData={},t.serviceData.rand=_wjUtils2.default.byteArray2hexStr(i),t}function analysisVehCipherInfo(e){var r=_wjUtils2.default.hexStr2byteArray(e),t={},a=r.byteLength,s=_analysisIs9000(e);if(0!=s.serviceCode)return t=s;if(3<=a){var i=r.slice(2,a-2);return _wjUtils2.default.showLog("cipherVehInfo",_wjUtils2.default.byteArray2hexStr(i)),t.serviceCode=0,t.serviceInfo="获取密文车辆信息成功",t.serviceData={},t.serviceData.cipherVehInfo=_wjUtils2.default.byteArray2hexStr(i),t}return t.serviceCode=-1,t.serviceInfo="获取密文车辆信息失败，长度有误",t}function _analysisIs9000(e){var r=_wjUtils2.default.hexStr2byteArray(e),t={},a=0,s=r.byteLength;if(4<=s){for(;a<s;){var i=r[a++];if(a+=r[a]-1,_wjUtils2.default.showLog("WJ9000校验第"+i+"条：",r[a],r[a+1]),144!=r[a]||0!=r[a+1]){t.serviceCode=-1,t.serviceInfo="WJ第"+i+"包APDU非9000";break}a+=2,t.serviceCode=0,t.serviceInfo="9000认证成功"}return t}return t.serviceCode=-2,t.serviceInfo="9000认证失败，长度有误",t}function analysisDeviceInfo(e){var r=_wjUtils2.default.hexStr2byteArray(e),t={},a=0,s=r.byteLength,i=r[a++];switch(_wjUtils2.default.showLog(e),i){case 192:if(17!=s)return t.serviceCode=-1,t.serviceInfo="获取设备信息失败，信息长度有误",t;var l=r.slice(1);return _wjUtils2.default.showLog("deviceSN:",_wjUtils2.default.byteArray2hexStr(l)),t.serviceCode=0,t.serviceInfo="获取设备信息成功",t.serviceData={},t.serviceData.deviceSN=_wjUtils2.default.byteArray2hexStr(l),t;case 204:if(17!=s)return t.serviceCode=-1,t.serviceInfo="获取设备信息失败，信息长度有误",t;var c=r.slice(1,3),n=r.slice(3,4),o=(l=r.slice(4,12),r.slice(12,16)),y=r.slice(16);return _wjUtils2.default.showLog("deviceSN:",_wjUtils2.default.byteArray2hexStr(l),"bleMac:",_wjUtils2.default.byteArray2hexStr(o),"flag:",_wjUtils2.default.byteArray2hexStr(y)),t.serviceCode=0,t.serviceInfo="获取设备信息成功",t.serviceData={},t.serviceData.verId=_wjUtils2.default.byteArray2hexStr(c),t.serviceData.battery=_wjUtils2.default.byteArray2hexStr(n),t.serviceData.deviceSN=_wjUtils2.default.byteArray2hexStr(l),t.serviceData.bleMac=_wjUtils2.default.byteArray2hexStr(o),t.serviceData.flag=y,t;default:return t.serviceCode=-2,t.serviceInfo="获取设备信息失败，指令类型有误",_wjUtils2.default.showError("WJ获取设备信息失败:","指令类型有误"),t}}module.exports={analysisCardInfo:analysisCardInfo,analysisDeviceInfo:analysisDeviceInfo,analysisInitInfo:analysisInitInfo,analysisLoadCreadit:analysisLoadCreadit,analysisgetObuSysInfo:analysisgetObuSysInfo,analysisGetRand:analysisGetRand,_analysisIs9000:_analysisIs9000,analysisVehCipherInfo:analysisVehCipherInfo,analysisCardOwnerRecord:analysisCardOwnerRecord,analysisCardTransactionRecord:analysisCardTransactionRecord,analysisgetCardConsumeRecord:analysisgetCardConsumeRecord,analysisinitIC:analysisinitIC};