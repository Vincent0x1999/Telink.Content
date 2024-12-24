function displayPrizeInfo() {
    const prizeinfo=curObj.Ext.PrizeInfo[1];
    // setContent("poolprize_num",curObj.CurrTicket);
    setContent("poolprize_unit",prizeinfo.Currency.Unit);
    let receivestr="";
    if(prizeinfo.Num>1){
        receivestr=prizeinfo.ReceiveType==Dictionary.Activity.Prize.ReceiveType.Currency_Lucky?language("a_l_Lucky"):language("a_l_Equal");
    }else{
        receivestr=language("a_l_Exclusive");
    }
    
    setContent("poolprize_rule",`<span class="tag2">${receivestr}</span>  ${prizeinfo.Num}${language("a_l_servings")}`);
    // setInterval(displayPoolAmount, 5000);
    displayPoolAmount();
    


    const nostart_times=document.getElementsByName("nostart_time");
    for(var i=0;i<nostart_times.length;i++){
        const timestr=getData(nostart_times[i].id,"starttime");
        const countdownToEnd = new custom_countdownTimer(nostart_times[i].id, timestr);
        countdownToEnd.start();
    }
}
async function displayPoolAmount()
{
    await doAction("GetPoolAmount",null,function(result){
        setContent("poolprize_num",result.Num);
    });
}

function doOnInited(){
    displayPoolAmount();
}
