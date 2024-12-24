const isBottomToolBar=true;
const isTopToolBar=true;
let curTipbottom;
let cryptoaddressform;
async function doOnPageLoad() {
    
    try{
        if (curObj == null) {
            return;
        }
        displayPrizeInfo();
        doAction("Init");
    }catch(e)
    {
        alert(e);

    }
 }
 function displayPrizeInfo(){
    const prize=curObj.Ext.PrizeInfo;
    const prizesindex=Object.keys(prize);
    let htmls=[];
    for(let i=0;i<prizesindex.length;i++)
    {
        const prizeinfo=prize[i+1];
        const prizelevelstr=prizesindex.length==1?language("g_Prize"):`${i+1}${language("a_l_th")}`;
        switch(prizeinfo.Type)
        {
            case Dictionary.Activity.Prize.Type.Currency:
               let receivestr="";
               if(prizeinfo.Num>1){
                   receivestr=prizeinfo.ReceiveType==Dictionary.Activity.Prize.ReceiveType.Currency_Lucky?language("a_l_Lucky"):language("a_l_Equal");
               }else{
                   receivestr=language("a_l_Exclusive");
               }
                htmls.push(`
                    <div class="activitylotter_prize_currency">
                        <div class="activitylotter_prize_currency_amount">
                            <span class="tag">${receivestr}</span>${prizeinfo.Currency.Num} ${language("g_"+prizeinfo.Currency.Unit)}
                        </div>
                        <div class="tag1 bottomleft">
                            ${prizeinfo.Num} ${language("a_l_servings")}
                        </div>
                    </div>
                <div class="title center">${prizelevelstr}</div>
                <div class="title1">${prizeinfo.Name}</div>
                `);
                break;
            case Dictionary.Activity.Prize.Type.PhysicalGoods:
                htmls.push(`
                    <div class="activitylotter_prize_img">
                       <img src="${prizeinfo.Img}" >
                        <div class="tag1 bottomleft">
                            ${prizeinfo.Num} ${language("a_l_servings")}
                        </div>
                    </div>
                <div class="title center">${prizelevelstr}</div>
                <div class="title1">${prizeinfo.Name}</div>
                `);
                break;
            case Dictionary.Activity.Prize.Type.VirtualGoods:
                break;
            case Dictionary.Activity.Prize.Type.Coupon:
                break;
        }
    }
    const c1=new custom_carousel("activitylotter_prize",htmls);
 }
 function displayOnNormal(data){
    setDisplay("activitylotter_normal",true);
    const finish=curObj.Ext.FinishRule;
    const nowtime = getNowUtcTime().timespan;
    const starttime = new Date(curObj.StartTime).getTime();
    if(nowtime<starttime){
        setContent('activitylotter_progress_title',`${language("g_DisStart")}:`);
        const countdownToEnd = new custom_countdownTimer('activitylotter_progress_content', curObj.StartTime,function(){
            displayOnNormal(data);
        });
        countdownToEnd.start();
       return;
    }


    //Activity State
    if(finish.Type==Dictionary.Activity.FinishType.ByTime){
        setContent('activitylotter_progress_title',`${language("g_DisToDraw")}:`);
        const countdownToEnd = new custom_countdownTimer('activitylotter_progress_content', curObj.EndTime);
        countdownToEnd.start();
    }else if(finish.Type==Dictionary.Activity.FinishType.ByPeopleNum){
         new custom_progress ("activitylotter_progress",finish.Num,data.Status.CurrPart,
            {
                banner:language("a_l_byPeople").replace("{0}",finish.Num),
                current:language("a_l_current"),
                total:language("a_l_total")
             }
        );
    }
    //Activity submit
    let htmls=[];
    if(!data.IsPart){
        if(data.IsPayment){
           setContent("activitylotter_submit",`<div class="contentpanel1">${language("m_haspayment")}</div>`);
           let initTimer = setInterval(() => {
            doAction("Init");
        }, 20000); 
        }else{
                setContent("activitylotter_submit",`<div id="btnjoinin" class="button2" onclick="showjoinInTip()">
                                                    ${language("g_joinin")}
                                                </div>`);
        }
        

    }else{
        setContent("activitylotter_submit","");
            let probability=data.Status.CurrTicket!=0? (data.MyTickets / data.Status.CurrTicket*100).toFixed(2):0;
            let html=`<div class="contentpanel">
            ${language("m_haspart")}
            <div class="remark">
                ${language("a_l_ticket")}: <span class="number">${data.MyTickets} </span>(${probability}%)
            </div>`;
            html+=`</div>`;
            setContent("activitylotter_mypartinfo",html);
            //assist
            InitAssist();
            
            
        }
}
async function InitAssist(){
    if( curObj.Ext.Assist == undefined){
        return
    } 
        doAction("GetAssistInfo",null,function(data){
            html=`<div class="contentpanel">`;
            html+=`<div class="title center">${language("a_l_moreticket")}<div class="refresh" style="margin:0 3px" onclick="setwaithandle(this);InitAssist();"></div></div>`;
            const assistIndex=Object.keys(data);

            let todotask=[];
            for(let i=0;i<assistIndex.length;i++)
            {
                const assist=data[i+1];
                let repeatstr="";
                let isDone=false;
                if(assist.RepeatType==Dictionary.Activity.RepeatType.EveryDay){
                    if(assist.State.TotalTimes>=assist.MaxTimes){
                        repeatstr=language("g_TotalFinish");
                        isDone=true;
                    }else {
                        if(assist.State.TodayTimes>=assist.MaxTimesDay){
                            repeatstr=language("g_EveryDayFinish");
                            isDone=true;
                        }else{
                            repeatstr=language("g_EveryDay").replace("{0}",assist.MaxTimesDay).replace("{1}",assist.MaxTimesDay-assist.State.TodayTimes);
                        }
                        repeatstr+="<br>"+language("g_Total").replace("{0}",assist.MaxTimes).replace("{1}",assist.MaxTimes-assist.State.TotalTimes);
                    }
                }else if(assist.RepeatType==Dictionary.Activity.RepeatType.Total){
                    if(assist.State.TotalTimes>=assist.MaxTimes){
                        repeatstr=language("g_TotalFinish");
                        isDone=true;
                    }else {
                        repeatstr=language("g_Total").replace("{0}",assist.MaxTimes).replace("{1}",assist.MaxTimes-assist.State.TotalTimes);
                    }
                }
                let title=assist.Title;
                let taskname="";
                let url="";
                let buttonstr=language("g_todo");
                let buttoneventparam="";
                if(assist.Action==Dictionary.Activity.Action.ReadArticleSeconds){
                    taskname=language("g_ReadArticleSeconds").replace("{0}",assist.Seconds);
                    // url = `${window.miniAppUrl}?startapparticleapp?articleid=${assist.ArticleId}&category=Lotter&id=${curObj.Id}&action=Assist&assistid=${i+1}`;
                    url = `${window.miniAppUrl}?startapp=articleapp_${assist.ArticleId}-Lotter-${curObj.Id}-Assist-${i+1}`;
                    //articleapp?articleid=88888888&category=Lotter&id=ACT09xcS1h0yrZ0Xip7878&action=Assist&assistid=1
                    buttoneventparam=`{Url:'${url}'}`;
                }else if(assist.Action==Dictionary.Activity.Action.JoinGroup || assist.Action==Dictionary.Activity.Action.JoinChannel){
                    taskname=language("g_"+assist.Action);
                    url=assist.Url;
                    buttonstr=language("g_joinin");
                    if(!isDone){
                        todotask.push(i+1);
                    }
                    buttoneventparam=`{Url:'${url}'}`;
                }else if(assist.Action==Dictionary.Activity.Action.PaymentToAssist){
                    taskname=language("g_"+assist.Action);
                    buttonstr=language("g_Tips");
                }   
                let itemcss=isDone?"taskfinish":"task";
                html+=`<div id="assisttaks_${i+1}" class="${itemcss} grid left" style="--columns:1fr 70px">
                            <div>
                                <div>${taskname}</div>
                                <div class="remark">${title}</div>
                                <div class="remark">${repeatstr}</div>
                            </div>
                            <div id="assisttaks_btn_${i+1}" class="${isDone?'hidden':''}">
                                <div  class="center"><button class="button3" onclick="doAssist('${assist.Action}',${i+1},${buttoneventparam})">${buttonstr}</button></div>
                                <div class="remark center" style="font-size:0.8em">+${assist.Tickets}${language("g_ticket")}</div>
                            </div>
                        </div>
                    `;
                    //<div class="button1" onclick="tgOpenWindow('${url}');">${buttonstr}</div><button onclick="inchat('${assist.ChatId}')">inchat</button>${assist.State.TotalTimes}
                
            }
            html+=`</div>`;
            setContent("activitylotter_assist",html);
            
            if(todotask.length>0){
                let docount=0;
                let isdone=false;
                for(let i=0;i<todotask.length;i++){
                    doAction("Assist",{index:todotask[i]},function(data){
                        docount++;
                        if(data.Result){
                            isdone=true;
                        };
                        if(isdone && docount==todotask.length){
                            InitAssist();
                        }
                    });
                }
            
            }
    });
}
async function doAssist(action,index,param){
    if(action==Dictionary.Activity.Action.ReadArticleSeconds || action==Dictionary.Activity.Action.JoinGroup || action==Dictionary.Activity.Action.JoinChannel){
        tgOpenWindow(param.Url);
    }else if(action==Dictionary.Activity.Action.PaymentToAssist){
        await payStars({index:index,Action:Dictionary.Activity.Action.PaymentToAssist},
            function(){
                doAction("Init");
            });
    }
}
async function inchat(chatid){
    // alert(chatid);
   const result=await runWebFunc("IsUserInChat",{chatid:chatid});
    // alert(result);
}
function displayOnFinish(data){
    setDisplay("activitylotter_finish",true);
    const winners=JSON.parse(data.Status.Result);
    const winnersindex=Object.keys(winners);
    let htmlwinner=``;
    for(let i=0;i<winnersindex.length;i++)
   {
       htmlwinner+=`<div class="contentpanel2">
           <div>${i+1}${language("a_l_th")}</div>
           <div class="flexlist">`;
       const winner=winners[i+1];
       for(let j=0;j<winner.Winners.length;j++)
       {
           htmlwinner+=`<div class="flexlist_item">${winner.Winners[j].UserName}</div>`;
       }
       htmlwinner+=`</div></div>`;
   }
   let htmlmywinner=data.IsWinner?language("a_l_win").replace("{0}",data.WinLevel)+language("a_l_th"):language("a_l_lose");
   htmlmywinner=`<div class="contentpanel1">`+htmlmywinner+`</div>`;
   setContent("activitylotter_mywinner",htmlmywinner);
   setContent("activitylotter_winnerinfo",htmlwinner);

   if(data.IsWinner){
    let htmlmywinnerinfo="";
        if(data.ReceiveType==Dictionary.Activity.Prize.ReceiveType.PhysicalGoods_Delivery){
                if(data.Wininfo!=null){
                    htmlmywinnerinfo+=`<div class="contentpanel1">
                            <div>${language("a_l_receivetitle")}</div>
                            <div>${language("g_Recipient")}:${data.Wininfo.Name}</div>
                            <div>${language("g_Phone")}:${data.Wininfo.Phone}</div>
                            <div>${language("g_Address")}:${data.Wininfo.Address}</div>
                        </div>
                        `;
                }else{
                    curTipbottom=new tip_bottom(`
                        <div class="center title">${language("a_l_win").replace("{0}",data.WinLevel)}</div>
                        <div class="center title">${language("g_enteraddress")}</div>
                        <div class="form_label">${language("g_Recipient")}:</div>
                        <div class="form_input"><input id="address_name" type="text"></div>
                        <div class="form_label">${language("g_Phone")}:</div>
                        <div class="form_input"><input id="address_phone" type="text"></div>
                        <div class="form_label">${language("g_Address")}:</div>
                        <div class="form_input"><textarea id="address_address" rows="4" cols="50"></textarea></div>
                        <div class="center"><button onclick='setWinnerInfo(${JSON.stringify(data)});'>${language("g_submit")}</button></div>
                        `);
                        curTipbottom.show();
                }
        }else if(data.ReceiveType==Dictionary.Activity.Prize.ReceiveType.Currency_Equal || data.ReceiveType==Dictionary.Activity.Prize.ReceiveType.Currency_Lucky){
            if(data.Wininfo!=null){
                    if(data.Wininfo.Amount.Type==Dictionary.Currency.Type.Point){
                        htmlmywinnerinfo+=`
                        <div class="contentpanel1">
                        <div>${language("a_l_receivetitle2")}:</div>
                        <div>${language("g_award")}:${data.Wininfo.Amount.Num} ${data.Wininfo.Amount.Unit}</div>
                        </div>
                        `;
                    }else if(data.Wininfo.Amount.Type==Dictionary.Currency.Type.Crypto && data.Wininfo.ApplicationId!=null){
                        doAction("GetWinnerWithdrawApplication",null,function(result){
                            let applicationstr="";
                            if(result.State==Dictionary.Application.State.Pending){
                                applicationstr+=language("a_l_receivetitle3");
                            }else if(result.State==Dictionary.Application.State.Success){
                                applicationstr+=language("a_l_receivetitle4");
                            }
                            const appextobj=JSON.parse(result.Ext);
                            applicationstr+=`<br />(${appextobj.To.Num} ${appextobj.To.Unit})`;
                            setContent("activitylotter_mywinnerInfo",`
                                <div class="contentpanel1">
                                   ${applicationstr}
                                </div>
                                `); 
                        });
                        
                        
                       

                    }
            }else{
                const prizesindex=Object.keys(curObj.Ext.PrizeInfo);
                const prizetitle=prizesindex.length==1?language("g_Prize"):(data.WinLevel+language("a_l_th"));
               
                curTipbottom=new tip_bottom(`
                    <div class="title center">${language("a_l_win").replace("{0}",prizetitle)}</div>
                    <div class="center"><span class="number" style="font-size:1.5em;margin:5px">${data.PrizeInfo.Num}</span> ${language("g_"+data.PrizeInfo.Unit)}</div>
                    <div id="otherform"></div>
                    <div class="form_button center" style="margin-top:20px">
                        <button onclick='setWinnerInfo(${JSON.stringify(data)});'>${language("g_receive")}</button>
                    </div>
                    <div class="form_input remark" style="margin-top:10px">
                    ${language("a_l_ContactUs")}
                    <a href="#none" onclick="tgOpenWindow('https://t.me/TelinkChat');">Telink Group</a></div>
                    
                    `);
                    curTipbottom.show();
                    if(data.PrizeInfo.Unit==Dictionary.Crypto.Token.USDT){
                        cryptoaddressform=new custom_cryptoaddressform("otherform",{
                            token:language("g_withtoken"),
                            network:language("g_withnetwork"),
                            address:language("g_withaddress"),
                        });
                        cryptoaddressform.show();
                    }
                    

            }
        }
        setContent("activitylotter_mywinnerInfo",htmlmywinnerinfo);  
   }
   
}
async function showjoinInTip()
{
    try{
        
        let html=`<div class="center title1">${language("g_paymenttitle")}</div>`;
        const Participateindex=Object.keys(curObj.Ext.Participate);
        for(let i=0;i<Participateindex.length;i++)
        {
            const part=curObj.Ext.Participate[i+1];
            html+=`<div style='padding:10px'><div class='button3' onclick='setwaithandle(this);doJoinIn(${i+1})'>${language("a_l_paytitle").replace("{0}",part.Currency.Num).replace("{1}",language("g_"+part.Currency.Unit))}</div></div>`;
            // if(part.Action==Dictionary.Activity.Action.PaymentToJoinIn){
                
            // }
        }
        curTipbottom=new tip_bottom(html);
        curTipbottom.show();
    }catch(e)
    {
        alert(e);
    }
}
async function doJoinIn(index)
{
   try{
    await connectBot();
    
    const part=curObj.Ext.Participate[index];
    const username=getTgUser().first_name;
    if(part.Action==Dictionary.Activity.Action.PaymentToJoinIn ){
        if(part.Currency.Type==Dictionary.Currency.Type.Point)
        {
            doAction("PointToJoinIn",{index:index,username:username},function(data){
                if(data.Result){
                    curTipbottom.updateHtml(`<div class="success">${language("m_payok1")}</div>`);
                    setTimeout(() => {
                        curTipbottom.close();
                    }, 2000);
                    doAction("Init");
                        
                }else{
                    tgAlert(data.Message)
                }
            });
        }else if(part.Currency.Type==Dictionary.Currency.Type.Crypto){
            curTipbottom.close();
            curTipbottom=new tip_bottom(`
                <div id="activitylotter_tip" class="activitylotter_tip">
                    <div>
                        ${language("a_l_paytitle").replace("{0}",part.Currency.Num).replace("{1}",language("g_"+part.Currency.Unit))}
                    </div>
                    <div class="center"><div id="ton-connect"></div></div>
                    <div id="activitylotter_tip_button"></div>
                </div>
            `);
            curTipbottom.show();
            TonLib.initTonConnect("ton-connect",function(isconected){
                if(isconected)
                {
                    setContent("activitylotter_tip_button",`<button class="button3" onclick="transferUSDT(${part.Currency.Num},${index})">${language("g_pay")} ${part.Currency.Num} ${language("g_"+part.Currency.Unit)} </button>`);
                }else{
                    setContent("activitylotter_tip_button","");
                }
            });
        }else if(part.Currency.Type==Dictionary.Currency.Type.Stars){
            await payStars({index:index,Action:Dictionary.Activity.Action.PaymentToJoinIn},
                function(){
                    doAction("Init");
                    curTipbottom.close();
                });
           
        }
    }

   }catch(e)
   {
        alert(e);
   }
}

   
                  
