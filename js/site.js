var CONFIG = {
  whatsapp: "+234 911 619 3168",
  email: "awwalhamza2289@gmail.com",
  supabaseUrl: "https://qcinaeplcvprkwaowuml.supabase.co",
  supabaseKey: "sb_publishable_Eo0v9BMITziihezC3DeMQA_5961Khan"
};
(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var waNum=CONFIG.whatsapp.replace(/\D/g,"");
  function wa(text){return "https://wa.me/"+waNum+"?text="+encodeURIComponent(text)}
  $$("[data-wa]").forEach(function(a){a.href=wa("Hello Hamza, I saw your portfolio and I'd like a website for my business.");a.target="_blank";a.rel="noopener"});
  $$("[data-mail]").forEach(function(a){a.href="mailto:"+CONFIG.email});
  $$(".wa-text").forEach(function(e){e.textContent=CONFIG.whatsapp});
  $$(".mail-text").forEach(function(e){e.textContent=CONFIG.email});
  $$(".yr").forEach(function(e){e.textContent=new Date().getFullYear()});

  /* mobile menu */
  var nav=$(".nav"), mb=$(".menu");
  if(mb) mb.addEventListener("click",function(){var o=nav.classList.toggle("open");mb.setAttribute("aria-expanded",o?"true":"false");mb.textContent=o?"✕":"☰"});

  /* light / dark switch */
  var tb=$(".theme");
  function eff(){var a=document.documentElement.getAttribute("data-theme");return a||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}
  if(tb) tb.addEventListener("click",function(){var n=eff()==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",n);try{localStorage.setItem("hb-theme",n)}catch(e){}});

  /* copy buttons */
  $$("[data-copy]").forEach(function(b){b.addEventListener("click",function(){
    var t=b.dataset.copy==="wa"?CONFIG.whatsapp:CONFIG.email, old=b.textContent;
    var back=function(m){b.textContent=m;setTimeout(function(){b.textContent=old},1500)};
    var fail=function(){var s=window.getSelection(),r=document.createRange();r.selectNodeContents(b.parentNode.querySelector("span"));s.removeAllRanges();s.addRange(r);back("Selected")};
    try{navigator.clipboard.writeText(t).then(function(){back("Copied")},fail)}catch(e){fail()}
  })});

  /* hero assembly */
  var pin=$("#pin"), layers=$$("#mock [data-l]"), reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches, tick=false;
  function assemble(){
    var rect=pin.getBoundingClientRect(), total=rect.height-window.innerHeight*.9, p=Math.max(0,Math.min(1,-rect.top/Math.max(total,1)));
    p=.14+.86*p; if(reduce) p=1;
    layers.forEach(function(el){
      var i=+el.dataset.l; if(i===0) return;
      var s=i*.09, t=Math.max(0,Math.min(1,(p*1.15-s)/.4)), e=1-Math.pow(1-t,3);
      el.style.transform="translate3d("+(+el.dataset.x*(1-e))+"px,"+(+el.dataset.y*(1-e))+"px,"+(-240*(1-e))+"px) rotate("+(+el.dataset.r*(1-e))+"deg)";
      el.style.opacity=.2+.8*e;
    });
  }
  if(pin){window.addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(function(){assemble();tick=false})}},{passive:true});window.addEventListener("resize",assemble);assemble()}

  /* work filter */
  $$(".chip").forEach(function(c){c.addEventListener("click",function(){
    $$(".chip").forEach(function(x){x.setAttribute("aria-pressed",x===c?"true":"false")});
    var f=c.dataset.f; $$("[data-c]").forEach(function(el){el.hidden=!(f==="all"||el.dataset.c===f)});
  })});

  /* contact form -> WhatsApp */
  var cf=$("#cform");
  if(cf) cf.addEventListener("submit",function(e){
    e.preventDefault(); var f=cf.elements, m=$("#cmsg");
    if(f.name.value.trim().length<2||f.message.value.trim().length<5){m.className="msg err";m.textContent="Enter your name and a short message.";return}
    var text="Hello Hamza, my name is "+f.name.value.trim()+(f.biz.value.trim()?" from "+f.biz.value.trim():"")+". I need: "+f.kind.value+". "+f.message.value.trim();
    m.className="msg ok"; m.innerHTML="Your message is ready. <a href='"+wa(text)+"' target='_blank' rel='noopener'>Open WhatsApp to send it</a>";
    try{window.open(wa(text),"_blank")}catch(x){}
  });

  /* reviews */
  var walls=$$("[data-wall]"), form=$("#form"), ADMIN=!!$("#admin");
  if(!walls.length&&!form&&!ADMIN) return;
  var URL_=CONFIG.supabaseUrl.replace(/\/$/,""), KEY=CONFIG.supabaseKey, demo=!URL_||!KEY;
  var token=null, owner=false, reviews=[];
  try{if(ADMIN)token=sessionStorage.getItem("hb-token")}catch(e){}
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
  function rpc(name,args,tok){
    return fetch(URL_+"/rest/v1/rpc/"+name,{method:"POST",headers:{"apikey":KEY,"Authorization":"Bearer "+(tok||KEY),"Content-Type":"application/json"},body:JSON.stringify(args||{})})
      .then(function(r){return r.text().then(function(t){var j=null;try{j=t?JSON.parse(t):null}catch(e){}
        if(!r.ok) throw {status:r.status,msg:(j&&(j.message||j.msg))||t}; return j})});
  }
  function demoList(){try{return JSON.parse(store("hb-demo")||"[]")}catch(e){return[]}}
  function note(){var n=$("#modenote");if(n)n.hidden=!demo}
  function load(){
    var done=function(rows){reviews=rows||[];draw()};
    if(demo){note();return done(demoList())}
    var call=(owner&&token)?rpc("owner_portfolio_reviews",{},token):rpc("public_portfolio_reviews",{});
    call.then(done).catch(function(e){
      if(owner&&e&&(e.status===401||e.status===403||/not_allowed|JWT/i.test(e.msg||""))){signOut();return}
      if(!e||!e.status){demo=true;note();done(demoList())}else{done([])}
    });
  }
  function stars(n){var s="";for(var i=1;i<=5;i++)s+=i<=n?"&#9733;":"<span class='off'>&#9733;</span>";return "<div class='stars' role='img' aria-label='"+n+" out of 5 stars'>"+s+"</div>"}
  function draw(){
    walls.forEach(function(w){
      var lim=+w.dataset.limit||999, rows=reviews.slice(0,lim);
      var hv=$("#rv-home"); if(hv&&w.parentNode.parentNode===hv) hv.hidden=!rows.length;
      if(!rows.length){w.hidden=!ADMIN;w.innerHTML=ADMIN?"<div class='empty'>New reviews will show here with the phone number.</div>":"";return}
      w.hidden=false;
      w.innerHTML=rows.map(function(r){
        var d=new Date(r.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
        return "<article class='rv'>"+stars(r.rating)+"<p>"+esc(r.message)+"</p><div class='by'><strong>"+esc(r.name)+"</strong><span>"+esc(r.work)+"</span><span>"+d+"</span></div>"+
          (owner?"<div class='owner-row'><span>Phone</span><span class='ph'>"+esc(r.phone||"")+"</span><button type='button' class='del' data-del='"+esc(r.id)+"'>Delete</button></div>":"")+"</article>";
      }).join("");
    });
  }
  walls.forEach(function(w){w.addEventListener("click",function(e){
    var b=e.target.closest("[data-del]"); if(!b) return;
    if(!b.classList.contains("sure")){b.classList.add("sure");b.textContent="Tap again to delete";setTimeout(function(){b.classList.remove("sure");b.textContent="Delete"},4000);return}
    var id=b.dataset.del; b.disabled=true;
    if(demo){store("hb-demo",JSON.stringify(demoList().filter(function(r){return r.id!==id})));load();return}
    rpc("owner_delete_portfolio_review",{p_id:id},token).then(load).catch(function(){b.disabled=false;b.textContent="Could not delete. Try again"});
  })});

  if(form){
    var msg=$("#msg"), say=function(t,c){msg.textContent=t;msg.className="msg "+(c||"")};
    form.addEventListener("submit",function(e){
      e.preventDefault();
      var f=form.elements, rating=($("input[name=rating]:checked")||{}).value;
      var name=f.name.value.trim(), phone=f.phone.value.trim(), work=f.work.value.trim(), message=f.message.value.trim();
      if(f.site.value) return say("Thank you!","ok");
      if(name.length<2) return say("Enter your name.","err");
      if(phone.replace(/\D/g,"").length<7) return say("Enter a phone number I can reach you on.","err");
      if(work.length<2) return say("Tell me which work I did for you.","err");
      if(!rating) return say("Choose a star rating.","err");
      if(message.length<5) return say("Write a short review.","err");
      var btn=$("#send"); btn.disabled=true; say("Sending...");
      var ok=function(){form.reset();say("Thank you. Your review is on the page.","ok");btn.disabled=false;load()};
      if(demo){var list=demoList();list.unshift({id:"d"+Date.now(),created_at:new Date().toISOString(),name:name,phone:phone,work:work,rating:+rating,message:message});store("hb-demo",JSON.stringify(list));return ok()}
      rpc("submit_portfolio_review",{p_name:name,p_phone:phone,p_work:work,p_rating:+rating,p_message:message}).then(ok).catch(function(er){
        btn.disabled=false;
        if(er&&/too_many/.test(er.msg||"")) say("You have already sent reviews today. Please try again tomorrow.","err");
        else if(er&&er.status) say("Your review could not be saved. Check your details and try again.","err");
        else say("No internet connection. Try again when you are back online.","err");
      });
    });
  }

  /* admin page */
  var of=$("#owner"), om=$("#o-msg"), out=$("#signout");
  function show(){if(!of)return;of.hidden=owner;if(out)out.hidden=!owner}
  function signOut(){owner=false;token=null;try{sessionStorage.removeItem("hb-token")}catch(e){}show();load()}
  if(out) out.addEventListener("click",signOut);
  if(of) of.addEventListener("submit",function(e){
    e.preventDefault(); om.className="msg"; om.textContent="Signing in...";
    var em=$("#o-mail").value.trim(), pw=$("#o-pass").value;
    if(demo){owner=true;show();load();return}
    fetch(URL_+"/auth/v1/token?grant_type=password",{method:"POST",headers:{"apikey":KEY,"Content-Type":"application/json"},body:JSON.stringify({email:em,password:pw})})
      .then(function(r){return r.json().then(function(j){if(!r.ok)throw j;return j})})
      .then(function(j){token=j.access_token;try{sessionStorage.setItem("hb-token",token)}catch(e){}return rpc("owner_portfolio_reviews",{},token)})
      .then(function(rows){owner=true;reviews=rows;$("#o-pass").value="";om.textContent="";show();draw()})
      .catch(function(er){token=null;om.className="msg err";om.textContent=(er&&/not_allowed/.test(er.msg||""))?"This account is not the owner.":"Email or password is wrong."});
  });
  if(ADMIN&&token){owner=true}
  show(); load();
})();
