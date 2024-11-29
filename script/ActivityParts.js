async function doOnPageLoad() {
    await addUserActionPagedHtml(1);
}
async function addUserActionPagedHtml(pagenumber){
    try{
        const pagesize=20;
        const jsonstr=JSON.stringify({
            initdata: getTgInitData(),
            pagesize: pagesize,
            pagenumber:pagenumber,
            businessid:new URLSearchParams(window.location.search).get('activityid')
        });
        const result =await doWebService('GeneralWebServices', 'GetUserActionPaged', 'POST', '',jsonstr);
        if(result.Result){
            let html=`<div class="list_title">
                                <div>${language("g_rank")}</div>
                                <div>${language("g_parter")}</div>
                                <div>${language("g_ticket")}</div>
                            </div>
            `;
            if(result.Data.Items.length>0){
                for(var i=0;i<result.Data.Items.length;i++){
                    const ext=JSON.parse(result.Data.Items[i].Ext);
                    const rank=(pagenumber-1)*pagesize+i+1;
                    html+=`<div>
                        <div>${rank}</div>
                        <div>${ext.UserName}</div>
                        <div>${result.Data.Items[i].TotalScore}</div>
                    </div>`;
                    
                    }
            }else{
                html=`<div class="list_nodata">${language("g_nodata")}</div>`;
            }
            setContent("partslist",html);
        }else{
            processException(result);
        }
    }catch(error){
        throw error;
    }
}
