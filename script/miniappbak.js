window.addEventListener('DOMContentLoaded', async () => {
     try{
        Telegram.WebApp.ready();
        Telegram.WebApp.BackButton.show();
        Telegram.WebApp.BackButton.onClick(function() {
            window.history.back();
        });
        Telegram.WebApp.expand();
        Telegram.WebApp.disableVerticalSwipes();
    }catch(e){
        processException(e);
    }
    initControl();
    initActivityApp();
    rewardShare();
    if ('app' in window) {
        if(window.app=='MyPointLogs'){
            await getUserLogs();
        }else if(window.app=='MyApplications'){
            await getUserCashApplications();
        }else if(window.app=='MyTask'){
            await getUserTask();
        }
    }

});


function getTgInitData() {
    return Telegram.WebApp.initData;
}
function getTgUser() {
    const user = Telegram.WebApp.initDataUnsafe.user;
    if (user) {
        return user;
    } else {
       return null;
    }
}
function doShare(shareCommand){
    window.Telegram.WebApp.switchInlineQuery(shareCommand, ['users', 'groups', 'channels']);
}
const dict = {
    PointLogType: {
        1: 'Rewards',
        2: 'Check in',
        3: 'Task Rewards',
        4: 'Withdrawal failed, refund',
        5: 'Share rewards',
        101: 'Rewards',
        102: 'Check in',
        103: 'Task Rewards',
        104: 'Withdrawal failed, refund',
        105: 'Share rewards',
        201: 'Top up',
        202: 'Withdrawal'
    },
    CashApplicationState: {
        0: 'Pending',
        1: 'Approved',
        2: 'Success',
        3: 'Failed'
    },
    UserTaskState: {
        0: 'Pending',
        2: 'Success',
        3: 'Failed'
    },
    UserTaskCategory: {
        1: 'DoSomeThingAfterGetPoint',
        2:'WattingTimeGetPoint'
    }
};
function processException(data) {
    if (data.ExceptionMessage) {
        const errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.style.display = 'none';
        errorContainer.style.color = '#000';
        errorContainer.style.fontWeight = 'bold';
        document.body.insertBefore(errorContainer, document.body.firstChild);
        if (errorContainer) {
            errorContainer.innerText = data.ExceptionMessage;
            errorContainer.style.display = 'block';
        } else {
            console.error('Error container element not found.');
        }
    }
}
async function rewardShare() {
    if(window.shareUserId==''){
        return;
    }
    const jsonstr=JSON.stringify({
        initdata: getTgInitData(),
        shareuserid:window.shareUserId
    });
     const result =await doWebService('GeneralWebServices', 'RewardShare', 'POST', '',jsonstr);
     if(result.Result){
            const data=result.Data;
            if(data.Result){
            }
     }else{
        processException(result);
     }
}



