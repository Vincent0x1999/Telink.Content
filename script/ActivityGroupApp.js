window.addEventListener('DOMContentLoaded', async () => {
    displayGroupActivitys();
});
async function displayGroupActivitys(){
    let param={
        groupid:curGroup.Id,
        items:"CurrActivitys,WaitDrawActivitys,WaitStartActivitys,CloseActivitys"
    };
    if(curObj!=null){
        param.curactivityid=curObj.Id;
    }
    await doAction("GetGroupActivitys",param,function(result){
    try{
        // let runningactivits=[];
        // let waitingstartactivitys=[];
        // let closeactivitys=[];
        // const now=getNowUtcTime().timespan;
        // for(let i=0;i<result.CurrActivitys.length;i++)
        // {
        //     const activity=result.CurrActivitys[i];
        //     if(curObj!=null && curObj.Id==activity.Id){
        //         continue;
        //     }
           
        //     const starttimespan=new Date(activity.StartTime).getTime();
        //     const endtimespan=new Date(activity.EndTime).getTime();
        //     if(starttimespan<now && endtimespan>now){
        //         runningactivits.push(activity);
        //     }else if(starttimespan>now){
        //         waitingstartactivitys.push(activity);
        //     }else if(endtimespan<now){
        //         closeactivitys.push(activity);
        //     }
        // }
        // result.CloseActivitys.forEach(activity => {
        //     if(curObj==null || curObj.Id!=activity.Id){
        //         closeactivitys.push(activity);
        //     }
            
        // });
        
        // for(let i=0;i<result.CurrActivitys.length;i++)
        // {
        //     if(curObj.Id!=result.CurrActivitys[i].Id){
        //         runningactivits.push(result.CurrActivitys[i]);
        //     }
        // }
        // for(let i=0;i<result.WaitDrawActivitys.length;i++)
        //     {
        //         if(curObj.Id!=result.WaitDrawActivitys[i].Id){
        //             runningactivits.push(result.WaitDrawActivitys[i]);
        //         }
        //     }
            let html="";
    if(result.CurrActivitys!=null && result.CurrActivitys.length>0){
        html=`<div class="remark">${language("g_moreCur")}</div>`;
        result.CurrActivitys.forEach(activity => {
            html+=`<div class="taskrunning" style="background-color: #F1FBF1;" onclick="toPage('activity${curGroup.Category}appgroup?groupid=${curGroup.Id}&id=${activity.Id}')">
                 <div class="remark right">${language("g_DisToDraw")}：<span id="timedown${activity.Id}" name="timedown" data-time="${activity.EndTime}"></span></div>
                <div class="left">${activity.Title}</div>
                <div class="right remark" style="margin-top:5px">${activity.CurrPart==null?0:activity.CurrPart}${language("a_l_parts")}</div>
            </div>`;
        });
        setContent("runningactivityspannel",html);
    }
    if(result.WaitStartActivitys!=null && result.WaitStartActivitys.length>0){
        html=`<div class="remark">${language("g_moreComing")}</div>`;
        result.WaitStartActivitys.forEach(activity => {
            html+=`<div class="taskwaiting" onclick="toPage('activity${curGroup.Category}app?id=${activity.Id}')">
             <div class="remark right">${language("g_DisStart")}：<span id="timedown${activity.Id}" name="timedown" data-time="${activity.StartTime}"></span></div>
                <div class="left">${activity.Title}</div>
            </div>`;
        });
        setContent("waitingstartactivityspannel",html);
    }
    if(result.CloseActivitys!=null && result.CloseActivitys.length>0){
        html=`<div class="remark">${language("g_moreFinish")}</div>`;
        result.CloseActivitys.forEach(activity => {
            html+=`<div class="contentpanel" onclick="toPage('activity${curGroup.Category}app?id=${activity.Id}')">
                <div class="left">${activity.Title}</div>
                <div class="remark right" style="margin-top:3px">${language("g_EndTime")}:${getDateTimestr(activity.EndTime,"yyyy-MM-dd HH:mm(UTC)")} , ${activity.CurrPart==null?0:activity.CurrPart}${language("a_l_parts")}</div>
            </div>`;
        });
        setContent("closeactivityspannel",html);
    }
    const nostart_times=document.getElementsByName("timedown");
    for(var i=0;i<nostart_times.length;i++){
        const timestr=getData(nostart_times[i].id,"time");
        const countdownToEnd = new custom_countdownTimer(nostart_times[i].id, timestr);
        countdownToEnd.start();
    }
    }catch(error){
        alert(error);
    }
    });
    
}