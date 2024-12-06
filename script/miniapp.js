window.addEventListener('DOMContentLoaded', async () => {
     try{
        const configimages = document.querySelectorAll('img.imgset');
        configimages.forEach(img => {
            const relativePath = img.getAttribute('data-src');
            img.src = fileUrl(relativePath);
        });
        
        Telegram.WebApp.ready();

        if (window.app === 'Index') {
            Telegram.WebApp.BackButton.hide();
        } else {
            if (window.history.length > 1){
                Telegram.WebApp.BackButton.show();
                Telegram.WebApp.BackButton.onClick(() => {
                    if (document.referrer && document.referrer.toLowerCase().includes('/index')) {
                        window.location.href = 'index';
                    } else {
                        // 否则返回上一页
                        history.back();
                    }
                });
            }
        }
        // if (window.app == 'Index') {
        //     Telegram.WebApp.BackButton.isVisible=false;
        // }else 
        // if (window.history.length > 1){
        //     Telegram.WebApp.BackButton.show();
        //         Telegram.WebApp.BackButton.onClick(function() {
        //             window.history.back();
        //         });
        //     // if (typeof isSupportBack != 'undefined' && isSupportBack) {
        //     //     Telegram.WebApp.BackButton.show();
        //     //     Telegram.WebApp.BackButton.onClick(function() {
        //     //         window.history.back();
        //     //     });
        //     // }
        // }
        Telegram.WebApp.expand();
        Telegram.WebApp.disableVerticalSwipes();
    }catch(e){
        processException(e);
    }
    try{
        if (window.limitCountry != null && window.limitCountry.length > 0) {
            const country = await getCountryByIP(window.curIP);
            if (!country) return;

            for (let i = 0; i < window.limitCountry.length; i++) {
                if (country.toLowerCase() === window.limitCountry[i].toLowerCase()) {
                    showMessageAndRedirect(language("m_regionlimit"),"index")
                    return;
                }
            }
        }
        //init mainlink
        curObj.Url =  curObj.Url.replace("{userid}", getTgUser().id);

    }catch(e){
        console.error('initActivityApp:'+e);
    }
    initControl();
    processShare();
    window.isStart=true;

    await doFunctionByName('doOnPageLoad');

    // await init();

    let lasttime = await getTgCloudData('lastVisitpoint');
    if(lasttime==""){
        setTgCloudData('lastVisitpoint', window.curTime);
    }
    initIsBotChat();


});
// async function init()
// {
//     const funcName="init_callback";
//     if(isExistFunction(funcName))
//     {
//         const jsonstr=JSON.stringify({
//             initdata: getTgInitData(),
//             activityid:curObj?curObj.Id:""
//         });
//          const serverurl=curObj?window.app+'service':'GeneralWebServices';
//          const result =await doWebService(serverurl, 'Init', 'POST', '',jsonstr);
//          if(result.Result){
//                 doFunctionByName(funcName, result.Data);
//          }else{
//             processException(result);
//          }
//     }
// }

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
function doShare(){
    // const page=curObj!=null?"activity":window.app.toLowerCase(); 
    const page=curObj!=null?"activity":"index"; 
    const activityId = curObj!=null?`${curObj.Category}-${curObj.Id}`:'0';
    const userId = getTgUser().id;
    const shareCommand = `share_${page}_${activityId}_${userId}`;
    window.Telegram.WebApp.switchInlineQuery(shareCommand, ['users', 'groups', 'channels']);
}
const dict = {
    PointLogType: {
        1: 'Rewards',
        2: 'Check in',
        3: 'Task Rewards',
        4: 'Withdrawal failed, refund',
        5: 'Share rewards',
        6: 'Rewards',
        101: 'Top up',
        102: 'Withdrawal'
    },
    CashApplicationState: {
        0: 'Pending',
        1: 'Success',
        2: 'Failed'
    },
    UserTaskState: {
        0: 'Pending',
        2: 'Success',
        3: 'Failed'
    },
    UserTaskCategory: {
        1: 'DoSomeThingAfterGetPoint',
        2:'WattingTimeGetPoint'
    },
    ActivityRewardAction: {
        1: 'PageView',
        2: 'WaitingTime',
        3: 'Submit',
        4: 'Download',
        5: 'Register'
    },
    CurrencyTypeEnum: {
        0: 'Fiat',
        1: 'Crypto'
    }
};
function processException(data) {

    if (data.ExceptionMessage) {
        alert(data.ExceptionMessage);
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
async function isBotconnect() {
    // const _IsBotChat = await getTgCloudData('IsBotChat');
    // if(_IsBotChat==""){
    //     const result=await runWebFunc('IsBotChat');
    //     setTgCloudData('IsBotChat', result);
    // }
    const result=await runWebFunc('IsBotChat');
    return result;
}
async function connectBot(){
        const hasChatted = await isBotconnect();
        if (!hasChatted) {
            return new Promise((resolve, reject) => {
            tgConfirm(language("m_confirmBot"),function(result){
                    if(result){
                        tgOpenWindow(`https://t.me/${window.botName}`);
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                }); 
             });
        }
}
async function initControl(){
    initControl_BottomToolBar();
    initControl_UserInfo();
    initControl_ToolBar();
    initControl_Language();
    await initControl_UserAccount();
    await initControl_Message();
    await initControl_Recommend();

}
function initControl_BottomToolBar(){
    if (typeof isBottomToolBar === 'undefined' || !isBottomToolBar) {
        return;
    }
    const bottomtoolbar = document.createElement('div');
    // bottomtoolbar.id = 'bottom-toolbar';
    bottomtoolbar.classList.add('fixed_bottom');
    bottomtoolbar.classList.add('grid');
    bottomtoolbar.style.cssText = '--columns:33% 1fr 33%;padding-bottom:25px;background-color: #fff;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); height: 80px; ';
    document.body.appendChild(bottomtoolbar);
    const homeclass=window.app=="Index"?" active":"";
    const myclass=window.app=="My"?" active":"";
    bottomtoolbar.innerHTML = `
        <div class="icon1${homeclass}" onclick="toPage('index')">
            <div><img src="${fileUrl("img/icon/home.svg")}" /></div>
            <div>${language("g_home")}</div>
        </div>
        <div class="icon1" onclick="doShare();">
            <div><img src="${fileUrl("img/icon/share.svg")}" /></div>
            <div>${language("g_Share")}</div>
        </div>
        <div class="icon1${myclass}" onclick="toPage('my')">
            <div><img src="${fileUrl("img/icon/ren.png")}" /></div>
            <div>${language("g_my")}</div>
        </div>
    `;
}
function initControl_UserInfo(){
    const user = getTgUser();
    if(isExist('username')){
        setContent('username', user.first_name);
    }
        
}
function initControl_ToolBar(){
    // if (typeof isTopToolBar === 'undefined' || !isTopToolBar) {
    //     return;
    // }
    if (curObj==null) {
        return;
    }
    const toolbar = document.createElement('div');
    toolbar.className = 'fixed_lefttop';
    document.body.appendChild(toolbar);
    //create index button
     if(window.app!="Index")
     {
         const indexButton = document.createElement('div');
         indexButton.className = 'button4';
         indexButton.innerHTML = language("g_home");
         indexButton.style.cssText = `--icon: url('${fileUrl("img/icon/home.svg")}')`;
         toolbar.appendChild(indexButton);
         indexButton.addEventListener('click', () => {
             toPage('index');
         });
     }
    const user = getTgUser();
    // create share button
    const shareButton = document.createElement('div');
    shareButton.className = 'button4';
    shareButton.innerHTML = language("g_Share");
    shareButton.style.cssText = `--icon: url('${fileUrl("img/icon/share.svg")}')`;
    toolbar.appendChild(shareButton);
    shareButton.addEventListener('click', () => {
         doShare();
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
            const amount=result.Data?result.Data.Amount:0;
            setContent('control_UserAmount', amount);
            return amount

     }else{
        processException(result);
     }
}
async function initControl_Language() {
    if(!isExist('control_Language')){
        return;
    }
    try{
    let langobj = new custom_select('control_Language', [
        {html:`<div class='icon'><img style='width:20px;height:20px' src='${fileUrl("img/icon/Earth.png")}'>Language</div>`,value:null},
        {html:`<div class='icon'><img style='width:20px;height:20px' src='${fileUrl("img/icon/en.png")}'>English</div>`,value:""},
        {html:`<div class='icon'><img style='width:20px;height:20px' src='${fileUrl("img/icon/ru.png")}'>Русский</div>`,value:"ru-RU"},
        {html:`<div class='icon'><img style='width:20px;height:20px' src='${fileUrl("img/icon/fanti.png")}'>繁體</div>`,value:"zh-TW"},
        {html:`<div class='icon'><img style='width:20px;height:20px' src='${fileUrl("img/icon/cn.png")}'>简体</div>`,value:"zh-CN"}
        ], 
        function(value){if(value!=null){setLanguage(value);}});
    }catch(e){
        // alert(e);
    }
    }

async function initControl_Message() {
    if(!isExist('control_count_point')){
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
                setDisplay('control_count_point',true); 
                setContent('control_count_point',"+"+ data.newpoint.length);
                // const controlMessage = document.getElementById('control_message');
                // const newDiv = document.createElement('div');
                // newDiv.className = 'toolbar_Channels_item_message';
                // newDiv.textContent = '+'+data.newpoint.length;
                // controlMessage.appendChild(newDiv);
                // return;


                // let html="<div class='control_Message_List'>";
                // for(var i=0;i<data.newpoint.length;i++)
                // {
                //     html+=`
                //     <div class="control_Message_Item">
                //     You get ${data.newpoint[i].Num} points(${dict.PointLogType[data.newpoint[i].LogType]}),     <a href="mypointlogs">details</a>
                //     </div>`;
                // }
                // html+='</div>';
                // setContent('control_Message', html);
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
//activity.js


async function runWebFunc(action,param=null,callback=null){
    try{
        let data = {
            initdata: getTgInitData(),
            action: action
        };
        if (typeof curObj !== 'undefined' && curObj !== null){
            data.activityid=curObj.Id;
        }
        if (param !== null) {
            data.param = param;
        }
        const jsonstr = JSON.stringify(data);
        processwaithandle();
        let _serviceurl="GeneralWebServices";
        if (typeof window.serviceUrl !== 'undefined' && window.serviceUrl!="") {
            _serviceurl=window.serviceUrl;
        }
        const result =await doWebService(_serviceurl, action, 'POST', '',jsonstr);
        if (result.Result) {
            if (callback && typeof callback === 'function') {
                callback(result.Data);
            } else if (isExistFunction(`doAction_${action}_callback`)) {
                doFunctionByName(`doAction_${action}_callback`, result.Data);
            } else {
                return result.Data;
            }
        } else {
            if (result.Code!=null) {
                if (result.Code=="NoAccess") {
                    
                    document.body.innerHTML=`<div class="fail">${language("m_NoAccess")}</div>`;
                }
            }else{
                processException(result);
            }
        }
    }catch(e){
        processException(e);
    }finally{
        clearwaithandle();
    }
}




async function doAction(action, param = null, callback = null) {
    try{
            let data = {
                initdata: getTgInitData(),
                activityid: curObj.Id,
                action: action
            };
            if (param !== null) {
                data.param = param;
            }
            processwaithandle();
            const jsonstr = JSON.stringify(data);
            const result = await doWebService('ActivityWebService', 'Do', 'POST', 'type=' + curObj.Category, jsonstr);
            if (result.Result) {
                if (callback && typeof callback === 'function') {
                    callback(result.Data);
                } else if (isExistFunction(`doAction_${action}_callback`)) {
                    doFunctionByName(`doAction_${action}_callback`, result.Data);
                } else {
                    return result.Data;
                }
            } else {
                processException(result);
            }
        }catch(e){
            processException(e);
        }finally{
            clearwaithandle();
        }
}
// async function checkDo(action) {
//     const jsonstr=JSON.stringify({
//         initdata: getTgInitData(),
//         activityid:curObj.Id,
//         activityaction:action
//     });
//     const result =await doWebService(window.app+'service', 'CheckDo', 'POST', '',jsonstr);
//     if(result.Result){
//         return result.Data;
//     }else{
//         processException(result);
//     }
// }

async function payStars(param,funcOnPayOk){
    await doAction("GetStarsPaymentUrl",param,function(data){
        if(!data.Result){
            tgAlert(data.Message);
            return;
        }
        Telegram.WebApp.openInvoice (data.Message ,  ( status )  =>  { 

            if  ( status ==  "paid" )  { 
                try{
                    setTimeout(() => {
                        // doAction("Init");
                        funcOnPayOk();
                    }, 1000);
                //    curTipbottom.close();
                }catch(e)
                {
                    // alert(e);
                }
                // setTimeout(() => {
                //     curTipbottom.close();
                // }, 8000);
                // doAction("Init");
            } 
          } ) ;

       });

}






async function processShare() {
    if(window.shareUserId==''){
        return;
    }
    const jsonstr=JSON.stringify({
        initdata: getTgInitData(),
        shareuserid:window.shareUserId,
        ...(curObj && { activityid: curObj.Id })
    });
     const result =await doWebService('GeneralWebServices', 'RewardShare', 'POST', '',jsonstr);
     if(result.Result){
            // const data=result.Data;
            // if(data.Result){
            // }
     }else{
        processException(result);
     }
}