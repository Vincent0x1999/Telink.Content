async function doOnPageLoad() {
    init();
}
async function init()
{
    doAction("Init",null,function(data){
        const objindexs=Object.keys(data);
        let html="";
        let todotask=[];
        for(let i=0;i<objindexs.length;i++)
        {
            const index=i+1;
            const task=data[index];
            let repeatstr="";
            let isDone=false;
            if(task.RepeatType==Dictionary.Activity.RepeatType.EveryDay){
                if(task.State.TotalTimes>=task.MaxTimes){
                    repeatstr=language("g_TotalFinish");
                    isDone=true;
                }else {
                    if(task.State.TodayTimes>=task.MaxTimesDay){
                        repeatstr=language("g_EveryDayFinish");
                        isDone=true;
                    }else{
                        repeatstr=language("g_EveryDay").replace("{0}",task.MaxTimesDay).replace("{1}",task.MaxTimesDay-task.State.TodayTimes);
                    }
                    repeatstr+="<br>"+language("g_Total").replace("{0}",task.MaxTimes).replace("{1}",task.MaxTimes-task.State.TotalTimes);
                }
            }else if(task.RepeatType==Dictionary.Activity.RepeatType.Total){
                if(task.State.TotalTimes>=task.MaxTimes){
                    repeatstr=language("g_TotalFinish");
                    isDone=true;
                }else {
                    repeatstr=language("g_Total").replace("{0}",task.MaxTimes).replace("{1}",task.MaxTimes-task.State.TotalTimes);
                }
            }
            let title=task.Title;
            let taskname="";
            let url="";
            let buttonstr=language("g_todo");
            let buttonremark="";
            let buttoneventparam="";
            if(task.Action==Dictionary.Activity.Action.JoinGroup || task.Action==Dictionary.Activity.Action.JoinChannel)
            {
                taskname=language("g_"+task.Action);
                url=task.Url;
                buttonstr=language("g_joinin");
                if(!isDone){
                    todotask.push(index);
                }
                buttoneventparam=`{Url:'${url}'}`;
            }else if(task.Action==Dictionary.Activity.Action.JoinIn)
            {
                taskname=language("task_"+task.Action);
                url="go?to=activity&id="+task.ActivityId;
                buttoneventparam=`{Url:'${url}'}`;
                if(!isDone){
                    todotask.push(index);
                }
    
            }
            if(task["Award"]){
                buttonremark="+"+task["Award"]["Num"]+language("g_Point");
            }
            let itemcss=isDone?"taskfinish":"task";
            html+=`<div id="assisttaks_${index}" class="${itemcss} grid left" style="--columns:1fr 70px">
                                <div>
                                    <div>${taskname}</div>
                                    <div class="remark">${title}</div>
                                </div>
                                <div id="assisttaks_btn_${index}" class="${isDone?'hidden':''}">
                                    <div  class="center"><button class="button3" onclick="dotask('${task.Action}',${index},${buttoneventparam},this)">${buttonstr}</button></div>
                                    <div class="remark center" style="font-size:0.8em">${buttonremark}</div>
                                </div>
                            </div>
                        `;
           
        }
        setContent("taskpanel",`<div class="right"><div class="refresh" onclick="setwaithandle(this);init();"></div></div>`+html);
        // alert("todotask:"+todotask.length);
        if(todotask.length>0){
            for(let i=0;i<todotask.length;i++){
                 doAction("DoTask",{index:todotask[i]},function(data){
                    if(data.Result){
                        init();
                    }
                });
            }
        
        }
       });
}
async function dotask(action,index,param,sender=null){
    if(sender){
        setwaithandle(sender);
    }
    if(action==Dictionary.Activity.Action.JoinGroup || action==Dictionary.Activity.Action.JoinChannel){
        tgOpenWindow(param.Url);
    }else if(action==Dictionary.Activity.Action.JoinIn){
        toPage(param.Url);
    }
}
function setTaskDisplay(sender){
    if(document.getElementById("taskpanel").style.display=="none"){
        document.getElementById("taskpanel").style.display="block";
        sender.innerText=language("g_close");
        sender.className="icon_xia";
        
    }else{
        document.getElementById("taskpanel").style.display="none";
        sender.innerText=language("g_expand");
        sender.className="icon_shang";
    }
}