
async function doOnPageLoad() {
   await runWebFunc("test");
}
async function sendmessage() {
    let message = getContent("txtmessage");
    const category=getContent("selcategory");
    const chatid=getContent("selchat");
    const activityvalue=getContent("selactivity");
    const activityid=activityvalue.split("_")[0];
    const imgurl=getContent("txtimgurl");
    const buttontxt=getContent("txtbuttontitle");
    const result=await runWebFunc("SendChatMessage",{chatid:chatid,message:message,category:category,activityid:activityid,buttontxt:buttontxt,imgurl:imgurl});
    if(result)
    {
        alert("Message sent successfully");
    }
}
function changecontentcategory()
{
    const category=document.getElementById("selcategory").value;
    const activityp=document.getElementById("activitypanel");
    const buttontitlep=document.getElementById("buttontitlepanel");
    if(category=="activity")
    {
        activityp.style.display="";
    }else{
        activityp.style.display="none";
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
    const imgurl=activityvalue.split("_")[1];
   if(category=="index"){
        setContent("txtbuttontitle","❤️Open Telink");
        setContent("txtimgurl","");
    }else if(category=="checkin"){
        setContent("txtbuttontitle","💰Daily Check-in");
        setContent("txtimgurl","");
    }else if(category=="activity"){
        setContent("txtbuttontitle",activitytitle);
        setContent("txtimgurl",imgurl);
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