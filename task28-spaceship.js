//window.alert("spaceship");
/*创建一个飞船类*/

    //window.alert(chargechange);
 var Spaceship=function(orbitId,powerSystem,energySystem){
  // var myselect=controlMain.children[orbitId].getElementsByTagName("select");
   var that=this;
      this.orbitId=orbitId,
      this.deg=0,
      this.energy=100,
      this.destroyed=false,
      this.removed=false,
      this.status=0;/*0表示停止，1表示飞行*/
      this.degchange=basicFunction.systemType.powerType[powerSystem].rate,
      this.consumechange=basicFunction.systemType.powerType[powerSystem].consume,
      this.chargechange=basicFunction.systemType.energyType[energySystem].charge;
      /*this.indexpower=myselect[0].selectedIndex,
      this.indexenergy=myselect[1].selectedIndex,
      this.degchange=basicFunction.systemType.powerType[this.indexpower].rate,
      this.consumechange=basicFunction.systemType.powerType[this.indexpower].consume,
      this.chargechange=basicFunction.systemType.energyType[this.indexenergy].charge;*/

      /*动力系统*/
      this.powerSystem={
        //飞行状态
        start:function(){//这块不需要this
          if(that.energy>0){
            that.status=1;
            //window.alert(this.status);
          //  god.moveTimer();
          //  god.energyTimer();
           }
          },
        stop:function(){
            that.status=0;
        },
        changeDeg:function(){//速度
          if(that.status===1){
            that.deg+=that.degchange;
          }
          that.deg=that.deg%360;
        }
      };
      //能量系统
      this.energySystem={//补充能源速度
        //太阳能充电
        solarEnergy:function(){
          if(that.status!==1){
            that.energy+=that.chargechange;
          }

          if(that.energy>100){
            that.energy=100;
          }
        },
        //因飞行消耗的能量
       consumeEnergy:function(){//能耗
          if(that.status===1){
            that.energy-=that.consumechange;
          }
          if(that.energy<0){
            that.energy=0;
            that.status=0;
          }
        },
        //获取当前能量
        getCurrentEnergy:function(){
          return that.energy;
        }
      };
      //无线电系统，用于接收指挥官发送的消息
      this.radioSystem={
        receiveMessage:function(message){
          var msg=god.BUS.Adapter.decoding(message);
          if(msg.message.id!==that.orbitId){
            return;
          }
          switch(msg.message.command) {
            case "start":
                that.powerSystem.start();
                //god.moveTimer();
                //window.alert(message.command);
              break;
            case "stop":
                that.powerSystem.stop();
              break;
            case "destroy":
                that.destroySystem.destroy();
              break;
          }
        },
        broadcastMessage:function(){
          god.BUS.sendMessage(god.BUS.Adapter.encode("commander",{
            id:that.orbitId,
            energy:that.energy,
            status:that.status,
            energySystem:energySystem,
            powerSystem:powerSystem,
            command:"broadcast"
          }));
        }
      };
      //自我摧毁系统
      this.destroySystem={
        destroy:function(){
          that.destroyed=true;
        }
      };
 };
