// ticker (illustrative sample rates)
const rates=[["LENDER A","4-YR FIXED","3.10%"],["LENDER B","3-YR FIXED","3.20%"],["LENDER C","5-YR FIXED","3.45%"],["LENDER D","1-YR FIXED","3.55%"],["LENDER E","2-YR FIXED","3.80%"],["LENDER F","VARIABLE","4.10%"]];
const tk=[...rates,...rates,...rates,...rates].map(r=>`<span>${r[0]} · ${r[1]}: <b>${r[2]}</b></span><span class="sep">//</span>`).join("");
const tkEl=document.getElementById("ticker");if(tkEl)tkEl.innerHTML=tk;

// factors marquee
const f=[["SALARY","Lenders typically cap loans at a multiple of income.","INCOME MULTIPLE"],["SAVINGS","Regular saving shows you can afford repayments.","CONSISTENCY"],["RENT","A strong rent record counts in your favour.","TRACK RECORD"],["DEPOSIT","You'll need a percentage of the price upfront.","MINIMUM DEPOSIT"],["TERM","Longer terms lower each monthly payment.","LOAN LENGTH"],["LOANS","Existing debts reduce what you can borrow.","DEBT RATIO"],["SPENDING","What's left after bills really matters.","DISPOSABLE INCOME"],["CREDIT","A clean history is key to approval.","CREDIT REPORT"]];
const fh=f.map(x=>`<div class="factor"><h3>${x[0]}</h3><p>${x[1]}</p><small>${x[2]}</small></div>`).join("");
const fEl=document.getElementById("factors");if(fEl)fEl.innerHTML=fh+fh;

// placeholder reviews
const revs=[["Placeholder review — replace with a genuine customer quote about how simple the process felt.","Customer Name","2 days ago"],["Placeholder review — a first-time buyer describing how helpful the assistant and advisor were.","Customer Name","1 week ago"],["Placeholder review — a switcher sharing how much they saved on repayments.","Customer Name","2 weeks ago"],["Placeholder review — someone praising the clear, step-by-step guidance.","Customer Name","1 month ago"]];
const rEl=document.getElementById("revs");if(rEl)rEl.innerHTML=revs.map(r=>`<div class="rev"><div class="stars">★★★★★</div><p>${r[0]}</p><footer><b>${r[1]}</b><span>${r[2]}</span></footer></div>`).join("");

// feature accordion
document.querySelectorAll(".feat").forEach(el=>el.addEventListener("click",()=>{
  el.parentElement.querySelectorAll(".feat").forEach(o=>o.classList.toggle("active",o===el));
}));
// faq
document.querySelectorAll(".qa button").forEach(b=>b.addEventListener("click",()=>b.parentElement.classList.toggle("open")));
// tabs
document.querySelectorAll(".tabs button").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".tabs button").forEach(o=>o.classList.toggle("on",o===b));
  document.querySelectorAll(".tabpane").forEach(p=>p.classList.toggle("on",p.id===b.dataset.tab));
}));
// menu
const menu=document.getElementById("menu");
document.getElementById("burger").onclick=()=>menu.classList.toggle("open");
menu.querySelectorAll("a").forEach(a=>a.onclick=()=>menu.classList.remove("open"));
// theme
const root=document.documentElement;
try{const t=localStorage.getItem("theme");if(t)root.dataset.theme=t}catch(e){}
document.getElementById("theme").onclick=()=>{
  root.dataset.theme=root.dataset.theme==="light"?"dark":"light";
  try{localStorage.setItem("theme",root.dataset.theme)}catch(e){}
};
// reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
const yr=document.getElementById("yr");if(yr)yr.textContent=new Date().getFullYear();

// first-time buyer borrowing calculator (indicative only)
const calcForm=document.getElementById("calcForm");
if(calcForm){
  const MULT=4, RATE=0.035; // first-time buyer income multiple; illustrative rate
  const eur=n=>"€"+Math.round(n).toLocaleString("en-IE");
  const num=el=>+String(el.value).replace(/[^\d]/g,"")||0;
  const $=id=>document.getElementById(id);
  const fmt=el=>el.addEventListener("input",()=>{const n=num(el);el.value=n?n.toLocaleString("en-IE"):"";update()});
  let step=1;
  function update(){
    const borrow=num($("income"))*MULT, dep=num($("deposit")), yrs=+$("term").value, m=RATE/12, n=yrs*12;
    $("termOut").textContent=yrs+" yrs";
    $("rMult").textContent=MULT;
    $("rBorrow").textContent=eur(borrow);
    const price=Math.min(borrow+dep, dep/0.1);
    const loan=Math.max(price-dep,0);
    $("rPrice").textContent=eur(price);
    $("rMonthly").textContent=eur(loan*m/(1-Math.pow(1+m,-n)))+"/mo";
    $("rNote").textContent=dep<(borrow+dep)*0.1
      ? "Your deposit is the limit here — lenders usually need 10% of the price. Saving more or using a support scheme could raise your budget."
      : "Repayment uses an illustrative "+(RATE*100).toFixed(1)+"% rate. Your advisor will confirm real lender offers.";
  }
  function go(s){
    step=s;
    calcForm.querySelectorAll(".cstep").forEach(el=>el.classList.toggle("on",+el.dataset.step===s));
    document.querySelectorAll("#stepper li").forEach((li,i)=>li.classList.toggle("on",i<s));
    update();
  }
  ["income","deposit"].forEach(id=>fmt($(id)));
  $("term").addEventListener("input",update);
  calcForm.addEventListener("click",e=>{
    if(e.target.closest("[data-next]")){
      if(step===1&&!num($("income"))){$("income").focus();return}
      go(step+1);
    }
    if(e.target.closest("[data-back]"))go(step-1);
  });
  calcForm.addEventListener("submit",e=>e.preventDefault());
  update();
}
