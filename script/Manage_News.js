

async function sendmessage() {
    let message = getContent("txtmessage");
    const category=getContent("selcategory");
    const chatid=getContent("selchat");
    const activityvalue=getContent("selactivity");
    const activityid=activityvalue.split("_")[0];
    const groupvalue=getContent("selgroup");
    const groupid=groupvalue.split("_")[0];
    const imgurl=getContent("txtimgurl");
    const buttontxt=getContent("txtbuttontitle");
    const result=await runWebFunc("SendChatMessage",{chatid:chatid,message:message,category:category,activityid:activityid,groupid:groupid,buttontxt:buttontxt,imgurl:imgurl});
    if(result)
    {
        alert("Message sent successfully");
    }
}
function changecontentcategory()
{
    const category=document.getElementById("selcategory").value;
    const activityp=document.getElementById("activitypanel");
    const groupp=document.getElementById("grouppanel");
    const buttontitlep=document.getElementById("buttontitlepanel");
    if(category=="activity")
    {
        activityp.style.display="";
        groupp.style.display="none";
    }else if(category=="group"){
        activityp.style.display="none";
        groupp.style.display="";
    }else{
        activityp.style.display="none";
        groupp.style.display="none";
    }
    if(category=="0")
    {
        buttontitlep.style.display="none";
    }else{
        buttontitlep.style.display="";
    }
    settxtbuttontitle();
}
function settxtbuttontitle()
{
    const category=getContent("selcategory");
    const selectElement = document.getElementById("selactivity");
    const selectedIndex = selectElement.selectedIndex;
    const activitytitle = selectElement.options[selectedIndex].text;
    const activityvalue=selectElement.options[selectedIndex].value;
    const activityimgurl=activityvalue.split("_")[1];

    const selectElementgroup = document.getElementById("selgroup");
    const selectedIndexgroup = selectElementgroup.selectedIndex;
    const grouptitle = selectElementgroup.options[selectedIndexgroup].text;
    const groupvalue=selectElementgroup.options[selectedIndexgroup].value;
    const groupimgurl=groupvalue.split("_")[1];
   if(category=="index"){
        setContent("txtbuttontitle","❤️Open Telink");
        setContent("txtimgurl","");
    }else if(category=="checkin"){
        setContent("txtbuttontitle","💰Daily Check-in");
        setContent("txtimgurl","");
    }else if(category=="activity"){
        setContent("txtbuttontitle",activitytitle);
        setContent("txtimgurl",activityimgurl);
    }else if(category=="group"){
        setContent("txtbuttontitle",grouptitle);
        setContent("txtimgurl",groupimgurl);
    }else{
        setContent("txtbuttontitle","");
        setContent("txtimgurl","");
    } 
}
function openimgurl(){
    const imgurl=getContent("txtimgurl");
    if(imgurl=="")
    {
        tgAlert("请输入图片地址")
        return;
    }
    window.open(imgurl);
}