async function getUserLogs() {
    const jsonstr=JSON.stringify({
        initdata: getTgInitData()
    });
     const result =await doWebService('GeneralWebServices', 'GetPointLogUsersByUserId', 'POST', '',jsonstr);
     if(result.Result){
            const data=result.Data;
            var _html='';
            if(data.length==0){
                _html='<div class="contentpanel_list_nodata">No data</div>';
            }else{
                for(var i=0;i<data.length;i++){
                    const logtype=dict.PointLogType[data[i].LogType];
                        _html+='<div class="contentpanel_list_item"><div>'+data[i].Num+'</div><div>'+logtype+'</div><div>'+convertUtcToLocal(data[i].CreateTime)+'</div></div>';
                }
            }
            setContent('userPointLogs', _html);
     }else{
        processException(result);
     }
     setTgCloudData('lastVisitpoint', window.curTime);
}
async function initControl(){
    initControl_UserInfo();
    initControl_ToolBar();
    await initControl_UserAccount();
    await initControl_Message();
    await initControl_Recommend();

}
function initControl_UserInfo(){
    const user = getTgUser();
    if(isExist('userImg')){
        setContent('username', user.first_name);
    }
        
}
function initControl_ToolBar(){
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar_lefttop';
    document.body.appendChild(toolbar);
    //create index button
    if(window.app!="Index")
    {
        const indexButton = document.createElement('div');
        indexButton.className = 'index_button';
        indexButton.innerHTML = 'Home';
        toolbar.appendChild(indexButton);
        indexButton.addEventListener('click', () => {
            toPage('index');
        });
    }
    const user = getTgUser();
    // create share button
    const shareButton = document.createElement('div');
    shareButton.className = 'share_button';
    shareButton.innerHTML = 'Share';
    toolbar.appendChild(shareButton);
    shareButton.addEventListener('click', () => {
         //toPage(getShareUrl());
         const page=curObj!=null?"activity":window.app.toLowerCase(); 
         const activityId = curObj!=null?`${curObj.Category}-${curObj.Id}`:'0';
         const userId = getTgUser().id;
         const shareCommand = `share_${page}_${activityId}_${userId}`;
         doShare(shareCommand);
    });
}
async function initControl_UserAccount() {
    if(!isExist('control_UserAmount')){
        return;
    }
    const jsonstr=JSON.stringify({
        initdata: getTgInitData()
    });
     const result =await doWebService('GeneralWebServices', 'GetAccountUser', 'POST', '',jsonstr);
     if(result.Result){
            const data=result.Data;
            setContent('control_UserAmount', data?data.Amount:0);
     }else{
        processException(result);
     }
}
async function initControl_Message() {
    if(!isExist('control_Message')){
        return;
    }
    let lastVisitmypoint = await getTgCloudData('lastVisitpoint');
    const jsonstr=JSON.stringify({
        initdata: getTgInitData(),
        lastVisitmypoint:lastVisitmypoint
    });
     const result =await doWebService('GeneralWebServices', 'GetUserMessage', 'POST', '',jsonstr);
     if(result.Result){
            const data=result.Data;
            if(data.newpoint && data.newpoint.length>0)
            {
                let html="<div class='control_Message_List'>";
                for(var i=0;i<data.newpoint.length;i++)
                {
                    html+=`
                    <div class="control_Message_Item">
                    You get ${data.newpoint[i].Num} points(${dict.PointLogType[data.newpoint[i].LogType]}),     <a href="mypointlogs">details</a>
                    </div>`;
                }
                html+='</div>';
                setContent('control_Message', html);
            }
     }
}
async function initControl_Recommend() {
    if(!isExist('control_Recommend')){
        return;
    }
    const jsonstr=JSON.stringify({
        initdata: getTgInitData()
    });
     const result =await doWebService('GeneralWebServices', 'GetRecommendActivitys', 'POST', '',jsonstr);
     if(result.Result){
            const data=result.Data.Items;
            var _html='';
            for(var i=0;i<data.length;i++){
                _html+=`<div class="contentpanel_list_item" onclick="toPage('go?to=activity&type=${data[i].Category}&id=${data[i].Id}')">
                ${data[i].Title}
                </div>`;
            }
            setContent('control_Recommend', _html);
     }else{
        processException(result);
     }
}




async function getUserTask() {
    const jsonstr=JSON.stringify({
        initdata: getTgInitData()
    });
     const result =await doWebService('GeneralWebServices', 'GetUserTask', 'POST', '',jsonstr);
     if(result.Result){
            const data=result.Data;
            var _html='';
            for(var i=0;i<data.length;i++){
                const state=dict.UserTaskState[data[i].State];
                const category=dict.UserTaskCategory[data[i].Category];
                    _html+='<div class="contentpanel_list_item"><div>'+category+'</div><div>'+state+'</div><div>'+convertUtcToLocal(data[i].CreateTime)+'</div></div>';
            }
            setContent('userTask', _html);
     }else{
        processException(result);
     }
}