async function transferUSDT(amount,index)
{
    try{
        const balance=await TonLib.getUSDTAmount();
        if(balance<amount)
        {
            alert("Insufficient balance");
            return;
        }
        const resultcheckpayment=await doAction("JoinInCheck");
        if(!resultcheckpayment.Result){
            alert(resultcheckpayment.Message);
            return;
        }
        const fromaddress=TonLib.getTonConnectUIWalletAddress();
       
        const getapplicationidresult=await doAction("GetNewUserApplicationId",{action:Dictionary.Activity.Action.PaymentToJoinIn});
 
        if(!getapplicationidresult.Result){
            alert(getapplicationidresult.Message);
            return;
        }
        const applicationid=getapplicationidresult.Message;
        const tresult=await TonLib.transferUSDT(amount,`Pay_${applicationid}`);
        if(tresult){
            const resultpayment=await doAction("PaymentToJoinIn",{
                UserName:getTgUser().first_name,
                FromAccount:fromaddress,
                // FromAccount:,
                Amount:amount,
                ApplicationId:applicationid,
                Index:index
            });
            if(!resultpayment.Result){
                // return;
            }
            alert(language("m_payok"));
            curTipbottom.close();
            doAction("Init");
        }else{
            alert(language("m_payfail"));
        } 
    }catch(e)
    {
        alert(e);
    }
}

