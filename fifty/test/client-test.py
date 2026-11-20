# ゲームそのものを、試し用のデータベース（GitHub の上の Firebase の試し用）につないで通しで遊ぶ試験。本番のデータには触らない
import asyncio, os, re, sys, json
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
ROOT=os.environ.get('GITHUB_WORKSPACE','.')
NS='ft-red-default-rtdb'
DBU='https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/fifty/'
fail=0
def ex(name,ok):
    global fail
    print(('OK  ' if ok else 'NG  ')+name,flush=True)
    if not ok: fail+=1
async def route(r):
    u=r.request.url; sp=urlsplit(u)
    if u.startswith('https://nasubi-no-oniwa.github.io/fifty/'):
        p=sp.path.split('fifty/')[1] or 'index.html'
        f=os.path.join(ROOT,p)
        if os.path.exists(f): return await r.fulfill(path=f)
        return await r.fulfill(status=404,body='')
    if sp.netloc.endswith('firebasedatabase.app'):
        q=sp.query+('&' if sp.query else '')+'ns='+NS
        resp=await r.fetch(url='http://127.0.0.1:9000'+sp.path+'?'+q)
        return await r.fulfill(response=resp,headers={**resp.headers,'access-control-allow-origin':'*'})
    if sp.netloc in ('identitytoolkit.googleapis.com','securetoken.googleapis.com'):
        resp=await r.fetch(url='http://127.0.0.1:9099/'+sp.netloc+sp.path+('?'+sp.query if sp.query else ''))
        return await r.fulfill(response=resp,headers={**resp.headers,'access-control-allow-origin':'*'})
    if 'cdn.jsdelivr.net' in u: return await r.continue_()
    return await r.abort()