//activity.js
async function initActivityApp() {
    try{
    
        //check limit country
        if (window.limitCountry != null && window.limitCountry.length > 0) {
            const country = await getCountryByIP(window.curIP);
            if (!country) return;

            for (let i = 0; i < window.limitCountry.length; i++) {
                if (country.toLowerCase() === window.limitCountry[i].toLowerCase()) {
                    showMessageAndRedirect("This page is not accessible in your region...","index")
                    return;
                }
            }
        }
        if(curObj==null){
            return;
        }
        initActivity_processContent();
        //init mainlink
        curObj.Url =  curObj.Url.replace("{userid}", getTgUser().id);
        // init activity
        const jsonstr=JSON.stringify({
            initdata: getTgInitData(),
            activityid:curObj.Id
        });
         const result =await doWebService(window.app+'service', 'GetInitActivity', 'POST', '',jsonstr);
         if(result.Result){
                const data=result.Data;
                const callbackMethodName = `doOnActivityInited_${window.app}`;
                if (typeof this[callbackMethodName] === 'function') {
                    this[callbackMethodName](data);
                }
                // if(data.Result){ 
                //     doActivity(doActivity_callback);
                //     if(isVideoActivity){
                //         doOnVideoPlay_achieve = (playtiem) => {
                //             doActivity(doActivity_callback);
                //         };
                //         doOnVideoPlay_waitting = (playtiem) => {
                //             setContent('activitymsg', "After <span class='activity_second'>" + (curObj.ExtObj.WaitingTime - Math.floor(playtiem)) + "</span> seconds you will get points");
                            
                //         };
                //     }else{
                //         doOnScrollDown(startClaimCashBonus,'activitymsg');
                //     }
                // }else{
                //     setContent('activitymsg', data.Message);
                // }
         }else{
            processException(result);
         }




    }catch(e){
        console.error('initActivityApp:'+e);
    }
}
function doOnActivityInited_ActivityTaskApp(data){
    if(curObj.ExtObj.Task.Category==1)
    {
        const url = `go?to=task&userid=${getTgUser().id}&activityid=${curObj.Id}&url=${encodeURIComponent(curObj.Url)}`;
        var taskbtn = document.getElementById('taskbtn_mainlink');
        if(taskbtn)
        {
                taskbtn.addEventListener('click', () => {
                window.Telegram.WebApp.openLink(url);
            });
    
        }else{
            Telegram.WebApp.MainButton.setText(curObj.Title);
            Telegram.WebApp.MainButton.show();
            Telegram.WebApp.MainButton.onClick(() => {
                Telegram.WebApp.openLink(url);
            });
        }
    }
}

let doOnVideoPlay_waitting = (playtime) => {
   
};
const onVideoPlay_waitting = (playtime) => {
    doOnVideoPlay_waitting(playtime);
};
let doOnVideoPlay_achieve = (playtime) => {
   
};
const onVideoPlay_achieve = (playtime) => {
    doOnVideoPlay_achieve(playtime);
};
var isVideoActivity=false;
function initActivity_processContent()
{
    //初始化视频
    var video = document.getElementById('mainVideo');
    if(video){
        isVideoActivity=true;
        video.addEventListener('ended', () => {
            //videoOverlay.style.display = 'block';
            setDisplay('videoOverlay',true);
        });
        video.addEventListener('pause', () => {
            setDisplay('videoOverlay',true);
        });
        video.addEventListener('play', () => {
            setDisplay('videoOverlay',false);
        });
        if('WaitingTime' in curObj.ExtObj){
            video.addEventListener('timeupdate',function dotimeupdate(){
                if (video.currentTime >= curObj.ExtObj.WaitingTime) {
                    video.removeEventListener('timeupdate', dotimeupdate);
                    //onVideoPlay_achieve(video.currentTime);
                    const callbackMethodName = `doOnInit_${window.app}`;
                    if (typeof this[callbackMethodName] === 'function') {
                        this[callbackMethodName](data);
                    }

                }else{
                    onVideoPlay_waitting(video.currentTime);
                }
            });
    } 
    // video.addEventListener('canplay', () => {
    //     video.muted = false; 
    //     video.play().catch(error => {
    //         console.error('play error:', error);
    //     });
    // });

    // // 如果需要用户交互后播放，可以添加以下代码
    document.body.addEventListener('click', () => {
        video.muted = false; // 取消静音
        video.play().catch(error => {
            console.error('play error:', error);
        });
    }, { once: true }); 
        
        // video.play();
        // video.muted = false;   
    }
}


