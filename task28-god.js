//window.alert("god");
/*创建god对象*/
var god={};
/*要往地球轨道部分添加飞船，因而获得contain*/
var contain=basicFunction.getElement(".contain");
/*存放创建的飞船对象*/
god.spaceshipObject=[];
/*指挥官指挥上帝来创建飞船对象*/
god.createSpaceship=function(orbitId,powerSystem,energySystem){
  //1秒后再发送创建消息
//  setTimeout(function(){
    /*产生丢包现象，即指令没有发送到*/
    /*if(Math.random()<=0.3){
      basicFunction.showMessage("向轨道"+(orbitId+1)+"发送的create指令丢包了","red");
      return;
    }*/
    var spaceId=god.spaceshipObject.push(new Spaceship(orbitId,powerSystem,energySystem));//返回长度
    basicFunction.showMessage("god向轨道" + (orbitId + 1) + "发送 create 指令成功！", "green");
    //var spaceId=orbitId+1;
    var spaceDiv=document.createElement("div");
    spaceDiv.id="spaceship"+spaceId;
    spaceDiv.className="space-ship orbit-ship"+orbitId;
    spaceDiv.innerHTML="<div></div><p>100%</p>";
    contain.appendChild(spaceDiv);
//  },1000);

};
/*上帝创造介质并向未被摧毁的飞船广播消息*/
/*god.Mediator={

  sendMessage:function(message){
    //1s之后发送消息
    setTimeout(function(){
      if(Math.random()<=0.1){
        basicFunction.showMessage("向轨道"+(message.orbit+1)+"发送的"+message.command+"指令丢包了","red");
        return;
      }
      basicFunction.showMessage("向轨道"+(message.orbit+1)+"发送的"+message.command+"指令成功","green");
      var lens=god.spaceshipObject.length;
      window.alert(lens);
      for(var i=0;i<lens;i++){
        //判断飞船是否销毁，若已销毁，则不作处理
        if(god.spaceshipObject[i].destroyed){
          continue;
        }
        //未被销毁的接收广播消息
        god.spaceshipObject[i].radioSystem.receiveMessage(message);
        //god.moveTimer();
        //god.energyTimer();
      }
    },1000);
  }
};*/
/*开启运动定时器和能量定时器，用匿名函数，让其立即执行*/
/*现在重新创建一种介质*/
god.BUS={
  //经过300ms之后发送命令
  sendMessage:function(information){//发送的是二进制指令
    setTimeout(function(){
    //  window.alert(information);
      var msg=god.BUS.Adapter.decoding(information);//对二进制指令进行解码,没成功解码
      //window.alert(information);
    //  window.alert(msg);
      if(information.substr(0,1)==="1"){
        information=information.substr(1);
      }
      if(Math.random()<=0.1){
        basicFunction.showMessage("向"+msg.receiver+"发送的"+msg.message.command+"指令丢包了,重新发送，，，","red");
        god.BUS.sendMessage("1"+information);
        return;
      }
      if(msg.retried){
        basicFunction.showMessage("重新向"+msg.receiver+"发送的"+msg.message.command+"指令成功","pink");
      }else{
        basicFunction.showMessage("showMessage向"+msg.receiver+"发送的"+msg.message.command+"指令成功","green");
      }
      if(msg.message.command=="create"){
        god.createSpaceship(msg.message.id,msg.message.drive,msg.message.energy);
      }else{
        for (var i = 0; i < god.spaceshipObject.length; i++) {
          if(god.spaceshipObject[i].destroyed){
            continue;
          }
          god.spaceshipObject[i].radioSystem.receiveMessage(information);
        }
        commander.DC.receiveBroadcastMessage(information);
      }
    },300);
  },
  //对指挥官的指令进行二进制编码
  Adapter:{
    encode:function(orbitId,message){
      var binary="";
      switch (orbitId) {//注意这里的binary要用字符串
        case 0: binary+="0000"; break;
        case 1: binary+="0001"; break;
        case 2: binary+="0010"; break;
        case 3: binary+="0011"; break;
        case "commander":binary+="0100"; break;
      }
      switch (message.command) {
        case "create":
          binary+="00";
          switch (message.powerSystem) {
            case 0:binary+="00";break;
            case 1:binary+="01";break;
            case 2:binary+="10";break;
          }
          switch (message.energySystem) {
            case 0:binary+="00";break;
            case 1:binary+="01";break;
            case 2:binary+="10";break;
          }
          break;
        case "start":binary+="01";break;
        case "stop":binary+="10";break;
        case "destroy":binary+="11";break;
        case "broadcast":
       //window.alert( message.id.toString(2));
        binary+=("0"+message.id.toString(2)).substr(-2);
        //binary+=message.status.toString(2);
        binary+=message.status;
        binary+=("000000"+message.energy.toString(2)).substr(-7);
        binary+=("0"+message.powerSystem.toString(2)).substr(-2);
        binary+=("0"+message.energySystem.toString(2)).substr(-2);
        break;//忘记写了
      }
      return binary;
    },
    //对二进制命令进行解码
    decoding:function(data){
      var originalCommand={receiver:null,message:{},retried:false};
      if(data.substr(0,1)==="1"){
        originalCommand.retried=true;
        data=data.substr(1);//去掉重写标志位
      }
      switch (data.substr(0,4)) {//变成取前四位
        case "0000":
        originalCommand.receiver="轨道1";
      //  originalCommand.message.id="0";
      originalCommand.message.id=0;
        break;
        case "0001":
        originalCommand.receiver="轨道2";
        originalCommand.message.id=1;
        break;
        case "0010":
        originalCommand.receiver="轨道3";
        originalCommand.message.id=2;
        break;
        case "0011":
        originalCommand.receiver="轨道4";
        originalCommand.message.id=3;
        break;
        case "0100":
        originalCommand.receiver="commander";
        //originalCommand.message.id="3";
        break;
      }
      if(originalCommand.receiver!="commander"){
        switch(data.substr(4,2)){
          case "00":
          originalCommand.message.command="create";
            switch (data.substr(6,2)) {
              case "00":originalCommand.message.drive=0;break;
              case "01":originalCommand.message.drive=1;break;
              case "10":originalCommand.message.drive=2;break;
            }
            switch (data.substr(8,2)) {
              case "00":originalCommand.message.energy=0;break;
              case "01":originalCommand.message.energy=1;break;
              case "10":originalCommand.message.energy=2;break;
            }
          break;
          case "01":
          originalCommand.message.command="start";
          break;
          case "10":
          originalCommand.message.command="stop";
          break;
          case "11":
          originalCommand.message.command="destroy";
          break;
        }
    //  return data;
  }else{
      originalCommand.message.command="broadcast";
      originalCommand.message.id=parseInt(data.substr(4,2),2);
    //  window.alert(originalCommand.message.id);
      originalCommand.message.status=parseInt(data.substr(6,1),2);
      originalCommand.message.energy=parseInt(data.substr(7,7),2);
      originalCommand.message.powerSystem=parseInt(data.substr(14,2),2);
      originalCommand.message.energySystem=parseInt(data.substr(16,2),2);
  }
        return originalCommand;
    }
  }

};
(function(){
  var contain=basicFunction.getElement(".contain");
  /*设置飞船的运动定时器*/
  /*每隔0.1s让飞船转一度*/
  god.moveTimer=setInterval(function(){
    for(var i=0;i<god.spaceshipObject.length;i++){
      /*获取DOM飞船对象*/
      var ship=basicFunction.getElement("#spaceship"+(i+1));
      /*判断飞船是否已销毁且从DOM移除*/
      if(god.spaceshipObject[i].destroyed){
        if(!god.spaceshipObject[i].removed){
          contain.removeChild(ship);
          god.spaceshipObject[i].removed=true;
        }
        continue;
      }
      //调用飞船对象改变飞船角度
      god.spaceshipObject[i].powerSystem.changeDeg();
      //在DOM中改变
      ship.style.transform="rotate("+god.spaceshipObject[i].deg+"deg)";
      ship.style.msTransform="rotate("+god.spaceshipObject[i].deg+"deg)";
      ship.style.mosTransform="rotate("+god.spaceshipObject[i].deg+"deg)";
      ship.style.webkitTransform="rotate("+god.spaceshipObject[i].deg+"deg)";
      ship.style.oTransform="rotate("+god.spaceshipObject[i].deg+"deg)";
      //显示能源的减少，以及数字的减少
      var currentEnergy=god.spaceshipObject[i].energySystem.getCurrentEnergy();
      ship.firstElementChild.style.width=currentEnergy+"px";
      ship.lastElementChild.innerHTML=currentEnergy+"%";
    }
  },100);

  /*能量定时器*/
  god.energyTimer=setInterval(function(){
    for(var i=0;i<god.spaceshipObject.length;i++){
      //对已销毁的飞船不做处理
        if(god.spaceshipObject[i].destroyed){
          continue;
        }
        //太阳能充电
        god.spaceshipObject[i].energySystem.solarEnergy();
        //飞行的过程中能源消耗
        god.spaceshipObject[i].energySystem.consumeEnergy();
    }
  },1000);
  /*开启飞船广播定时器*/
  god.spaceshipBroadcastTimer=setInterval(function(){
    for(var i=0;i<god.spaceshipObject.length;i++){
      //对已销毁的飞船不做处理
        if(god.spaceshipObject[i].destroyed){
          continue;
        }
        god.spaceshipObject[i].radioSystem.broadcastMessage();
    }
  },1000);

})();
