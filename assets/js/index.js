let options={
    layout:"topRight",
    theme:'relax',
}
let n=new Noty(options);
function flash(){
    let flash=document.getElementById('flash-error');
    
    if(!flash)
        {
            flash=document.getElementById('flash-success')
        }
    if(flash.getAttribute('message')=='')
        return;
    n.setText(flash.getAttribute('message'),true);
    n.setType(flash.getAttribute('type'),true);
    n.show()
}
window.onload=(e)=>{
    flash();
    let fp=document.getElementById('forgot-password');
    if(fp){
        fp.addEventListener('click',(e)=>{
            e.stopPropagation()
            e.preventDefault();
            document.getElementById('forgot-form').classList.remove('hide');
        })
    }
    let sitekey=document.getElementById('sitekey').value
    if(sitekey&&grecaptcha){
        grecaptcha.ready(function(){
            grecaptcha.execute(sitekey,{action:'demo'}).then(token=>{
                console.log(token)
                document.getElementById('captcha').value=token;
            })
        })
    }
}