async function initActivityCashBonus() {
    
     const jsonstr=JSON.stringify({
        initdata: getTgInitData(),
        activityid:curObj.Id
    });
     const result =await doWebService(window.app+'service', 'CheckDo', 'POST', '',jsonstr);
     if(result.Result){
            const data=result.Data;
            if(data.Result){ 
                if(isVideoActivity){
                    doOnVideoPlay_achieve = (playtiem) => {
                        doActivity(doActivity_callback);
                    };
                    doOnVideoPlay_waitting = (playtiem) => {
                        setContent('activitymsg', "After <span class='activity_second'>" + (curObj.ExtObj.WaitingTime - Math.floor(playtiem)) + "</span> seconds you will get points");
                        
                    };
                }else{
                    doOnScrollDown(startClaimCashBonus,'activitymsg');
                }
            }else{
                setContent('activitymsg', data.Message);
            }
     }else{
        processException(result);
     }
}
function doActivity_callback(data) {
      if(data.Result){
        setContent('activitymsg', 'Congratulations! You have received points');
    }else{
        setContent('activitymsg', 'Sorry, you have not received points,Message:'+data.Message);
    }
}
function startClaimCashBonus() {
    var countdown = curObj.ExtObj.WaitingTime;
    var interval = setInterval(function() {
    setContent('activitymsg', "After <span class='activity_second'>"+countdown+"</span> seconds you will get points");
    countdown--;
    if (countdown < 0) {
        clearInterval(interval);
        doActivity(doActivity_callback);
    }
    }, 1000);
}
async function doActivity() {
    setContent('activitymsg', 'Waitting,Points are being issued to you');
    const jsonstr=JSON.stringify({
        initdata: getTgInitData(),
        activityid:curObj.Id
    });
  
    const result =await doWebService(window.app+'service', 'Do', 'POST', '',jsonstr);
    if(result.Result){
        const data=result.Data;
         const callbackMethodName = `doOnDoActivityed_${window.app}`;
         if (typeof this[callbackMethodName] === 'function') {
             this[callbackMethodName](data);
         }
      
    }else{
        processException(result);
    }
}
function doOnDoActivityed_ActivityDailyCheckInApp(data){
    if(data.Result){
        initActivityApp();
    }else{
        setContent('activitymsg', 'Sorry, you have not received points,Message:'+data.Message);
    }
}
function doOnActivityInited_ActivityDailyCheckInApp(data){
    var _html="<div class='dailycheckin_title'>You have check in for "+data.continuedays+" consecutive days</div>";
            _html+='<div class="dailycheckin_list">';
            for(var i=0;i<data.days.length;i++){
                    const classname=data.days[i].isCheckIn?'dailycheckin_item_point_checked':'dailycheckin_item_point';
                    const point=data.days[i].isCheckIn?"":data.days[i].point;
                    const done=data.days[i].isCheckIn?`<div class="dailycheckin_item_done">+${data.days[i].point}</div>`:"";
                    const day=data.days[i].day;
                    const date=data.days[i].date;
                    const classtoday=data.days[i].today?'_today':'';
                    _html+=`<div class="dailycheckin_item">
                                <div class='${classname}'>${point}</div>
                                <div class="dailycheckin_item_date${classtoday}">${date}</div>
                                ${done}
                            </div>`;
                            //<div class="dailycheckin_item_day${classtoday}">Day ${day}</div>
            }
            _html+='</div>';
            setContent('dailyCheckin', _html);
            var btnstr='Check in and get points';
            if(!data.today){
                btnstr='Today has been checked in';
            }
            var btn=document.createElement('div');
            btn.className=data.today?'dailycheckin_btn':'dailycheckin_btn_done';
            btn.innerHTML=btnstr;
            if(data.today){
                btn.addEventListener('click', () => {
                    doActivity();
                });
            }
            const btnCheckinDiv = document.getElementById('btnCheckin');
            while (btnCheckinDiv.firstChild) {
                btnCheckinDiv.removeChild(btnCheckinDiv.firstChild);
            }
            btnCheckinDiv.appendChild(btn);
}