POUR="__FF.adv(%d,true);__FF.adv(300,false);__FF.decide();__FF.adv(400,false)"
async def play(pg,hold):
    await pg.evaluate(POUR%hold)
    await pg.wait_for_function("__FF.mode==='result'",timeout=30000)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
        c=await b.new_context(viewport={'width':390,'height':844},locale='ja-JP')
        pg=await c.new_page(); logs=[]
        pg.on('console',lambda m: logs.append(m.type+': '+m.text)); pg.on('pageerror',lambda e: logs.append('ERR '+str(e)))
        await c.route('**/*',route)
        await pg.goto('https://nasubi-no-oniwa.github.io/fifty/')
        await pg.wait_for_function("window.__FF && __FF.mode==='title'",timeout=30000)
        ex('タイトルが出る',True)
        # 1回目：記録できる
        await pg.evaluate("__FF.startNo(1)")
        await pg.wait_for_function("__FF.RUN && __FF.RUN.state!=='pending'",timeout=20000)
        ex('1回目は記録できる回になる',await pg.evaluate("__FF.RUN.state==='yes' && __FF.RUN.st>0"))
        # 見るモード：ドラッグしても注がれず、視点だけ回る。元の位置に戻れる
        await pg.click('#viewBtn'); await pg.mouse.move(195,380); await pg.mouse.down(); await pg.mouse.move(295,470,steps=6); await pg.mouse.up(); await pg.wait_for_timeout(300)
        v=await pg.evaluate("({yaw:__FF.VIEW.yaw,pitch:__FF.VIEW.pitch,em:__FF.P.emitted,home:!document.getElementById('homeBtn').hidden})"); print('  見るモード',json.dumps(v),flush=True)
        ex('見るモードでは注がれず、視点が回る',abs(v['yaw'])>0.3 and v['pitch']>0.2 and v['em']==0 and v['home'])
        await pg.click('#viewBtn'); await pg.mouse.move(195,380); await pg.mouse.down(); await pg.wait_for_function("__FF.P.emitted>0",timeout=30000); await pg.mouse.up()
        ex('注ぐモードに戻すと、止めた視点のまま注げる',await pg.evaluate("__FF.P.emitted>0 && Math.abs(__FF.VIEW.yaw)>0.3"))
        await pg.click('#homeBtn'); await pg.wait_for_function("__FF.VIEW.yaw===0 && __FF.VIEW.pitch===0",timeout=30000); await pg.wait_for_timeout(300)
        ex('「元の位置に戻る」で最初の視点に戻る',await pg.evaluate("document.getElementById('homeBtn').hidden"))
        await play(pg,262)
        fin=await pg.evaluate("({pct:__FF.FIN.pct,dev:__FF.FIN.dev,dur:__FF.FIN.dur})"); print('  結果',json.dumps(fin),flush=True)
        ex('注いだ量が 0〜100% のあいだ',0<fin['pct']<100)
        ex('量を計算しなおしても同じ',await pg.evaluate("Math.abs(__FF.GL.totalOf(__FF.FIN.log,__FF.FIN.end)*100-__FF.FIN.pct)<1e-9"))
        await pg.fill('#nameIn','テスト'); await pg.click('#recGo')
        await pg.wait_for_selector('#recNote.ok',timeout=20000)
        msg=await pg.inner_text('#recNote'); print('  '+msg.replace('\n',' '),flush=True)
        ex('記録すると今日も全期間も1位',msg.count('1位')==2)
        srv=await pg.evaluate("(async()=>{const a=JSON.parse(localStorage.getItem('ff_auth'));const r=await fetch('%sb/e/all/'+a.uid+'.json');return r.json();})()"%DBU)
        ex('サーバーに記録が入っている',bool(srv) and abs(srv['k']-fin['dev'])<1e-9 and srv['g']=='e1' and srv['n']=='テスト')
        await pg.click('#rRank'); await pg.wait_for_selector('#rankBox tr[data-i]',timeout=15000)
        ex('ランキングに1人出る',await pg.evaluate("document.querySelectorAll('#rankBox tr[data-i]').length")==1)
        await pg.click('#rankBox tr[data-i]'); await pg.wait_for_function("__FF.mode==='replay'",timeout=8000)
        ex('行を押すと再生が始まる',True)
        await pg.click('#decide'); await pg.wait_for_selector('#rankPanel:not([hidden])',timeout=8000)
        await pg.click('#rankBack'); await pg.wait_for_selector('#result:not([hidden])',timeout=8000)
        # 同じグラスの2回目は練習
        await pg.click('#againBtn'); await pg.wait_for_function("__FF.mode==='play'",timeout=8000)
        ex('同じグラスの2回目は練習',await pg.evaluate("__FF.RUN.state==='practice'"))
        await play(pg,200)
        ex('練習は記録の欄が出ない',await pg.evaluate("document.getElementById('recForm').hidden"))
        # 手元の印を消しても、サーバーが2回目だと見分ける
        await pg.evaluate("localStorage.removeItem('ff_tried');__FF.startNo(1)")
        await pg.wait_for_function("__FF.RUN && __FF.RUN.state!=='pending'",timeout=20000)
        ex('手元の印を消しても練習になる',await pg.evaluate("__FF.RUN.state==='practice'"))
        # 別のグラスで、もっと悪い記録は全期間に残らない
        await pg.evaluate("__FF.startNo(2)"); await pg.wait_for_function("__FF.RUN && __FF.RUN.state!=='pending'",timeout=20000)
        await pg.wait_for_timeout(600); await play(pg,150)
        await pg.click('#recGo'); await pg.wait_for_selector('#recNote.ok',timeout=20000)
        srv2=await pg.evaluate("(async()=>{const a=JSON.parse(localStorage.getItem('ff_auth'));const r=await fetch('%sb/e/all/'+a.uid+'.json');return r.json();})()"%DBU)
        ex('悪い記録では全期間が変わらない',srv2['g']=='e1')
        # こぼす
        await pg.evaluate("__FF.startNo(3)"); await pg.wait_for_function("__FF.RUN && __FF.RUN.state!=='pending'",timeout=20000)
        await pg.evaluate("__FF.adv(700,true)"); await pg.wait_for_function("__FF.mode==='result'",timeout=40000)
        ex('注ぎすぎるとこぼれる',await pg.evaluate("__FF.FIN.spill===true && document.getElementById('recForm').hidden"))
        # うその記録（量と操作が合わない）はランキングに出ない
        await pg.evaluate("__FF.startNo(4)"); await pg.wait_for_function("__FF.RUN && __FF.RUN.state==='yes'",timeout=20000)
        await pg.wait_for_timeout(1500)
        st=await pg.evaluate("(async()=>{const a=JSON.parse(localStorage.getItem('ff_auth'));const r=await fetch('%sb/e/all/'+a.uid+'.json?auth='+a.token,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({n:'うそ',g:'e4',k:0.000001,dur:1,lg:'0.5k|a0',st:__FF.RUN.st,v:1,at:{'.sv':'timestamp'}})});return r.status;})()"%DBU)
        print('  うその記録の書きこみ',st,flush=True)
        rows=await pg.evaluate("__FF.loadBoard('e','all').then(r=>r.map(x=>x.n))")
        ex('うその記録はランキングに出ない','うそ' not in rows)
        # 自作グラス
        await pg.evaluate("__FF.showTitle();__FF.openMaker()"); await pg.wait_for_function("__FF.mode==='maker'",timeout=8000)
        await pg.evaluate("__FF.setMK({drawn:true,s:1,s2:3,t:120,rim:160,base:Array.from({length:40},(_,i)=>0.3+0.25*Math.sin(i/5)+i*0.006)})")
        await pg.fill('#mkName','ためしグラス'); await pg.click('#mkSave')
        await pg.wait_for_selector('#madePanel:not([hidden])',timeout=20000)
        code=await pg.inner_text('#mdCode'); print('  合言葉',code,flush=True)
        ex('グラスを作ると合言葉が出る',bool(re.match(r'^[A-HJ-NP-Z2-9]{8}$',code)))
        cup=await pg.evaluate("fetch('%scups/%s.json').then(r=>r.json())"%(DBU,code))
        ex('サーバーにグラスが入っている',bool(cup) and cup['n']=='ためしグラス' and len(cup['r'])==40 and cup['s2']==3)
        await pg.click('#mdPlay'); await pg.wait_for_function("__FF.mode==='play' && __FF.RUN.state!=='pending'",timeout=20000)
        ex('作ったグラスで記録できる回になる',await pg.evaluate("__FF.RUN.state==='yes'"))
        await pg.wait_for_timeout(600); await play(pg,255)
        await pg.click('#recGo'); await pg.wait_for_selector('#recNote.ok',timeout=20000)
        msg=await pg.inner_text('#recNote'); print('  '+msg,flush=True)
        ex('自作グラスのランキングで1位','1位' in msg)
        # 合言葉つきのリンクで開く
        pg2=await c.new_page(); await pg2.goto('https://nasubi-no-oniwa.github.io/fifty/?c='+code)
        await pg2.wait_for_function("window.__FF && __FF.mode==='play'",timeout=30000)
        ex('合言葉つきのリンクでそのグラスが始まる',await pg2.evaluate("__FF.CUR.meta.code")==code)
        ex('同じ人の2回目なので練習',await pg2.evaluate("__FF.RUN.state")=='practice')
        bad=[l for l in logs if l.startswith('ERR') or (l.startswith('error') and 'net::ERR_FAILED' not in l and 'Failed to load resource' not in l)]
        for l in bad[:10]: print('  '+l,flush=True)
        ex('画面にエラーが出ていない',not [l for l in bad if l.startswith('ERR')])
        await b.close()
    print('失敗 %d 件'%fail if fail else 'すべて合格',flush=True)
    sys.exit(1 if fail else 0)
asyncio.run(main())
