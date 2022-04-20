window.onload=function(){
    // 取消 a 标签默认事件
    let targetAs = db.ga('.target a')
    
    targetAs.forEach((item)=>{
       item.onclick=function(e){
           e.preventDefault();
       }
    })
   
    // 侧边选项卡
   let about = db.g('#about');
   let proxy = db.g('#proxy');
   let dropAbout = document.querySelector('.about');
   let dropProxy = document.querySelector('.proxy');
   about.addEventListener('click',function(){
    dropAbout.style.display = 'block';
    dropProxy.style.display = 'none';
});
   proxy.addEventListener('click',function(){
    dropAbout.style.display = 'none';
    dropProxy.style.display = 'block';
})
    // 匹配条件选修卡
    let matching = db.g('.dropdown-toggle');
    let dropdown = db.g('.dropdown-menu');
    let dropdowns = db.ga('.dropdown-menu li a')
    matching.addEventListener('click',function(){
        dropdown.style.display = 'block'
    })
    dropdowns.forEach((item)=>{
        item.addEventListener('click',function(){
            matching.innerText =  item.innerText;
            dropdown.style.display = 'none'
        })
    })

}