function calcConvertRate()
{   var pointstr=getContent('pointNum');
    if(pointstr==''){
        pointstr=0;
    }
    const pointnum=parseInt(pointstr);
    const rate=parseFloat(getContent('convertRate'));
    const result=pointnum/rate;
    setContent('cashNum', "$"+result);
}
async function getUserCashApplications() {
    const jsonstr=JSON.stringify({
        initdata: getTgInitData()
    });
     const result =await doWebService('GeneralWebServices', 'GetCashApplicationUserByUserId', 'POST', '',jsonstr);
     if(result.Result){
            const data=result.Data;
            
            var _html='';
            for (var i = 0; i < data.length; i++) {
                const flowdirection = data[i].FlowDirection==0?'Fiat':'Crypto';
                const transfer=JSON.parse(data[i].TransferInfo);
                const state=dict.CashApplicationState[data[i].State];
                _html += `
                    <div class="applicationitem">
                           <div class="applicationitem_cash">
                                $${data[i].CashNum}
                           </div>
                           <div class="applicationitem_Transfer">
                              <div class="applicationitem_tags">
                                 <span class="tag">${flowdirection}</span>
                                 <span class="tag">${state}</span>
                                  ${convertUtcToLocal(data[i].CreateTime)}
                              </div>
                              <div>to : (${transfer.Gateway}) ${ConvertShortAddress(transfer.Account,18)}</div>
                           </div>
                    </div>
                `;
            }
            setContent('userapplications', _html);
     }else{
        processException(result);
     }
}
function submitWithdrawApplication(flowdirection)
{
    const pointnum=parseInt(getContent('pointNum'));
    const mininum=parseInt(getContent('minConvertPoint'));
    const userAmount=parseInt(getContent('userAmount'));
    const convertRate=parseFloat(getContent('convertRate'));
    const cashunit="USD";
    const cashnum= pointnum/convertRate;
    const gateway= "Paypal";
    const account=getContent('paymentAccount');

    if(pointnum>userAmount){
        tgAlert('Insufficient balance');
        return;
    }
    if(pointnum<mininum){
        tgAlert('Minimum redemption amount: '+mininum+' points');
        return;
    }
    if(account=='' || !checkEmail(account)){
        tgAlert('Please enter a valid account number in EMAIL format');
        return;
    }
    tgConfirm("Are you sure you want to convert "+pointnum+" points into "+cashnum+" "+cashunit+" and withdraw it to the "+account+" account on "+gateway+"?", function(confirmed) {
        if (confirmed) {
            const jsonstr=JSON.stringify({
                initdata: getTgInitData(),
                pointnum:pointnum,
                cashunit:cashunit,
                gateway:gateway,
                account:account,
                flowdirection:flowdirection
            });
            doWebService('GeneralWebServices', 'SubmitCashApplicationUser', 'POST', '',jsonstr).then((result)=>{
                if(result.Result){
                    const data=result.Data;
                    if(data.Result){
                        tgAlert('Withdrawal application submitted successfully');
                        toPage('MyApplications');
                    }else{
                        tgAlert('Withdrawal application failed,Message:'+data.Message);
                    }
                }else{
                    processException(result);
                }
            });
        } 
    });

}




