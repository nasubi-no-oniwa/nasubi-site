# ゲームそのものを、試し用のデータベース（GitHub の上の Firebase の試し用）につないで通しで遊ぶ試験。本番のデータには触らない
import asyncio, os, sys, json, time
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
ROOT=os.environ.get('GITHUB_WORKSPACE','.')
NS='ft-red-default-rtdb'
DBU='https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/en/'
fail=0
def ex(name,ok):
    global fail
    print(('OK  ' if ok else 'NG  ')+name,flush=True)
    if not ok: fail+=1
async def route(r):
    u=r.request.url; sp=urlsplit(u)
    if u.startswith('https://nasubi-no-oniwa.github.io/en/'):
        p=sp.path.split('/en/',1)[1] or 'index.html'
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
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader'])
        c=await b.new_context(viewport={'width':390,'height':844},locale='ja-JP')
        pg=await c.new_page(); logs=[]
        pg.on('console',lambda m: logs.append(m.type+': '+m.text)); pg.on('pageerror',lambda e: logs.append('ERR '+str(e)))
        await c.route('**/*',route)
        await pg.goto('https://nasubi-no-oniwa.github.io/en/')
        await pg.wait_for_function("window.__EN && __EN.mode==='title'",timeout=30000)
        ex('タイトルが出る',True)
        ex('30秒・60秒・120秒のボタンが出る',await pg.evaluate("['m30','m60','m120'].every(i=>document.getElementById(i).textContent.length>0)"))
        await pg.click('#m30'); t0=time.time()
        await pg.wait_for_function("__EN.RUN && __EN.RUN.state!=='pending'",timeout=20000)
        ex('記録できる回になる（30秒の組）',await pg.evaluate("__EN.RUN.state==='yes' && __EN.RUN.st>0 && __EN.SECS===30"))
        await pg.wait_for_function("__EN.mode==='play'",timeout=30000)
        ex('カウントダウンのあとに始まる',True)
        ex('お金が足りないと強化できない',await pg.evaluate("(__EN.buy(0),__EN.LOG.length===0 && __EN.G.lv[0]===0)"))
        await pg.evaluate("__EN.adv(480,false)")
        st=await pg.evaluate("({c:__EN.G.coins,h:__EN.G.hits,k:__EN.G.k})"); print('  8秒ぶん',json.dumps(st),flush=True)
        ex('当たるとお金がたまり、円がこわれる',st['c']>0 and st['h']>0 and st['k']>=1)
        await pg.evaluate("__EN.frame()"); await pg.dispatch_event('#upS','pointerdown')
        ex('ボタンで強化できて、記録に残る',await pg.evaluate("__EN.LOG.length===1 && __EN.LOG[0][1]===1 && __EN.G.lv[1]===1"))
        await pg.evaluate("__EN.adv(99999,true)")
        await pg.wait_for_function("__EN.mode==='result'",timeout=60000)
        fin=await pg.evaluate("({k:__EN.FIN.k,score:__EN.FIN.score,lv:__EN.FIN.lv,n:__EN.FIN.log.length})"); print('  結果',json.dumps(fin),flush=True)
        ex('30秒ぶんで終わり、円がこわれている',fin['k']>=5 and await pg.evaluate('__EN.G.tick===1800 && __EN.FIN.secs===30'))
        ex('強化の記録から計算しなおしても同じ',await pg.evaluate("(()=>{const S=__EN.S;const L=S.decLog(S.encLog(__EN.FIN.log),1800);const s=S.replayAll(L,1800);return !!s && S.scoreOf(s)===__EN.FIN.score;})()"))
        # 結果の個数は0から数え上がる演出があるので、数え終わるのを待ってから見る
        try: await pg.wait_for_function("document.getElementById('rPct').textContent.indexOf(String(__EN.FIN.k))>=0",timeout=5000)
        except Exception: pass
        ex('結果に個数が出る',str(fin['k']) in await pg.inner_text('#rPct'))
        # 30秒たつ前は、サーバーが記録を受けつけない
        await pg.fill('#nameIn','テスト'); await pg.click('#recGo')
        await pg.wait_for_selector('#recNote.err',timeout=30000)
        ex('早送りした記録は、30秒たつまで受けつけられない',True)
        wait=28-(time.time()-t0)
        if wait>0: print('  %d秒待ちます…'%wait,flush=True); await pg.wait_for_timeout(int(wait*1000))
        await pg.click('#recGo'); await pg.wait_for_selector('#recNote.ok',timeout=30000)
        msg=await pg.inner_text('#recNote'); print('  '+msg.replace('\n',' '),flush=True)
        ex('記録すると今日も全期間も1位',msg.count('1位')==2)
        srv=await pg.evaluate("(async()=>{const a=JSON.parse(localStorage.getItem('en_auth'));const r=await fetch('%sb30/all/'+a.uid+'.json');return r.json();})()"%DBU)
        ex('サーバーの30秒の組に記録が入っている',bool(srv) and abs(srv['k']-fin['score'])<1e-9 and srv['n']=='テスト')
        srv120=await pg.evaluate("(async()=>{const a=JSON.parse(localStorage.getItem('en_auth'));const r=await fetch('%sb/all/'+a.uid+'.json');return r.json();})()"%DBU)
        ex('120秒の組には入っていない',srv120 is None)
        await pg.click('#rRank'); await pg.wait_for_selector('#rankBox tr',timeout=15000)
        ex('30秒のランキングに1人出る',await pg.evaluate("__EN.RK.rows.length===1 && __EN.RK.secs===30"))
        await pg.click('#rkMode button[data-m="120"]'); await pg.wait_for_function("__EN.RK.secs===120 && !document.querySelector('#rankBox p')",timeout=15000)
        ex('120秒のランキングは別（だれもいない）',await pg.evaluate("__EN.RK.rows.length")==0)
        await pg.click('#rankBack'); await pg.wait_for_selector('#result:not([hidden])',timeout=8000)
        # うその記録（個数と強化の記録が合わない）はランキングに出ない
        st=await pg.evaluate("(async()=>{const a=JSON.parse(localStorage.getItem('en_auth'));const r=await fetch('%sb30/all/'+a.uid+'.json?auth='+a.token,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({n:'うそ',k:500,lg:'',st:__EN.RUN.st,v:1,at:{'.sv':'timestamp'}})});return r.status;})()"%DBU)
        print('  うその記録の書きこみ',st,flush=True)
        rows=await pg.evaluate("__EN.loadBoard(30,'all').then(r=>r.map(x=>x.n))")
        ex('うその記録はランキングに出ない','うそ' not in rows)
        # 画像と、もう一度
        await pg.click('#imgBtn'); await pg.wait_for_selector('#imgPrev:not([hidden])',timeout=30000)
        ex('結果の画像が作れる',True)
        await pg.click('#vBack'); await pg.wait_for_selector('#result:not([hidden])',timeout=8000)
        await pg.click('#againBtn'); await pg.wait_for_function("__EN.mode==='count' || __EN.mode==='play'",timeout=8000)
        ex('もう一度で、同じ30秒の組が最初から始まる',await pg.evaluate("(__EN.G.tick===0 || __EN.G.k===0) && __EN.SECS===30"))
        bad=[l for l in logs if l.startswith('ERR') or (l.startswith('error') and 'net::ERR_FAILED' not in l and 'Failed to load resource' not in l)]
        for l in bad[:10]: print('  '+l,flush=True)
        ex('画面にエラーが出ていない',not [l for l in bad if l.startswith('ERR')])
        await b.close()
    print('失敗 %d 件'%fail if fail else 'すべて合格',flush=True)
    sys.exit(1 if fail else 0)
asyncio.run(main())
