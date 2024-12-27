﻿window.addEventListener('DOMContentLoaded', async () => {
    displayGroupActivitys();
});
async function displayGroupActivitys(){
    await doAction("GetGroupActivitys",{groupid:curGroup.Id},function(result){
    try{
        let runningactivits=[];
        let waitingstartactivitys=[];
        let closeactivitys=[];
        const now=getNowUtcTime().timespan;
        for(let i=0;i<result.CurrActivitys.length;i++)
        {
            const activity=result.CurrActivitys[i];
            if(curObj!=null && curObj.Id==activity.Id){
                continue;
            }
           
            const starttimespan=new Date(activity.StartTime).getTime();
            const endtimespan=new Date(activity.EndTime).getTime();
            if(starttimespan<now && endtimespan>now){
                runningactivits.push(activity);
            }else if(starttimespan>now){
                waitingstartactivitys.push(activity);
            }else if(endtimespan<now){
                closeactivitys.push(activity);
            }
        }
        result.CloseActivitys.forEach(activity => {
            if(curObj==null || curObj.Id!=activity.Id){
                closeactivitys.push(activity);
            }
            
        });
        let html="";
    if(runningactivits.length>0){
        html=`<div class="remark">${language("g_moreCur")}</div>`;
        runningactivits.forEach(activity => {
            html+=`<div class="taskrunning" style="background-color: #F1FBF1;" onclick="toPage('activitypoolappgroup?groupid=${curGroup.Id}&id=${activity.Id}')">
                 <div class="remark right">${language("g_DisToDraw")}：<span id="timedown${activity.Id}" name="timedown" data-time="${activity.EndTime}"></span></div>
                <div class="left">${activity.Title}</div>
                <div class="right remark" style="margin-top:5px">${activity.CurrPart==null?0:activity.CurrPart}${language("a_l_parts")}</div>
            </div>`;
        });
        setContent("runningactivityspannel",html);
    }
    if(waitingstartactivitys.length>0){
        html=`<div class="remark">${language("g_moreComing")}</div>`;
                waitingstartactivitys.forEach(activity => {
            html+=`<div class="taskwaiting onclick="toPage('activitypoolappgroup?groupid=${curGroup.Id}&id=${activity.Id}')"">
             <div class="remark right">${language("g_DisStart")}：<span id="timedown${activity.Id}" name="timedown" data-time="${activity.StartTime}"></span></div>
                <div class="left">${activity.Title}</div>
            </div>`;
        });
        setContent("waitingstartactivityspannel",html);
    }
    if(closeactivitys.length>0){
        html=`<div class="remark">${language("g_moreFinish")}</div>`;
                closeactivitys.forEach(activity => {
            html+=`<div class="contentpanel" onclick="toPage('activitypoolappgroup?groupid=${curGroup.Id}&id=${activity.Id}')">
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