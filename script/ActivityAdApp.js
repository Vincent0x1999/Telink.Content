const isTopToolBar=true;
function doOnPageLoad(){
    initActivity_processContent();
    initActivityAction();
    doAction("Init");
}
async function doAction_Init_callback(data)
{
    let logdic={};
    data.forEach(log => {
        logdic[log.Action]=log;
    });
    if(curObj!=null && curObj.Ext!=null && curObj.Ext.Reward!=null){
        const reward=curObj.Ext.Reward;
        let html='';
        if(reward.hasOwnProperty("PageView")){
        
           //doAction("PageView");
        }
        if(reward.hasOwnProperty("WaitingTime")){
           let done=logdic.hasOwnProperty("WaitingTime");
           html+=`<div>WaitingTime: ${reward.WaitingTime.WaitSeconds},${reward.WaitingTime.Currency.Num},${done}</div>`;
           if(!done){
                const countdownDiv = document.createElement('div');
                countdownDiv.id = 'waitingTimepanel';
                countdownDiv.className = 'fixed_righttop';
                countdownDiv.innerText = 'waiting...';
                document.body.appendChild(countdownDiv);
                let waitTime = reward.WaitingTime.WaitSeconds;
                function updateCountdown() {
                    if(!window.isStart){
                        return;
                    }
                    if (waitTime > 0) {
                        countdownDiv.innerText = `After ${waitTime} seconds, collect points`;
                        waitTime--;
                    } else {
                        clearInterval(countdownInterval);
                        countdownDiv.innerText = 'waiting...';
                        doAction("WaitingTime");
                    }
                }
                const countdownInterval = setInterval(updateCountdown, 1000);
                updateCountdown();
           }else{
            const countdownDiv = document.createElement('div');
                countdownDiv.className = 'fixed_righttop';
                document.body.appendChild(countdownDiv);
                countdownDiv.innerText = `You have received points`;
           }
          
        } 
    }
    
}
function doAction_WaitingTime_callback(data){
    if(data.Result){
         setContent('waitingTimepanel', 'You successfully earned points');
     }else{
         setContent('activitymsg', 'Failed to obtain points');
     }
 }
 
function initActivity_processContent()
{
    //初始化视频
    var video = document.getElementById('mainVideo');
    if(video){
        window.isStart=false;
        video.addEventListener('ended', () => {
            //videoOverlay.style.display = 'block';
            setDisplay('control_Recommend',true);
            window.isStart=false;
        });
        video.addEventListener('pause', () => {
            setDisplay('control_Recommend',true);
            window.isStart=false;
        });
        video.addEventListener('play', () => {
            setDisplay('control_Recommend',false);
            window.isStart=true;
        });
        video.addEventListener('timeupdate', () => {
            //const currentTime = video.currentTime;
            if(video.currentTime>0){
               window.isStart=true;
               video.removeEventListener('timeupdate', () => {});
            }
        });

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
async function initActivityAction()
{
    if(curObj!=null && curObj.ExtObj!=null && curObj.ExtObj.Reward!=null){
        if(curObj.ExtObj.Reward.PageView){
        
           doAction("PageView");
        }
        if(curObj.ExtObj.Reward.WaitingTime){
            const reward=curObj.ExtObj.Reward.WaitingTime;
            const action="WaitingTime";
            const result=await checkDo(action);
            if(result.Result){
                const countdownDiv = document.createElement('div');
                countdownDiv.id = 'waitingTimepanel';
                countdownDiv.className = 'toolbar_rightttop';
                countdownDiv.innerText = 'waiting...';
                document.body.appendChild(countdownDiv);
                let waitTime = reward.WaitSeconds;
                function updateCountdown() {
                    if(!window.isStart){
                        return;
                    }
                    if (waitTime > 0) {
                        countdownDiv.innerText = `After ${waitTime} seconds, collect points`;
                        waitTime--;
                    } else {
                        clearInterval(countdownInterval);
                        countdownDiv.innerText = 'waiting...';
                        doAction(action);
                    }
                }
                const countdownInterval = setInterval(updateCountdown, 1000);
                updateCountdown();
            
            }else{
                const countdownDiv = document.createElement('div');
                countdownDiv.className = 'toolbar_rightttop';
                document.body.appendChild(countdownDiv);
                countdownDiv.innerText = `You have received points`;
            }
        } 
    }
}