var basicFunction={};
basicFunction.getElement=function(ele){
  return document.querySelector(ele);
};
var console=basicFunction.getElement(".console");
var control=basicFunction.getElement(".control");
var supervise=basicFunction.getElement("#supervise");
//window.alert(console.className);
//window.alert(control.className);
basicFunction.drag=function(obj){
  var disX=0,
  disY=0,
  preX,
  preY,
  iSpeedX,
  iSpeedY,
  timer=null;
  obj.onmousedown=function(event){
    var that=this;
    var e=event||window.event;
    disX=e.clientX-that.offsetLeft;//鼠标点击与左边距的距离
    disY=e.clientY-that.offsetTop;
    preX=e.clientX;
    preY=e.clientY;
    document.onmousemove=function(event){
      //疏忽了鼠标移动事件
      var e=event||window.event;
      tempX=e.clientX-disX;
      tempY=e.clientY-disY;
      var width=document.documentElement.clientWidth-obj.offsetWidth;
      var height=document.documentElement.clientHeight-obj.offsetHeight;
      clearTimeout(timer);
      if(tempX>width){
        tempX=width;
      }else if(tempX<0){
        tempX=0;
      }
      if(tempY>height){
        tempY=height;
      }else if(tempY<0){
        tempY=0;
      }
      that.style.left=tempX+"px";//忘记加像素
      that.style.top=tempY+"px";
      //记录最终点击与开始位置的差
      iSpeedX = e.clientX - preX;
      iSpeedY = e.clientY - preY;
      preX = e.clientX;
      preY = e.clientY;
    };
    document.onmouseup=function(event){
      document.onmouseup=null;
      document.onmousemove=null;
    };
    //return false;//如果阻止默认行为的话，将导致select无法显示下拉框
  };
};
basicFunction.drag(control);
basicFunction.drag(console);
basicFunction.drag(supervise);
/*获取时间*/
basicFunction.getTime=function(){
  var date=new Date();
  var year=date.getFullYear();
  var month=date.getMonth()+1;
  var day=date.getDate();
  var hour=date.getHours();
  var minute=date.getMinutes();
  var second=date.getSeconds();
  return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
};
/*获取显示文本的控制台*/
var consoleText=basicFunction.getElement(".console-text");
/*在控制台显示消息*/
basicFunction.showMessage=function(message,textColor){
  var p=document.createElement("p");
  p.innerHTML=basicFunction.getTime()+" "+message;//换成this也是可以的
  p.style.color=textColor;

  var child=consoleText.firstElementChild;
  if(child){
    consoleText.insertBefore(p,child);
  }else{
    consoleText.appendChild(p);
  }
};
/*test*/
//basicFunction.showMessage("i love you","green");
//basicFunction.showMessage("all the time","green");
/*添加事件*/
basicFunction.addEvent=function(element,event,listner){
  if(element.addEventListener){
    element.addEventListener(event,listner,false);
  }else if(element.attachEvent){
    element.attachEvent("on"+event,listner);
  }else{
    element["on"+event]=listner;
  }
};
/*事件代理*/
basicFunction.delegateEvent=function(element,tag,eventName,listner){
  basicFunction.addEvent(element,eventName,function(){//换成this也是可以
    var event=arguments[0]||window.event;
    var target=event.target||event.srcElement;
    if(target&&(target.tagName.toLowerCase()==tag.toLowerCase())){
      listner.call(target,event);
    }
  })
};
var controlMain=basicFunction.getElement(".control-main");
/*动态添加选项option,添加选项对象,*/
basicFunction.systemType={
  powerType:[
    {type:"前进号",rate:1,consume:5},
    {type:"奔腾号",rate:2,consume:7},
    {type:"超越号",rate:3,consume:9}
  ],
  energyType:[
    {type:"劲量型",charge:2},
    {type:"光能型",charge:3},
    {type:"永久型",charge:4}
  ],
  systemSelect:function(){
    var select=document.getElementsByTagName("select");
  //  var type=select[0].dataset.type;
    //window.alert(type);
    var lens=select.length;//一共有8个select
    for(var j=0;j<lens;j++){
      type=select[j].dataset.type;
      if(type==="powerSystem"){
        var powerType=basicFunction.systemType.powerType;
        for (var i = 0; i < powerType.length; i++) {
          var option=document.createElement("option");
          option.setAttribute("value",i.toString());
        //  window.alert(powerType[i].type);
          text=powerType[i].type+"(rate:"+powerType[i].rate+"/s,consume:"+powerType[i].consume+"%/s)";
          option.innerHTML=text;
          select[j].appendChild(option);
        //  window.alert(select[j].children[i].innerHTML);
        }
      }else{
        var energyType=basicFunction.systemType.energyType;
        for (var i = 0; i <energyType.length; i++) {
          var option=document.createElement("option");
          option.setAttribute("value",i.toString());
          text=energyType[i].type+"(charge："+energyType[i].charge+"%/s)";
          option.innerHTML=text;
          select[j].appendChild(option);
        //  window.alert(select[j].length);
      }
    }
  }
 }
}
basicFunction.systemType.systemSelect();

/*添加按钮点击事件的处理程序*/
basicFunction.buttonClick=function(){
  //window.alert(this.innerText);
  var orbit=parseInt(this.parentNode.dataset.id);
  var message=this.dataset.type;
  //分别获取两个下拉框
  //var powerSystem=this.previousElementSibling.previousElementSibling;
  //var energySystem=this.previousElementSibling;
  switch (message) {
    case "create":
        //分别获取两个下拉框
        var powerSystem=this.previousElementSibling.previousElementSibling;
        var energySystem=this.previousElementSibling;
        var status=this.dataset.status;
        if(status=="create"){
          commander.createSpaceship(orbit,parseInt(powerSystem.value),parseInt(energySystem.value));
          this.innerHTML="自爆销毁";
          this.dataset.status="created";
          this.nextElementSibling.disabled=false;
          //选择之后点击创建则不能再选择
          powerSystem.disabled=true;
          energySystem.disabled=true;
        }else{
          commander.spaceshipDestroy(orbit);
          this.innerHTML="创建飞船";
          this.dataset.status="create";
          this.nextElementSibling.disabled=true;
          this.nextElementSibling.innerHTML="飞行";
          //还忘记了一句
          this.nextElementSibling.dataset.status="start";
          powerSystem.disabled=false;
          energySystem.disabled=false;
        }
      break;
    default:
        var status=this.dataset.status;
        if(status=="start"){
          commander.startNavigate(orbit);
          this.innerHTML="停止";
          //this.disabled=false;//这个在上面已经考了过了
          this.dataset.status="stop";
        }else{
          commander.stopNavigate(orbit);
          this.innerHTML="飞行";
        //  this.disabled=true;
          this.dataset.status="start";
        }
  }
};
/*获取控制操作面板，并添加按钮点击事件*/

basicFunction.delegateEvent(controlMain,"button","click",basicFunction.buttonClick);
