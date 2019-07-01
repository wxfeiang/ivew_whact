var TAG="JLObuWechat33Revice :";var onfire=require("./onfire");var config=require("./JLZJConfig");var JLObuWechat33UnPack=require("./JLObuWechat33UnPack");var code=require("./errorCode");var returnObjc=require("./JLReturnObject");var analysisManager=require("./JLAnalysisManager");export function receiveICCReset(callBack){onfire.on(config.ICCReset(),res=>{onfire.clear();console.log(TAG+"receiveICCReset:"+res);var data=JLObuWechat33UnPack.unpack33Protocol(res,1);var result=returnObjc.DevResult(1,data);callBack.call(this,result)})};export function receiveICCChannel(callBack){onfire.on(config.ICCChannel(),res=>{onfire.clear();console.log(TAG+"receiveICCChannel:"+res);onfire.clear();var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);callBack.call(this,result)})};export function receiveSelectMenu(callBack){onfire.on(config.SelectMenu(),res=>{onfire.clear();console.log(TAG+"receiveSelectMenu:"+res);var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);callBack.call(this,result)})};export function receive0015File(callBack){onfire.on(config.ICCFile0015(),res=>{onfire.clear();console.log(TAG+"receive0015File:"+res);var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);callBack.call(this,result)})};export function receive0016File(callBack){onfire.on(config.ICCFile0016(),res=>{onfire.clear();console.log(TAG+"receive0016File:"+res);var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);callBack.call(this,result)})};export function recevieCheckPIN(callBack){onfire.on(config.ICCPIN(),res=>{onfire.clear();console.log(TAG+"recevieCheckPIN:"+res);var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);callBack.call(this,result)})};export function recevieCreditForInit(callBack){onfire.on(config.ICCInitForLoad(),res=>{onfire.clear();console.log(TAG+"recevieCreditForInit:"+res);var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);result.data=analysisManager.analysisCreditForLoad_Init(result.data);callBack.call(this,result)})};export function recevieCreditForLoad(callBack){onfire.on(config.ICCCreditForLoad(),res=>{onfire.clear();console.log(TAG+"recevieCreditForLoad:"+res);var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);result.data=analysisManager.analysisCreditForLoad_Init(result.data);callBack.call(this,result)})};export function receiveEsamReset(callBack){onfire.on(config.ESAMReset(),res=>{onfire.clear();console.log(TAG+"receiveEsamReset:"+res);var data=JLObuWechat33UnPack.unpack33Protocol(res,1);var result=returnObjc.DevResult(1,data);callBack.call(this,result)})};export function receiveESAMChannel(callBack){onfire.on(config.ESAMChannel(),res=>{onfire.clear();console.log(TAG+"receiveESAMChannel:"+res);onfire.clear();var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);callBack.call(this,result)})};export function receiveSystemInfo(callBack){onfire.on(config.ReadSystemInfo(),res=>{onfire.clear();console.log(TAG+"receiveSystemInfo:"+res);onfire.clear();var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);callBack.call(this,result)})};export function receiveCarInfo(callBack){onfire.on(config.ReadCarInfo(),res=>{onfire.clear();console.log(TAG+"receiveCarInfo:"+res);var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);callBack.call(this,result)})};export function receiveObuRandom(callBack){onfire.on(config.ESAMRandom(),res=>{onfire.clear();console.log(TAG+"receiveObuRandom:"+res);var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);callBack.call(this,result)})};export function receiveCardRandom(callBack){onfire.on(config.ICCRandom(),res=>{onfire.clear();console.log(TAG+"receiveObuRandom:"+res);var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);callBack.call(this,result)})};export function receiveWriteObuInfo(callBack){onfire.on(config.WriteObuInfo(),res=>{onfire.clear();console.log(TAG+"receiveWriteObuInfo:"+res);var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);callBack.call(this,result)})};export function receiveWriteCardInfo(callBack){onfire.on(config.WriteCardInfo(),res=>{onfire.clear();console.log(TAG+"receiveWriteCardInfo:"+res);onfire.clear();var data=JLObuWechat33UnPack.unpack33Protocol(res,0);var result=returnObjc.DevResult(0,data);callBack.call(this,result)})};