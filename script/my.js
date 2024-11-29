const isSupportBack=true;
async function doOnPageLoad(){
    try{
    if ('app' in window) {
        if(window.app=='MyPointLogs'){
             await initMyPointLogs();
         }else if(window.app=='MyApplications'){
             await GetWithdrawApplications();
         }else if(window.app=='MyTask'){
             await getUserTask();
         }else if(window.app=='MyActivityPart'){
            await initMyActivityPart();
        }
   
     }
    }catch(e){
        alert(e);
    }   
}


async function initMyPointLogs() {
    const data=await getUserLogs();
    var _html='';
    if(data.length==0){
        _html=`<div class="list_nodata">${language("g_nodata")}</div>`;
    }else{
        _html=`<div class="list_title"><div>${language("g_Point")}</div><div>${language("g_type")}</div><div>${language("g_time")}</div></div>`;
        for(var i=0;i<data.length;i++){
            const typestr=language("g_"+data[i].LogType);
                _html+=`<div><div>${data[i].Num}</div><div>${typestr}</div><div>${convertUtcToLocal(data[i].CreateTime)}</div></div>`;
        }
    }
    setContent('userPointLogs', _html);
    setTgCloudData('lastVisitpoint', window.curTime);
}
async function initMyActivityPart() {
    const jsonstr=JSON.stringify({
        initdata: getTgInitData()
    });
     const result =await doWebService('GeneralWebServices', 'GetUserActivityPart', 'POST', '',jsonstr);
     if(result.Result){
        let html='';
        if(result.Data.length==0){
            html=`<div class="contentpanel list_nodata">${language("g_nodata")}</div>`;
        }else{
        result.Data.forEach(item => {
                let statestr="";
                if( item.State==Dictionary.Activity.State.Normal){
                    statestr=language("g_resultno");
                }else if( item.State==Dictionary.Activity.State.Finish){
                    if(item.Tag==Dictionary.Activity.Action.Win){
                        statestr=language("g_resultwin");
                    }else{
                        statestr=language("g_resultlose");
                    }
                }
                html+=`<div class="contentpanel list1_item" style="--columns:1fr 50px" onclick="toPage('activity${item.Category}app?id=${item.Id}')">
                            <div>
                            <div class="left">${item.Title}</div>
                            <div class="left">${convertUtcToLocal(item.CreateTime)}</div>
                            <div class="left">${statestr}</div>
                            </div>
                            <div class="imgpanel" style="height:50px">
                            <img src="${item.ImgUrl}">
                            </div>
                        </div>
                `;
            });
        }
            setContent('listdata', html);
     }else{
        processException(result);
     }
}
async function getUserLogs(activityids=null) {
    const jsonstr=JSON.stringify({
        initdata: getTgInitData(),
        ...(activityids && { activityids: activityids })
    });
      const result =await doWebService('GeneralWebServices', 'GetPointLogUsersByUserId', 'POST', '',jsonstr);
     if(result.Result){
            return result.Data;
            
     }else{
        processException(result);
     }
}

async function GetWithdrawApplications() {
    try{
    const jsonstr=JSON.stringify({
        initdata: getTgInitData(),
        actions:Dictionary.Log.Type.UserWithdraw
    });
     const result =await doWebService('GeneralWebServices', 'GetApplications', 'POST', '',jsonstr);
     if(result.Result){
            const data=result.Data;
            var _html='';
            if(data.length==0){
                _html=`<div class="contentpanel list_nodata">${language("g_nodata")}</div>`;
            }else{
            for (var i = 0; i < data.length; i++) {
                const extobj=JSON.parse(data[i].Ext);
                const state=data[i].State==Dictionary.Application.State.Pending?'Pending':(data[i].State==Dictionary.Application.State.Success?'Success':'Failed');
                const statestr=language("g_"+state);
                const fromunit=extobj.From.Unit==Dictionary.Currency.Type.Point?language("g_point"):extobj.From.Unit;
                _html += `
                    <div class="contentpanel">
                            <div>
                             <span class="tag">${statestr}</span>  ${extobj.From.Num} <span class="remark">${fromunit}</span> -> ${extobj.To.Num} <span class="remark">${extobj.To.Unit}</span> <span class="tag">${extobj.To.Type}</span> <span class="tag">${extobj.To.Gateway}</span>
                            </div>
                            <div class="remark">
                             ${ConvertShortAddress(extobj.ToAccount,10)},${convertUtcToLocal(data[i].CreateTime)}
                            </div>
                    </div>
                `;
            }
        }
            setContent('userapplications', _html);
     }else{
        processException(result);
     }
    }catch(e){
        alert(e);
    }
}