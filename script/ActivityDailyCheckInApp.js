const isTopToolBar = true;
async function doOnPageLoad() {
    doAction("Init");
}
function doAction_Init_callback(data)
{
    var _html=`<div class='remark'>${language("a_d_title3").replace("{0}",data.continuedays)}</div>`;
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
            var btnstr=language("a_d_button1");
            if(!data.today){
                btnstr=language("a_d_button2");
            }
            var btn=document.createElement('div');
            btn.className=data.today?'dailycheckin_btn':'dailycheckin_btn_done';
            btn.innerHTML=btnstr;
            if(data.today){
                btn.addEventListener('click', () => {
                    doAction("Submit");
                });
            }
            const btnCheckinDiv = document.getElementById('btnCheckin');
            while (btnCheckinDiv.firstChild) {
                btnCheckinDiv.removeChild(btnCheckinDiv.firstChild);
            }
            btnCheckinDiv.appendChild(btn);
}
function doAction_Submit_callback(data)
{
    if(data.Result){
        doAction("Init");
    }else{
        tgAlert(data.Message);
    }
}