async function setWinnerInfo(winnerdata)
{
    try{
        let param=null
        if(winnerdata.ReceiveType==Dictionary.Activity.Prize.ReceiveType.PhysicalGoods_Delivery){
            
            const address_name=getContent("address_name");
            const address_phone=getContent("address_phone");
            const address_address=getContent("address_address");
            if(!validTextLength(address_name,2,20)){
                tgAlert(language("g_Recipient")+" "+language("m_formaterror"));
                return;
            }
            if(!validPhoneNumber(address_phone)){
                tgAlert(language("g_Phone")+" "+language("m_formaterror"));
                return;
            }
            param={
                Name:address_name,
                Phone:address_phone,
                Address:address_address
            };
        }else if(winnerdata.PrizeInfo.Unit==Dictionary.Crypto.Token.USDT){
            const toGateway=cryptoaddressform.network();
            const toAccount=cryptoaddressform.address();
            const isok=await doFunctionByName('checkAddress_'+toGateway,toAccount);
            if(toAccount=='' || !isok){
                tgAlert(language("g_withaddress")+language("m_formaterror"));
                return;
            }
            param={
                toAccount:toAccount
            };
        }
        const result=await doAction("SetWinnerInfo",param);
        if(result.Result){
            curTipbottom.updateHtml(`<div class='success'>${language("m_submitok")}</div>`);
            setTimeout(() => {
                curTipbottom.close();
            }, 2000);
            doAction("Init");
        }else{
            tgAlert(result.Message);
        }
    }catch(e)
    {
        tgAlert(e);
    }
}
function doAction_Init_callback(data) {
    try{
        if(data.Status.State==Dictionary.Activity.State.Normal){
            displayOnNormal(data);
        }else if(data.Status.State==Dictionary.Activity.State.Finish){
            displayOnFinish(data);
        }
        setContent("activitylotter_parts_total",data.Status.CurrPart);
        doOnInited();
    }catch(e)
    {
        alert(e);
    }
}
function doOnInited(){
    return;
}
