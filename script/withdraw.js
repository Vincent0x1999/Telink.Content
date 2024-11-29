const isSupportBack=true;
let addrselected=null;
function doOnPageLoad()
{
    // init_custom_select();
    addrselected=new custom_select("withdraw_addresstype",[
        { value: 'wallet', html: language('g_connectwallet') },
        { value: 'input', html: language('g_enteraddress') }
    ],function(value){
        if(value=='wallet'){
            setDisplay('withdraw_address_wallet',true);
             setDisplay('withdraw_address_input',false);
        }else{
            setDisplay('withdraw_address_wallet',false);
            setDisplay('withdraw_address_input',true);
        }

    });
    TonLib.initTonConnect("ton-connect",function(isconected){
      
    });
    
}
function setAll()
{
    setContent('Withdrawal_pointNum',getContent('control_UserAmount'));
    calcConvertRate();
}
function calcConvertRate()
{   var pointstr=getContent('Withdrawal_pointNum');
    if(pointstr==''){
        pointstr=0;
    }
    const pointnum=parseInt(pointstr);
    const rate=parseFloat(getContent('convertRate'));
    const result=pointnum/rate;
    setContent('widtdraw_cashNum', result);
}

async function submitWithdrawApplication(toType)
{
    try{
        // alert(flowdirection+","+Dictionary.Currency.Type.Crypto+","+Dictionary.Currency.Type.Fiat);
    if(toType!=Dictionary.Currency.Type.Crypto && toType!=Dictionary.Currency.Type.Fiat){
        tgAlert(language("m_processerror"));
        return;
    }
    const fromNum = (() => {
        const value = parseInt(getContent('Withdrawal_pointNum'));
        return isNaN(value) ? 0 : value;
    })();
    const mininum=parseInt(getContent('minConvertPoint'));
    const userAmount=parseInt(getContent('control_UserAmount'));
    const convertRate=parseFloat(getContent('convertRate'));
    const toUnit=toType===Dictionary.Currency.Type.Fiat?"USD":getContent('withdraw_unit');
    const toNum= fromNum/convertRate;
    const toGateway= toType===Dictionary.Currency.Type.Fiat?"Paypal":getContent('withdraw_gateway');
    const crypto_addresstype=addrselected.getValue();
    let toAccount;
    if(toType==Dictionary.Currency.Type.Fiat) {
        toAccount=getContent('paymentAccount')

    }else if(toType==Dictionary.Currency.Type.Crypto) {
       if(crypto_addresstype=="wallet"){
            // if(tonConnectUI.wallet && tonConnectUI.wallet.account){
            //     const currentWallet = tonConnectUI.wallet.account.address;
            //     account = TonConnectSDK.toUserFriendlyAddress(currentWallet);
            // }
            toAccount=TonLib.getTonConnectUIWalletAddress();
        }else{
            toAccount=getContent('withdraw_inputaddress');   
        }
    }
    if(fromNum<=0){
        tgAlert(language("g_Point")+" "+language("m_formaterror"));
        return;
    }
    if(fromNum>userAmount){
        tgAlert(language("m_notenough").replace("{0}",language("g_Point")));
        return;
    }
    if(fromNum<mininum){
        tgAlert(language("m_withdmin").replace("{0}",mininum));
        return;
    }
    if(toType==Dictionary.Currency.Type.Fiat) {
        if(toAccount=='' || !checkEmail(toAccount)){
            tgAlert(language("g_email")+language("m_formaterror"));
            return;
        }
    }
    if(toType==Dictionary.Currency.Type.Crypto) {
  
        const isok=await doFunctionByName('checkAddress_'+toGateway,toAccount);
        if(toAccount=='' || !isok){
            tgAlert(language("g_withaddress")+language("m_formaterror"));
            return;
        }
    }
 
    tgConfirm(language("m_submitconfirm"), function(confirmed) {
        if (confirmed) {
            const jsonstr=JSON.stringify({
                initdata: getTgInitData(),
                fromType:"Point",
                fromGateway:"Point",
                fromUnit:"Point",
                fromNum:fromNum,
                toType:toType,
                toGateway:toGateway,
                toUnit:toUnit,
                toNum:toNum,
                toAccount:toAccount
            });
            doWebService('GeneralWebServices', 'SubmitUserWithdrawApplication', 'POST', '',jsonstr).then((result)=>{
                if(result.Result){
                    const data=result.Data;
                    if(data.Result){
                        tgAlert(language("m_submitok"));
                        toPage('MyApplications');
                    }
                }else{
                    processException(result);
                }
            });
        } 
    });
    }catch(e){
        alert(e);
    }
}




