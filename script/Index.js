const isBottomToolBar=true;
const isTopToolBar=true;
function doOnPageLoad(){
    const nostart_times=document.getElementsByName("list_endtime");
    for(var i=0;i<nostart_times.length;i++){
        const timestr=getData(nostart_times[i].id,"EndTime");
        const countdownToEnd = new custom_countdownTimer(nostart_times[i].id, timestr);
        countdownToEnd.start();
    }
}

async function initActivityExtInfo() {
    const elements = document.querySelectorAll('[data-activity-ext]');
    let activityids='';
    elements.forEach(element => {
        const id = element.getAttribute('data-activity-id');
        activityids+=activityids==''?id:','+id;
    });
    const userlogs=await getUserLogs(activityids);
    const activityLogsDict = {};
    userlogs.forEach(log => {
        const { BusinessId, Action,Num } = log;
        if (!activityLogsDict[BusinessId]) {
            activityLogsDict[BusinessId] = {};
        }
        activityLogsDict[BusinessId][Action] =Num ;
    });
    elements.forEach(element => {
        const objstring = element.getAttribute('data-activity-ext');
        const obj = JSON.parse(objstring);
        if(obj.Reward){
            let html='';
            const id = element.getAttribute('data-activity-id');
            if(obj.Reward.PageView){
                const _reward=obj.Reward.PageView;
                let classname=activityLogsDict[id] && activityLogsDict[id][_reward.Action] ? 'activity_ext_reward_done' : 'activity_ext_reward';
                html+=html!=''?'<div class="activity_ext_jia"></div>':'';
                html+=`<div class="${classname}"><div class="activity_ext_reward_num">+${_reward.Num}</div><div>Click</div></div>`;
            }
            if(obj.Reward.WaitingTime){
                const _reward=obj.Reward.WaitingTime;
                let classname=activityLogsDict[id] && activityLogsDict[id][_reward.Action] ? 'activity_ext_reward_done' : 'activity_ext_reward';
                
                html+=html!=''?'<div class="activity_ext_jia"></div>':'';
                html+=`<div class="${classname}"><div class="activity_ext_reward_num">+${_reward.Num}</div><div>See ${_reward.WaitSeconds}s</div></div>`;
            }
            if(obj.Reward.Download){
                const _reward=obj.Reward.Download;
                html+=html!=''?'<div class="activity_ext_jia"></div>':'';
                html+=`<div class="activity_ext_reward"><div class="activity_ext_reward_num">+${_reward.Num}</div><div>Download</div></div>`;
            }
            if(obj.Reward.Register){
                const _reward=obj.Reward.Register;
                html+=html!=''?'<div class="activity_ext_jia"></div>':'';
                html+=`<div class="activity_ext_reward"><div class="activity_ext_reward_num">+${_reward.Num}</div><div>Register</div></div>`;
            }
            // const _sharereward=obj.Reward.Share?obj.Reward.Share:window.sysShare;
            // html+=html!=''?'<div class="activity_ext_jia"></div>':'';
            // html+=`<div class="activity_ext_reward"><div class="activity_ext_reward_num">+${_sharereward.Num}/r.</div><div>Share</div></div>`;
            
            element.innerHTML=html;       
        }
    });
}