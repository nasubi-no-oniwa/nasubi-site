# ゲームそのものを、試し用のデータベース（GitHub の上の Firebase の試し用）につないで通しで遊ぶ試験。本番のデータには触らない
import asyncio, os, re, sys, json
from urllib.parse import urlsplit
from playwright.async_api import async_playwright
ROOT=os.environ.get('GITHUB_WORKSPACE','.')
NS='ft-red-default-rtdb'
fail=0
def ex(name,ok):
    global fail
    print(('OK  ' if ok else 'NG  ')+name,flush=True)
    if not ok: fail+=1
async def route(r):
    u=r.request.url; sp=urlsplit(u)
    if u.startswith('https://nasubi-no-oniwa.github.io/dopagaki-kasegenai/'):
        p=sp.path.split('dopagaki-kasegenai/')[1] or 'index.html'
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
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
        c=await b.new_context(viewport={'width':390,'height':844},locale='ja-JP')
        pg=await c.new_page(); logs=[]
        pg.on('console',lambda m: logs.append(m.type+': '+m.text)); pg.on('pageerror',lambda e: logs.append('ERR '+str(e)))
        await c.route('**/*',route)
        await pg.goto('https://nasubi-no-oniwa.github.io/dopagaki-kasegenai/')
        await pg.wait_for_function("window.__KG && __KG.RUN && __KG.RUN.st>0",timeout=20000)
        ex('はじめに回ができる（1万🍆）',await pg.evaluate("__KG.RUN.h+__KG.RUN.t===0"))
        res=[]
        async def toss():
            await pg.evaluate("__KG.toss()")
            await pg.wait_for_function("__KG.mode==='mv'",timeout=5000)
            await pg.wait_for_function("__KG.mode==='result'",timeout=30000)
            return await pg.evaluate("__KG.RUN.hist[__KG.RUN.hist.length-1]")
        for i in range(6): res.append(await toss()); await pg.wait_for_timeout(300)
        print('  結果：'+''.join('表' if x else '裏' for x in res),flush=True)
        await pg.wait_for_timeout(1500)
        run=await pg.evaluate("__KG.RUN")
        srv=await pg.evaluate("(async()=>{const a=JSON.parse(localStorage.getItem('kg_auth'));const r=await fetch('https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/kasegenai/run/'+a.uid+'.json?auth='+a.token);return r.json();})()")
        print('  手元',json.dumps({k:run[k] for k in ['h','t','ph','pt']}),' サーバー',json.dumps(srv),flush=True)
        ex('6回投げた数がサーバーと同じ',srv and srv['h']==run['h'] and srv['t']==run['t'] and srv['p']==0 and run['h']+run['t']==6)
        ex('表裏の記録が手元と同じ',sum(res)==run['h'])
        # 読みこみ直しても所持金が残る
        await pg.reload(); await pg.wait_for_function("window.__KG && __KG.RUN && __KG.RUN.st>0",timeout=20000); await pg.wait_for_timeout(1500)
        ex('読みこみ直しても所持金が残る',await pg.evaluate("__KG.RUN.h+__KG.RUN.t===6"))
        ex('タイトルにいまの所持金が出る','6' in (await pg.inner_text('#tNow')))
        res.append(await toss()); await pg.wait_for_timeout(1200)
        await pg.click('#recBtn'); await pg.fill('#nameIn','テスト'); await pg.click('#recGo')
        await pg.wait_for_selector('#secFin:not([hidden])',timeout=20000); await pg.wait_for_timeout(2500)
        msg=await pg.inner_text('#sendMsg'); stat=await pg.inner_text('#fStat')
        print('  '+msg.replace('\n',' ')+' / '+stat.replace('\n',' '),flush=True)
        ex('記録してランキングに載る',('1位' in msg))
        ex('みんなの平均と真ん中が出る',('平均' in stat and '真ん中' in stat))
        ex('記録したら1万🍆から始まる',await pg.evaluate("__KG.RUN.h+__KG.RUN.t===0"))
        await pg.click('#fRank'); await pg.wait_for_timeout(2000); rk=await pg.inner_text('#rankBox')
        ex('ランキングに名前が出る','テスト' in rk)
        post=await pg.evaluate("(()=>{let u='';const o=window.open;window.open=x=>{u=x;return {}};document.getElementById('rankBack').click();document.getElementById('xBtn').click();window.open=o;return decodeURIComponent(u);})()")
        print('  '+post.replace('\n',' ')[:200],flush=True)
        ex('Xの文に 10,000🍆が7回で が入る','10,000🍆が7回で' in post and '#ブラウザゲーム' in post)
        errs=[l for l in logs if l.startswith('ERR')]
        for l in errs: print(l)
        ex('ページのエラーがない',not errs)
        await c.unroute_all(behavior='ignoreErrors'); await b.close()
asyncio.run(main())
print('すべて合格' if not fail else '失敗 '+str(fail)+' 件'); sys.exit(1 if fail else 0)
