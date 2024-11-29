async function saveDraft() {
    try{
    var draft = {
        title: getContent('prize_name'),
    };
    await setTgCloudData('draft', JSON.stringify(draft) );
    alert('Saved');
}catch(e){
    alert(e);
}
}
async function doOnPageLoad() {
    var draftSTR =await getTgCloudData('draft');
    const draft = JSON.parse(draftSTR);
    if (draft) {
        setContent('prize_name', draft.title);
    }

}