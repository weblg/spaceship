//window.alert("commander");
/*指挥官的命令*/
commander={};
/*记录轨道上是否有飞船,false代表没有飞船*/
commander.orbitSpaceshipRecord=[false,false,false,false];
/*根据轨道上是否有飞船，下达是否创建飞船的命令*/
commander.createSpaceship=function(orbitId,powerSystem,energySystem){
  //var orbitId=parseInt(orbitId);
  if(this.orbitSpaceshipRecord[orbitId]){
    basicFunction.showMessage("轨道"+(orbitId+1)+"上，已经有飞船了","orange");
    return;//如果没有这个会继续执行下面的语句
  }
  this.orbitSpaceshipRecord[orbitId]=true;
  basicFunction.showMessage("在轨道"+(orbitId+1)+"上创建飞船","yellow");
//  god.createSpaceship(orbitId,powerSystem,energySystem);
god.BUS.sendMessage(god.BUS.Adapter.encode(orbitId,{//这里面含有创建飞船的命令
  command:"create",
  energySystem:energySystem,
  powerSystem:powerSystem
}));
};
/*发送飞行指令,先看轨道上是否有飞船*/
commander.startNavigate=function(orbitId){
  if(!this.orbitSpaceshipRecord[orbitId]){//this指向的是调用函数的那个对象
    basicFunction.showMessage("轨道"+(orbitId+1)+"没有飞船，无法起飞","orange");
    return;
  }
  basicFunction.showMessage("向轨道"+(orbitId+1)+"上的飞船发送起飞指令","yellow");
  //指挥官发送命令后，上帝将消息散布出去
  god.BUS.sendMessage(god.BUS.Adapter.encode(orbitId,{
    command:"start"
  }));
};
/*停止飞行指令*/
commander.stopNavigate=function(orbitId){
  if(!this.orbitSpaceshipRecord[orbitId]){
    basicFunction.showMessage("轨道"+(orbitId+1)+"没有飞船,不用停止","orange");
    return;
  };
  basicFunction.showMessage("向轨道"+(orbitId+1)+"上的飞船发送停止起飞指令","yellow");
  //上帝将停止命令散播出去
  god.BUS.sendMessage(god.BUS.Adapter.encode(orbitId,{
    command:"stop"
  }));
}
/*销毁飞船指令*/
commander.spaceshipDestroy=function(orbitId){
  if(!this.orbitSpaceshipRecord[orbitId]){
    basicFunction.showMessage("轨道"+(orbitId+1)+"没有飞船,不用销毁","orange");
    return;
  }
  this.orbitSpaceshipRecord[orbitId]=false;
  basicFunction.showMessage("向轨道"+(orbitId+1)+"发送销毁飞船指令","yellow");
  //上帝将消息散布出去
  god.BUS.sendMessage(god.BUS.Adapter.encode(orbitId,{
    command:"destroy"
  }));
};
/*控制中心接收来自飞船的信息*/
commander.DC={
  receiveBroadcastMessage:function(message){
    var msg=god.BUS.Adapter.decoding(message);
    if(msg.receiver!=="commander"){
      return;
    }
    var record=document.getElementById("record-"+msg.message.id);
    var table=document.getElementsByTagName("table")[0];
    if(record===null){
      /*创建出框架*/
      record=document.createElement("tr");
      //忘记给创建的框架id号码了
      record.id="record-"+msg.message.id;
      for (var i = 0; i < 5; i++) {
        record.appendChild(document.createElement("td"));
      }
      //要用table再添加
      table.appendChild(record);
    }
    //var items=document.getElementsByTagName("td");
    var items=record.getElementsByTagName("td");
  //  window.alert(msg.message.powerSystem);
    items[0].innerHTML="轨道"+(msg.message.id+1);
    items[1].innerHTML=basicFunction.systemType.powerType[msg.message.powerSystem].type;
    items[2].innerHTML=basicFunction.systemType.energyType[msg.message.energySystem].type;
    items[3].innerHTML=msg.message.status===0?"停止":"飞行";
    items[4].innerHTML=msg.message.energy+"%";
    /*记录下现在的时间*/
    record.dataset.update=Date.now();
  }
};
/*因为飞船每秒会广播一次自己的状态，那如果超过一秒没接收到怎么办*/
(function(){
  setInterval(function(){
    var table=document.getElementsByTagName("table")[0];
    var records=document.getElementsByTagName("tr");
    var t=Date.now();
    for(var i=0;i<records.length;i++){
      if(!records[i].dataset.update/*===null*/){
        continue;
      }
      if(t-records[i].dataset.update>3000){
        table.removeChild(records[i]);
      }else if(t-records[i].dataset.update>1000){
        records[i].getElementsByTagName("td")[3].innerHTML="失联";
      }
  }
},1000);
})();
