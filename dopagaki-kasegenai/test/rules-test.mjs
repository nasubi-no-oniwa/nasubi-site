// ランキングとコインのルールの試験（GitHub の上で Firebase の試し用データベースを立てて試す。本番のデータには触らない）
const NS='ft-red-default-rtdb',PROJ='ft-red',BASE='http://127.0.0.1:9000';
const b64=o=>Buffer.from(JSON.stringify(o)).toString('base64url');
const tok=uid=>b64({alg:'none',typ:'JWT'})+'.'+b64({uid,sub:uid,user_id:uid,iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+3600,aud:PROJ,iss:'https://securetoken.google.com/'+PROJ,provider_id:'anonymous',firebase:{sign_in_provider:'anonymous'}})+'.';
async function req(method,path,uid,body){const r=await fetch(BASE+'/'+path+'.json?ns='+NS+(uid?'&auth='+tok(uid):''),{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});return {ok:r.ok,status:r.status,j:await r.json().catch(()=>null)};}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fail=0;const ex=(name,res,want)=>{const ok=res.ok===want;console.log((ok?'OK  ':'NG  ')+name+' → '+res.status);if(!ok){fail++;console.log(JSON.stringify(res.j));}};
const TS={'.sv':'timestamp'};
const U='user1aaaaaaaaaaaaaaaaaaa',U2='user2bbbbbbbbbbbbbbbbbbb';
const P='kasegenai/';
const A=Math.log(1.5),B=Math.log(0.6);const S=(h,t)=>h*A+t*B;
const get=async uid=>(await req('GET',P+'run/'+uid,uid)).j;
async function newRun(uid){return req('PUT',P+'run/'+uid,uid,{st:TS,h:0,t:0,ph:0,pt:0,p:0,la:TS});}
async function toss(uid){const r=await req('PUT',P+'run/'+uid+'/p',uid,TS);return r;}
function applied(r){const head=r.p%2===0;const h=r.h+(head?1:0),t=r.t+(head?0:1);const pk=S(h,t)>S(r.ph,r.pt);return {st:r.st,h,t,ph:pk?h:r.ph,pt:pk?t:r.pt,p:0,la:r.p};}
const rec=(r,n='テスト')=>({n,h:r.h,t:r.t,ph:r.ph,pt:r.pt,st:r.st,k:S(r.h,r.t),pk:S(r.ph,r.pt),v:1,at:TS});
const dk=()=>Math.floor((Date.now()+32400000)/86400000);
const recD=(r,n)=>{const x=rec(r,n);return {...x,dk:dk(),ds:dk()*100000+x.k+1000};};
ex('ログインなしで始める',await newRun(null),false);
ex('始める',await newRun(U),true);
ex('ほかの人の場所で始める',await req('PUT',P+'run/'+U,U2,{st:TS,h:0,t:0,ph:0,pt:0,p:0,la:TS}),false);
ex('表の数をいきなり入れて始める',await req('PUT',P+'run/'+U2,U2,{st:TS,h:5,t:0,ph:5,pt:0,p:0,la:TS}),false);
await sleep(800);
ex('投げる',await toss(U),true);
let r=await get(U);console.log('  p='+r.p+'（'+(r.p%2===0?'表':'裏')+'）');
ex('結果を出す前にもう一度投げる',await toss(U),false);
const right=applied(r);const wrong={...right,h:r.p%2===0?r.h:r.h+1,t:r.p%2===0?r.t+1:r.t};
ex('逆の結果を書く',await req('PUT',P+'run/'+U,U,wrong),false);
ex('2つ進めて書く',await req('PUT',P+'run/'+U,U,{...right,h:right.h+1}),false);
ex('正しい結果を書く',await req('PUT',P+'run/'+U,U,right),true);
ex('すぐにまた投げる（0.7秒たっていない）',await toss(U),false);
for(let i=0;i<5;i++){await sleep(750);const a=await toss(U);if(!a.ok){ex('続けて投げる',a,true);break;}r=await get(U);const b=await req('PUT',P+'run/'+U,U,applied(r));if(!b.ok){ex('続けて結果を書く',b,true);break;}}
r=await get(U);console.log('  表'+r.h+' 裏'+r.t+' 最高 表'+r.ph+' 裏'+r.pt);
ex('最高をうそで書く',await req('PUT',P+'run/'+U,U,{...r,ph:r.h+3,pt:0}),false);
ex('k がおかしい記録',await req('PUT',P+'all/scores/'+U,U,{...rec(r),k:S(r.h,r.t)+1}),false);
ex('表の数がちがう記録',await req('PUT',P+'all/scores/'+U,U,{...rec(r),h:r.h+1,k:S(r.h+1,r.t)}),false);
ex('記録する',await req('PUT',P+'all/scores/'+U,U,rec(r)),true);
ex('今日のほうに記録する',await req('PUT',P+'d/scores/'+U,U,recD(r)),true);
ex('今日のほうに ds がおかしい記録',await req('PUT',P+'d/scores/'+U2,U2,{...recD(r),ds:1}),false);
ex('みんなの記録に書く',await req('PUT',P+'lg/'+U,U,{k:S(r.h,r.t),c:r.h+r.t,st:r.st,at:TS}),true);
ex('みんなの記録に回数をうそで書く',await req('PUT',P+'lg/'+U,U,{k:S(r.h,r.t),c:r.h+r.t+1,st:r.st,at:TS}),false);
ex('名前だけ変える',await req('PUT',P+'all/scores/'+U,U,rec(r,'なまえ')),true);
ex('13文字の名前',await req('PUT',P+'all/scores/'+U,U,rec(r,'あいうえおかきくけこさしす')),false);
ex('同じ記録をもう一度（よくなっていない）',await req('PUT',P+'all/scores/'+U,U,{...rec(r),at:TS,n:'なまえ'}),false);
ex('新しく始める',await newRun(U),true);
ex('前の回の記録で名前を変える',await req('PUT',P+'all/scores/'+U,U,rec(r,'べつ')),true);
const r2=await get(U);
ex('0回で記録する',await req('PUT',P+'all/scores/'+U,U,rec(r2)),false);
ex('だれでもランキングを読める',await req('GET',P+'all/scores',null),true);
ex('だれでもみんなの記録を読める',await req('GET',P+'lg',null),true);
ex('ほかの人の回は読めない',await req('GET',P+'run/'+U,U2),false);
ex('hidden に書く',await req('PUT',P+'hidden/'+U,U,true),false);
console.log(fail?('失敗 '+fail+' 件'):'すべて合格');
if(fail)process.exit(1);
