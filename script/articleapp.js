const isSupportBack=true;
async function doOnPageLoad() {
    const action=getUrlParam("action");
    if(action=="Assist"){
        const assistid=getUrlParam("assistid");
        const assist=curObj.Ext.Assist[assistid];
        if(assist.Action==Dictionary.Activity.Action.ReadArticleSeconds){
            const countdownDiv = document.createElement('div');
                countdownDiv.id = 'waitingTimepanel';
                countdownDiv.className = 'fixed_righttop button5';
                countdownDiv.innerText = language("g_waiting");
                document.body.appendChild(countdownDiv);
                let waitTime = assist.Seconds;
                function updateCountdown() {
                    if(!window.isStart){
                        return;
                    }
                    if (waitTime > 0) {
                        countdownDiv.innerText =language("g_tasktip1").replace("{0}",waitTime) ;
                        waitTime--;
                    } else {
                        clearInterval(countdownInterval);
                        countdownDiv.innerText = language("g_waiting");
                        doAction("Assist",{index:assistid},function(data){
                            if(data.Result){
                                 setContent('waitingTimepanel', language("m_getticketok").replace("{0}",assist.Tickets));
                             }else{
                                setContent('waitingTimepanel', data.Message);    
                             }
                        });
                    }
                }
                const countdownInterval = setInterval(updateCountdown, 1000);
                updateCountdown();

        }
    }
}