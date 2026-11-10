var Mt=Object.defineProperty;var Wt=(e,t,r)=>t in e?Mt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var m=(e,t,r)=>Wt(e,typeof t!="symbol"?t+"":t,r);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))l(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&l(n)}).observe(document,{childList:!0,subtree:!0});function r(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function l(o){if(o.ep)return;o.ep=!0;const s=r(o);fetch(o.href,s)}})();function a(e,t={},...r){const l=document.createElement(e);for(const[o,s]of Object.entries(t))o==="class"?l.className=s:l.setAttribute(o,s);for(const o of r)l.append(typeof o=="string"?document.createTextNode(o):o);return l}function Lt(e){for(;e.firstChild;)e.removeChild(e.firstChild)}let Me;function K(e,t="info"){let r=document.querySelector(".toast-stack");r||(r=a("div",{class:"toast-stack",role:"status","aria-live":"polite"}),document.body.append(r));const l=a("div",{class:`toast toast-${t}`},e);r.append(l),window.setTimeout(()=>l.classList.add("toast-show"),10),window.clearTimeout(Me),Me=window.setTimeout(()=>{l.classList.remove("toast-show"),window.setTimeout(()=>l.remove(),250)},3400)}async function We(e){try{return await navigator.clipboard.writeText(e),!0}catch{try{const t=a("textarea",{class:"visually-hidden"});t.value=e,document.body.append(t),t.select();const r=document.execCommand("copy");return t.remove(),r}catch{return!1}}}async function Ot(e){if(typeof navigator.share=="function")try{return await navigator.share(e),!0}catch{return!1}return!1}var ke={},Z={},Le;function ct(){if(Le)return Z;Le=1,Object.defineProperty(Z,"__esModule",{value:!0}),Z.LocalStorage=void 0;class e{async get(r){return typeof window>"u"?null:localStorage.getItem(r)}async set(r,l){typeof window>"u"||localStorage.setItem(r,l)}async remove(r){typeof window>"u"||localStorage.removeItem(r)}}return Z.LocalStorage=e,Z}var Q={},ee={},he={},Oe;function Rt(){if(Oe)return he;Oe=1,Object.defineProperty(he,"__esModule",{value:!0}),he.encodeBase58=t;const e="123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";function t(r){if(r.length===0)return"";let l=0,o=0;for(;o<r.length&&r[o]===0;)l++,o++;let s=[0];for(;o<r.length;o++){let i=r[o];for(let h=0;h<s.length;++h)i+=s[h]<<8,s[h]=i%58,i=i/58|0;for(;i>0;)s.push(i%58),i=i/58|0}for(;s.length>0&&s[s.length-1]===0;)s.pop();let n="";for(let i=0;i<l;i++)n+=e[0];for(let i=s.length-1;i>=0;--i)n+=e[s[i]];return n}return he}var Re;function me(){if(Re)return ee;Re=1,Object.defineProperty(ee,"__esModule",{value:!0}),ee.nearActionsToConnectorActions=void 0;const e=Rt(),t=s=>{try{return JSON.parse(new TextDecoder().decode(s))}catch{return s}},r=s=>s.enum!=null?s.enum==="fullAccess":"fullAccess"in s,l=s=>s.enum!=null?s.enum==="AccountId":"AccountId"in s,o=s=>s.map(n=>{var i;if("type"in n)return n;if(n.signedDelegate)throw new Error("SignedDelegate actions cannot be sent through the wallet connector; wallets sign delegates via signDelegateActions");if(n.functionCall)return{type:"FunctionCall",params:{methodName:n.functionCall.methodName,args:t(n.functionCall.args),gas:n.functionCall.gas.toString(),deposit:n.functionCall.deposit.toString()}};if(n.deployGlobalContract)return{type:"DeployGlobalContract",params:{code:n.deployGlobalContract.code,deployMode:l(n.deployGlobalContract.deployMode)?"AccountId":"CodeHash"}};if(n.createAccount)return{type:"CreateAccount"};if(n.useGlobalContract){const h=n.useGlobalContract.contractIdentifier;return{type:"UseGlobalContract",params:{contractIdentifier:h.AccountId!=null?{accountId:h.AccountId}:{codeHash:(0,e.encodeBase58)(h.CodeHash)}}}}if(n.deployContract)return{type:"DeployContract",params:{code:n.deployContract.code}};if(n.deleteAccount)return{type:"DeleteAccount",params:{beneficiaryId:n.deleteAccount.beneficiaryId}};if(n.deleteKey)return{type:"DeleteKey",params:{publicKey:n.deleteKey.publicKey.toString()}};if(n.transfer)return{type:"Transfer",params:{deposit:n.transfer.deposit.toString()}};if(n.stake)return{type:"Stake",params:{stake:n.stake.stake.toString(),publicKey:n.stake.publicKey.toString()}};if(n.addKey){const{permission:h}=n.addKey.accessKey;let u;if(h.functionCall)u={receiverId:h.functionCall.receiverId,allowance:(i=h.functionCall.allowance)==null?void 0:i.toString(),methodNames:h.functionCall.methodNames};else if(r(h))u="FullAccess";else throw new Error("Unsupported access-key permission on AddKey: only functionCall and fullAccess can be sent through the wallet connector (pass a ConnectorAction otherwise)");return{type:"AddKey",params:{publicKey:n.addKey.publicKey.toString(),accessKey:{nonce:Number(n.addKey.accessKey.nonce),permission:u}}}}throw new Error("Unsupported action type")});return ee.nearActionsToConnectorActions=o,ee}var xe={},je;function ye(){return je||(je=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.isGasKeyAction=void 0,e.assertGasKeyActionsSupported=r;const t=l=>l.type==="TransferToGasKey"||l.type==="WithdrawFromGasKey"||l.type==="AddKey"&&l.params.gasKeyInfo!=null;e.isGasKeyAction=t;function r(l,o,s){if(l!=null&&l.gasKeys)return;const n=o.filter(e.isGasKeyAction).map(i=>i.type);if(n.length!==0)throw new Error(`${s} does not advertise gas-key support (manifest features.gasKeys), so ${[...new Set(n)].join(", ")} cannot be sent through it; a wallet that does not know gasKeyInfo could add a plain key instead. Sign locally with a full-access key, or use a wallet whose manifest sets features.gasKeys.`)}})(xe)),xe}var te={},qe;function Ie(){if(qe)return te;qe=1,Object.defineProperty(te,"__esModule",{value:!0}),te.uuid4=void 0;const e=()=>typeof window<"u"&&typeof window.crypto<"u"&&typeof window.crypto.randomUUID=="function"?window.crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){const r=Math.random()*16|0;return(t==="x"?r:r&3|8).toString(16)});return te.uuid4=e,te}var Ke;function dt(){if(Ke)return Q;Ke=1,Object.defineProperty(Q,"__esModule",{value:!0}),Q.ParentFrameWallet=void 0;const e=me(),t=ye(),r=Ie();let l=class{constructor(s,n){m(this,"connector");m(this,"manifest");this.connector=s,this.manifest=n}callParentFrame(s,n){const i=(0,r.uuid4)();return window.parent.postMessage({type:"near-wallet-injected-request",id:i,method:s,params:n},"*"),new Promise((h,u)=>{const p=g=>{g.data.type==="near-wallet-injected-response"&&g.data.id===i&&(window.removeEventListener("message",p),g.data.success?h(g.data.result):u(g.data.error))};window.addEventListener("message",p)})}async signIn(s){const n=await this.callParentFrame("near:signIn",{network:(s==null?void 0:s.network)??this.connector.network,addFunctionCallKey:s==null?void 0:s.addFunctionCallKey});return Array.isArray(n)?n:[n]}async signInAndSignMessage(s){const n=await this.callParentFrame("near:signInAndSignMessage",{network:(s==null?void 0:s.network)??this.connector.network,addFunctionCallKey:s==null?void 0:s.addFunctionCallKey,messageParams:s.messageParams});return Array.isArray(n)?n:[n]}async signOut(s){const n={...s,network:(s==null?void 0:s.network)??this.connector.network};await this.callParentFrame("near:signOut",n)}async getAccounts(s){const n={...s,network:(s==null?void 0:s.network)??this.connector.network};return this.callParentFrame("near:getAccounts",n)}async signAndSendTransaction(s){const n=(0,e.nearActionsToConnectorActions)(s.actions);(0,t.assertGasKeyActionsSupported)(this.manifest.features,n,this.manifest.name);const i={...s,actions:n,network:s.network??this.connector.network};return this.callParentFrame("near:signAndSendTransaction",i)}async signAndSendTransactions(s){const n=s.transactions.map(h=>({actions:(0,e.nearActionsToConnectorActions)(h.actions),receiverId:h.receiverId}));(0,t.assertGasKeyActionsSupported)(this.manifest.features,n.flatMap(h=>h.actions),this.manifest.name);const i={...s,transactions:n,network:s.network??this.connector.network};return this.callParentFrame("near:signAndSendTransactions",i)}async signMessage(s){const n={...s,network:s.network??this.connector.network};return this.callParentFrame("near:signMessage",n)}async signDelegateActions(s){const n={...s,delegateActions:s.delegateActions.map(i=>({...i,actions:(0,e.nearActionsToConnectorActions)(i.actions)})),network:s.network||this.connector.network};return(0,t.assertGasKeyActionsSupported)(this.manifest.features,n.delegateActions.flatMap(i=>i.actions),this.manifest.name),this.callParentFrame("near:signDelegateActions",n)}};return Q.ParentFrameWallet=l,Q}var B={},z={},ne={},Be;function ut(){if(Be)return ne;Be=1,Object.defineProperty(ne,"__esModule",{value:!0}),ne.parseUrl=void 0;const e=t=>{try{return new URL(t)}catch{return null}};return ne.parseUrl=e,ne}var re={},De;function jt(){if(De)return re;De=1,Object.defineProperty(re,"__esModule",{value:!0}),re.copyText=void 0;const e=async t=>{try{await navigator.clipboard.writeText(t);return}catch{}const r=document.createElement("textarea");r.value=t,r.setAttribute("readonly",""),r.style.position="fixed",r.style.opacity="0",document.body.appendChild(r),r.select();try{if(!document.execCommand("copy"))throw new Error("Copy failed")}finally{r.remove()}};return re.copyText=e,re}var q={},Fe;function qt(){if(Fe)return q;Fe=1,Object.defineProperty(q,"__esModule",{value:!0}),q.openExternalLink=q.openTelegramLink=q.isTelegramMiniApp=void 0;const e=()=>{var i;const n=(i=window==null?void 0:window.Telegram)==null?void 0:i.WebApp;return!n||!n.platform||n.platform==="unknown"?null:n},t=()=>{try{return location.hash.includes("tgWebAppData")?!0:!!sessionStorage.getItem("__telegram__initParams")}catch{return!1}},r=()=>typeof window>"u"?!1:!!e()||!!window.TelegramWebviewProxy||t();q.isTelegramMiniApp=r;const l=(n,i)=>{const h=window.TelegramWebviewProxy;if(h!=null&&h.postEvent)return h.postEvent(n,JSON.stringify(i));const u=window.external;if(u&&"notify"in u)return u.notify(JSON.stringify({eventType:n,eventData:i}));window.parent!==window&&window.parent.postMessage(JSON.stringify({eventType:n,eventData:i}),"https://web.telegram.org")},o=n=>{const i=e();if(i)return i.openTelegramLink(n.toString());l("web_app_open_tg_link",{path_full:n.pathname+n.search})};q.openTelegramLink=o;const s=n=>{const i=e();if(i)return i.openLink(n.toString());l("web_app_open_link",{url:n.toString()})};return q.openExternalLink=s,q}var H={},se={},Ue;function ht(){if(Ue)return se;Ue=1,Object.defineProperty(se,"__esModule",{value:!0}),se.EventEmitter=void 0;class e{constructor(){m(this,"events",{})}on(r,l){this.events[r]||(this.events[r]=[]),this.events[r].push(l)}emit(r,l){var o;(o=this.events[r])==null||o.forEach(s=>s(l))}off(r,l){var o;this.events[r]=(o=this.events[r])==null?void 0:o.filter(s=>s!==l)}once(r,l){const o=s=>{l(s),this.off(r,o)};this.on(r,o)}removeAllListeners(r){r?delete this.events[r]:this.events={}}}return se.EventEmitter=e,se}var oe={},ae={},Ye;function Pe(){if(Ye)return ae;Ye=1,Object.defineProperty(ae,"__esModule",{value:!0}),ae.escapeHtml=e,ae.html=r;function e(l){return l.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}const t=Symbol("htmlTag");function r(l,...o){let s=l[0];for(let n=0;n<o.length;n++){for(const i of Array.isArray(o[n])?o[n]:[o[n]]){const h=i!=null&&i[t]?i[t]:e(String(i??""));s+=h}s+=l[n+1]}return Object.freeze({[t]:s,get html(){return s}})}return ae}var ie={},le={},ze;function Kt(){if(ze)return le;ze=1,Object.defineProperty(le,"__esModule",{value:!0}),le.css=void 0;const e=t=>`
${t} * {
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  -ms-overflow-style: none; 
  scrollbar-width: none; 
  color: #fff;
}

${t} *::-webkit-scrollbar { 
  display: none;
}

${t} p,
${t} h1,
${t} h2,
${t} h3,
${t} h4,
${t} h5,
${t} h6 {
  margin: 0;
}

${t} .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100000000;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: opacity 0.2s ease-in-out;
}

@media (max-width: 600px) {
  ${t} .modal-container {
    justify-content: flex-end;
  }
}

${t} .modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;

  max-width: 420px;
  max-height: 615px;
  width: 100%;
  border-radius: 24px;
  background: #0d0d0d;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease-in-out;
}

@media (max-width: 600px) {
  ${t} .modal-content {
    max-width: 100%;
    width: 100%;
    max-height: 80%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border: none;
    border-top: 1.5px solid rgba(255, 255, 255, 0.1);
  }
}


${t} .modal-header {
  display: flex;
  padding: 16px;
  gap: 16px;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  position: relative;
}

${t} .modal-header button {
  position: absolute;
  right: 16px;
  top: 16px;
  width: 32px;
  height: 32px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

${t} .modal-header button:hover {
  background: rgba(255, 255, 255, 0.04);
}
  
${t} .modal-header p {
  color: #fff;
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}


${t} .modal-body {
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  gap: 8px;
  overflow: auto;

  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08);
  width: 100%;
  flex: 1;
}

${t} .modal-body textarea {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background: #0d0d0d;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  outline: none;
  font-size: 16px;
  transition: background 0.2s ease-in-out;
  font-family: monospace;
  font-size: 12px;
}

${t} .modal-body button {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background: #fff;
  color: #000;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s ease-in-out;
  margin-top: 16px;
}

${t} .footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 24px;
  color: #fff;
  gap: 12px;
}

${t} .modal-body p {
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.8px;
}

${t} .footer img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

${t} .get-wallet-link {
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  margin-left: auto;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  cursor: pointer;
}
  
${t} .get-wallet-link:hover {
  color: rgba(255, 255, 255, 1);
}


${t} .connect-item {
  display: flex;
  padding: 8px;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  cursor: pointer;

  transition: background 0.2s ease-in-out;
  border-radius: 24px;
}

${t} .connect-item img {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  object-fit: cover;
  flex-shrink: 0;
}

${t} .connect-item-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  text-align: left;
  flex: 1;
  margin-top: -2px;
}

${t} .connect-item-info .wallet-address {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

${t} .connect-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

${t} .connect-item img {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  object-fit: cover;
}

${t} .connect-item p {
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.36px;
  margin: 0;
}
`;return le.css=e,le}var He;function pt(){if(He)return ie;He=1,Object.defineProperty(ie,"__esModule",{value:!0}),ie.Popup=void 0;const e=Kt(),t=Pe(),r=`n${Math.random().toString(36).substring(2,15)}`;if(typeof document<"u"){const o=document.createElement("style");o.textContent=(0,e.css)(`.${r}`),document.head.append(o)}let l=class{constructor(s){m(this,"delegate");m(this,"isClosed",!1);m(this,"root",document.createElement("div"));m(this,"state",{});m(this,"disposables",[]);this.delegate=s}get dom(){return(0,t.html)``}addListener(s,n,i){const h=typeof s=="string"?this.root.querySelector(s):s;h&&(h.addEventListener(n,i),this.disposables.push(()=>h.removeEventListener(n,i)))}handlers(){this.disposables.forEach(h=>h()),this.disposables=[];const s=this.root.querySelector(".modal-container"),n=this.root.querySelector(".modal-content");n.onclick=h=>h.stopPropagation(),s.onclick=()=>{this.delegate.onReject(),this.destroy()};const i=h=>{h.key==="Escape"&&(this.delegate.onReject(),this.destroy())};document.addEventListener("keydown",i),this.disposables.push(()=>document.removeEventListener("keydown",i))}update(s){this.state={...this.state,...s},this.root.innerHTML=this.dom.html,this.handlers()}create({show:s=!0}){this.root.className=`${r} hot-connector-popup`,this.root.style.display="none",this.root.innerHTML=this.dom.html,document.body.append(this.root),this.handlers();const n=this.root.querySelector(".modal-container"),i=this.root.querySelector(".modal-content");i.style.transform="translateY(50px)",n.style.opacity="0",s&&setTimeout(()=>this.show(),10)}show(){const s=this.root.querySelector(".modal-container"),n=this.root.querySelector(".modal-content");n.style.transform="translateY(50px)",s.style.opacity="0",this.root.style.display="block",setTimeout(()=>{n.style.transform="translateY(0)",s.style.opacity="1"},100)}hide(){const s=this.root.querySelector(".modal-container"),n=this.root.querySelector(".modal-content");n.style.transform="translateY(50px)",s.style.opacity="0",setTimeout(()=>{this.root.style.display="none"},200)}destroy(){this.isClosed||(this.isClosed=!0,this.disposables.forEach(s=>s()),this.disposables=[],this.hide(),setTimeout(()=>{this.root.remove()},200))}};return ie.Popup=l,ie}var Ge;function Bt(){if(Ge)return oe;Ge=1,Object.defineProperty(oe,"__esModule",{value:!0}),oe.IframeWalletPopup=void 0;const e=Pe(),t=pt();let r=class extends t.Popup{constructor(s){super(s);m(this,"delegate");this.delegate=s}handlers(){super.handlers(),this.addListener("button","click",()=>this.delegate.onApprove())}create(){super.create({show:!1}),this.root.querySelector(".modal-body").appendChild(this.delegate.iframe),this.delegate.iframe.style.width="100%",this.delegate.iframe.style.height="720px",this.delegate.iframe.style.border="none"}get footer(){if(!this.delegate.footer)return"";const{icon:s,heading:n}=this.delegate.footer;return(0,e.html)`
      <div class="footer">
        ${s?(0,e.html)`<img src="${s}" alt="${n}" />`:""}
        <p>${n}</p>
      </div>
    `}get dom(){return(0,e.html)`<div class="modal-container">
      <div class="modal-content">
        <div class="modal-body" style="padding: 0; overflow: auto;"></div>
        ${this.footer}
      </div>
    </div>`}};return oe.IframeWalletPopup=r,oe}var pe={},ce={},Ve;function Dt(){return Ve||(Ve=1,Object.defineProperty(ce,"__esModule",{value:!0}),ce.NEAR_CONNECT_VERSION=void 0,ce.NEAR_CONNECT_VERSION="0.12.0"),ce}var Je;function Ft(){if(Je)return pe;Je=1,Object.defineProperty(pe,"__esModule",{value:!0});const e=Dt();async function t(r){const l=await r.executor.getAllStorage(),o=r.executor.connector.providers,s=r.executor.manifest,n=r.id,i=r.code.replaceAll(".localStorage",".sandboxedLocalStorage").replaceAll("window.top","window.selector").replaceAll("window.open","window.selector.open"),h=r.cspNonce?` nonce="${r.cspNonce.replace(/[^A-Za-z0-9+/=]/g,"")}"`:"";return`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <div id="root"></div>

      <style>
        :root {
          --background-color: rgb(40, 40, 40);
          --text-color: rgb(255, 255, 255);
          --border-color: rgb(209, 209, 209);
        }

        * {
          font-family: system-ui, Avenir, Helvetica, Arial, sans-serif
        }

        body, html {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          background-color: var(--background-color);
          color: var(--text-color);
        }

        #root {
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
          background: radial-gradient(circle at center, #2c2c2c 0%, #1a1a1a 100%);
          text-align: center;
        }

        #root * {
          box-sizing: border-box;
          font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
          line-height: 1.5;
          color-scheme: light dark;
          color: rgb(255, 255, 255);
          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }

        .prompt-container img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 12px;
        }

        .prompt-container h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          margin-top: 16px;
        }

        .prompt-container p {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          color: rgb(209, 209, 209);
        }

        .prompt-container button {
          background-color: #131313;
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          cursor: pointer;
          transition: border-color 0.25s;
          color: #fff;
          outline: none;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          margin-top: 16px;
        }
      </style>


      <script${h}>
      window.sandboxedLocalStorage = (() => {
        let storage = ${JSON.stringify(l)}

        return {
          setItem: function(key, value) {
            window.selector.storage.set(key, value)
            storage[key] = value || '';
          },
          getItem: function(key) {
            return key in storage ? storage[key] : null;
          },
          removeItem: function(key) {
            window.selector.storage.remove(key)
            delete storage[key];
          },
          get length() {
            return Object.keys(storage).length;
          },
          key: function(i) {
            const keys = Object.keys(storage);
            return keys[i] || null;
          },
        };
      })();

      const showPrompt = async (args) => {
        const root = document.getElementById("root");   
        root.style.display = "flex";
        root.innerHTML = \`
          <div class="prompt-container">
            <img src="${s.icon}" />
            <h1>${s.name}</h1>
            <p>\${args.title}</p>
            <button>\${args.button}</button>
          </div>
        \`;

        return new Promise((resolve) => {
          root.querySelector("button")?.addEventListener("click", () => {
            root.innerHTML = "";
            resolve(true);
          });
        });
      }

      class ProxyWindow {
        constructor(url, features) {
          this.closed = false;
          this.windowIdPromise = window.selector.call("open", { url, features });

          window.addEventListener("message", async (event) => {            
            if (event.data.origin !== "${n}") return;
            if (!event.data.method?.startsWith("proxy-window:")) return;
            const method = event.data.method.replace("proxy-window:", "");
            if (method === "closed" && event.data.windowId === await this.id()) this.closed = true;
          });
        } 

        async id() {
          return await this.windowIdPromise;
        }

        async focus() {
          await window.selector.call("panel.focus", { windowId: await this.id() });
        }

        async postMessage(data) {
          window.selector.call("panel.postMessage", { windowId: await this.id(), data });
        }

        async close() {
          await window.selector.call("panel.close", { windowId: await this.id() });
        }
      }

      window.selector = {
        wallet: null,
        location: "${window.location.href}",
        nearConnectVersion: "${e.NEAR_CONNECT_VERSION}",
        
        outerHeight: ${window.outerHeight},
        screenY: ${window.screenY},
        outerWidth: ${window.outerWidth},
        screenX: ${window.screenX},

        providers: {
          mainnet: ${JSON.stringify(o.mainnet)},
          testnet: ${JSON.stringify(o.testnet)},
        },

        uuid() {
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
        },

        walletConnect: {
          connect(params) {
            return window.selector.call("walletConnect.connect", params);
          },
          disconnect(params) {
            return window.selector.call("walletConnect.disconnect", params);
          },
          request(params) {
            return window.selector.call("walletConnect.request", params);
          },
          getProjectId() {
            return window.selector.call("walletConnect.getProjectId", {});
          },
          getSession() {
            return window.selector.call("walletConnect.getSession", {});
          },
        },
      
        async ready(wallet) {
          wallet.manifest = ${JSON.stringify(s)};
          window.parent.postMessage({ method: "wallet-ready", origin: "${n}" }, "*");
          window.selector.wallet = wallet;
        },

        async call(method, params) {
          const id = window.selector.uuid();
          window.parent.postMessage({ method, params, id, origin: "${n}" }, "*");

          return new Promise((resolve, reject) => {
            const handler = (event) => {
              if (event.data.id !== id || event.data.origin !== "${n}") return;
              window.removeEventListener("message", handler);

              if (event.data.status === "failed") reject(event.data.result);
              else resolve(event.data.result);
            };

            window.addEventListener("message", handler);
          });
        },

        panelClosed(windowId) {
          window.parent.postMessage({ 
            method: "panel.closed", 
            origin: "${n}", 
            result: { windowId } 
          }, "*");
        },

        open(url, _, params) {
          return new ProxyWindow(url, params)
        },

        external(entity, key, ...args) {
          return window.selector.call("external", { entity, key, args: args || [] });
        },

        openNativeApp(url) {
          return window.selector.call("open.nativeApp", { url });
        },

        ui: {
          async whenApprove(options) {
            window.selector.ui.showIframe();
            await showPrompt(options);
            window.selector.ui.hideIframe();
          },

          async showIframe() {
            return await window.selector.call("ui.showIframe");
          },

          async hideIframe() {
            return await window.selector.call("ui.hideIframe");
          },
        },

        storage: {
          async set(key, value) {
            await window.selector.call("storage.set", { key, value });
          },
      
          async get(key) {
            return await window.selector.call("storage.get", { key });
          },
      
          async remove(key) {
            await window.selector.call("storage.remove", { key });
          },

          async keys() {
            return await window.selector.call("storage.keys", {});
          },
        },
      };

      // Clipboard API often rejects inside the sandbox (Android WebView), copy through the dApp page then.
      // Plain assignment to navigator.clipboard is a no-op (getter on the prototype), so redefine the method
      const clipboard = navigator.clipboard || {};
      const nativeWriteText = clipboard.writeText ? clipboard.writeText.bind(clipboard) : null;
      Object.defineProperty(clipboard, "writeText", {
        configurable: true,
        value: async (text) => {
          try {
            if (nativeWriteText) return await nativeWriteText(text);
          } catch {}
          await window.selector.call("clipboard.writeText", { text });
        },
      });
      if (!navigator.clipboard) Object.defineProperty(navigator, "clipboard", { configurable: true, value: clipboard });

      window.addEventListener("message", async (event) => {
        if (event.data.origin !== "${n}") return;
        if (!event.data.method?.startsWith("wallet:")) return;
      
        const wallet = window.selector.wallet;
        const method = event.data.method.replace("wallet:", "");
        const payload = { id: event.data.id, origin: "${n}", method };
      
        if (wallet == null || typeof wallet[method] !== "function") {
          const data = { ...payload, status: "failed", result: "Method not found" };
          window.parent.postMessage(data, "*");
          return;
        }
        
        try {
          const result = await wallet[method](event.data.params);
          window.parent.postMessage({ ...payload, status: "success", result }, "*");
        } catch (error) {
          const data = { ...payload, status: "failed", result: error };
          window.parent.postMessage(data, "*");
        }
      });
      <\/script>

      <script type="module"${h}>${i}<\/script>
    </body>
  </html>
    `}return pe.default=t,pe}var Xe;function Ut(){if(Xe)return H;Xe=1;var e=H&&H.__importDefault||function(n){return n&&n.__esModule?n:{default:n}};Object.defineProperty(H,"__esModule",{value:!0});const t=ht(),r=Ie(),l=Bt(),o=e(Ft());class s{constructor(i,h,u,p){m(this,"executor");m(this,"origin");m(this,"disposed",!1);m(this,"iframe",document.createElement("iframe"));m(this,"events",new t.EventEmitter);m(this,"popup");m(this,"handler");m(this,"readyPromiseResolve");m(this,"readyPromise",new Promise(i=>{this.readyPromiseResolve=i}));this.executor=i,this.origin=(0,r.uuid4)(),this.handler=c=>{c.data.origin===this.origin&&(c.data.method==="wallet-ready"&&this.readyPromiseResolve(),u(this,c))},window.addEventListener("message",this.handler);const g=[];this.executor.checkPermissions("usb")&&g.push("usb *;"),this.executor.checkPermissions("hid")&&g.push("hid *;"),this.executor.checkPermissions("clipboardRead")&&g.push("clipboard-read;"),this.executor.checkPermissions("clipboardWrite")&&g.push("clipboard-write;"),this.executor.checkPermissions("bluetooth")&&g.push("bluetooth *;"),this.iframe.allow=g.join(" "),this.iframe.setAttribute("sandbox","allow-scripts"),(0,o.default)({id:this.origin,executor:this.executor,code:h,cspNonce:p}).then(c=>{var d;(d=this.executor.connector.logger)==null||d.log("Iframe code injected"),this.iframe.srcdoc=c}),this.popup=new l.IframeWalletPopup({footer:this.executor.connector.footerBranding,iframe:this.iframe,onApprove:()=>{},onReject:()=>{this.disposed=!0,window.removeEventListener("message",this.handler),this.events.emit("close",{}),this.popup.destroy()}}),this.popup.create()}on(i,h){this.events.on(i,h)}show(){this.popup.show()}hide(){this.popup.hide()}postMessage(i){if(this.disposed)return;const h=this.iframe.contentWindow;if(!h)throw new Error(`Iframe not loaded for ${(i==null?void 0:i.method)??"unknown method"}`);h.postMessage({...i,origin:this.origin},"*")}dispose(){this.disposed=!0,window.removeEventListener("message",this.handler),this.popup.destroy()}}return H.default=s,H}var Ze;function Yt(){if(Ze)return z;Ze=1;var e=z&&z.__importDefault||function(h){return h&&h.__esModule?h:{default:h}};Object.defineProperty(z,"__esModule",{value:!0});const t=ut(),r=Ie(),l=jt(),o=qt(),s=e(Ut()),n=(0,r.uuid4)();class i{constructor(u,p){m(this,"connector");m(this,"manifest");m(this,"activePanels",{});m(this,"storageSpace");m(this,"_onMessage",async(u,p)=>{const g=d=>{u.postMessage({...p.data,status:"success",result:d})},c=d=>{u.postMessage({...p.data,status:"failed",result:d})};if(p.data.method==="ui.showIframe"){u.show(),g(null);return}if(p.data.method==="ui.hideIframe"){u.hide(),g(null);return}if(p.data.method==="storage.set"){this.assertPermissions(u,"storage",p),localStorage.setItem(`${this.storageSpace}:${p.data.params.key}`,p.data.params.value),g(null);return}if(p.data.method==="storage.get"){this.assertPermissions(u,"storage",p);const d=localStorage.getItem(`${this.storageSpace}:${p.data.params.key}`);g(d);return}if(p.data.method==="storage.keys"){this.assertPermissions(u,"storage",p);const d=Object.keys(localStorage).filter(f=>f.startsWith(`${this.storageSpace}:`));g(d);return}if(p.data.method==="storage.remove"){this.assertPermissions(u,"storage",p),localStorage.removeItem(`${this.storageSpace}:${p.data.params.key}`),g(null);return}if(p.data.method==="panel.focus"){const d=this.activePanels[p.data.params.windowId];d&&d.focus(),g(null);return}if(p.data.method==="panel.postMessage"){const d=this.activePanels[p.data.params.windowId];d&&d.postMessage(p.data.params.data,"*"),g(null);return}if(p.data.method==="panel.close"){const d=this.activePanels[p.data.params.windowId];d&&d.close(),delete this.activePanels[p.data.params.windowId],g(null);return}if(p.data.method==="walletConnect.connect"){this.assertPermissions(u,"walletConnect",p);try{if(!this.connector.walletConnect)throw new Error("WalletConnect is not configured");const f=await(await this.connector.walletConnect).connect(p.data.params);f.approval(),g({uri:f.uri})}catch(d){c(d)}return}if(p.data.method==="walletConnect.getProjectId"){if(!this.connector.walletConnect)throw new Error("WalletConnect is not configured");this.assertPermissions(u,"walletConnect",p);const d=await this.connector.walletConnect;g(d.core.projectId);return}if(p.data.method==="walletConnect.disconnect"){this.assertPermissions(u,"walletConnect",p);try{if(!this.connector.walletConnect)throw new Error("WalletConnect is not configured");const f=await(await this.connector.walletConnect).disconnect(p.data.params);g(f)}catch(d){c(d)}return}if(p.data.method==="walletConnect.getSession"){this.assertPermissions(u,"walletConnect",p);try{if(!this.connector.walletConnect)throw new Error("WalletConnect is not configured");const d=await this.connector.walletConnect,f=d.session.keys[d.session.keys.length-1],w=f?d.session.get(f):null;g(w?{topic:w.topic,namespaces:w.namespaces}:null)}catch(d){c(d)}return}if(p.data.method==="walletConnect.request"){this.assertPermissions(u,"walletConnect",p);try{if(!this.connector.walletConnect)throw new Error("WalletConnect is not configured");const f=await(await this.connector.walletConnect).request(p.data.params);g(f)}catch(d){c(d)}return}if(p.data.method==="clipboard.writeText"){this.assertPermissions(u,"clipboardWrite",p);try{await(0,l.copyText)(p.data.params.text),g(null)}catch(d){c(d)}return}if(p.data.method==="external"){this.assertPermissions(u,"external",p);try{const{entity:d,key:f,args:w}=p.data.params,y=d.split(".").reduce((A,$)=>A[$],window);d==="nightly.near"&&f==="signTransaction"&&(w[0].encode=()=>w[0]);const x=typeof y[f]=="function"?await y[f](...w||[]):y[f];g(x)}catch(d){c(d)}return}if(p.data.method==="open"){this.assertPermissions(u,"allowsOpen",p);const d=(0,t.parseUrl)(p.data.params.url);if(d&&d.protocol==="https:"&&(0,o.isTelegramMiniApp)()){d.hostname==="t.me"?(0,o.openTelegramLink)(d):(0,o.openExternalLink)(d),g(null);return}const f=window.open(p.data.params.url,"_blank",p.data.params.features),w=f?(0,r.uuid4)():null,y=x=>{const A=(0,t.parseUrl)(p.data.params.url);A&&A.origin===x.origin&&u.postMessage(x.data)};if(g(w),window.addEventListener("message",y),f&&w){this.activePanels[w]=f;const x=setInterval(()=>{if(!(f!=null&&f.closed))return;window.removeEventListener("message",y);const A={method:"proxy-window:closed",windowId:w};delete this.activePanels[w],clearInterval(x);try{u.postMessage(A)}catch{}},500)}return}if(p.data.method==="open.nativeApp"){this.assertPermissions(u,"allowsOpen",p);const d=(0,t.parseUrl)(p.data.params.url);if(!d||["https","http","javascript:","file:","data:","blob:","about:"].includes(d.protocol))throw c("Invalid URL"),new Error("[open.nativeApp] Invalid URL");const w=document.createElement("iframe");w.src=p.data.params.url,w.style.display="none",document.body.appendChild(w),u.postMessage({...p.data,status:"success",result:null});return}});m(this,"actualCode",null);this.connector=u,this.manifest=p,this.storageSpace=p.id}checkPermissions(u,p){if(u==="walletConnect")return!!this.manifest.permissions.walletConnect;if(u==="external"){const g=this.manifest.permissions.external;return!g||!(p!=null&&p.entity)?!1:g.includes(p.entity)}if(u==="allowsOpen"){const g=(0,t.parseUrl)((p==null?void 0:p.url)||""),c=this.manifest.permissions.allowsOpen;return!g||!c||!Array.isArray(c)||c.length===0?!1:c.some(f=>{const w=(0,t.parseUrl)(f);return!(!w||g.protocol!==w.protocol||w.hostname&&g.hostname!==w.hostname||w.pathname&&w.pathname!=="/"&&g.pathname!==w.pathname)})}return this.manifest.permissions[u]}assertPermissions(u,p,g){if(!this.checkPermissions(p,g.data.params))throw u.postMessage({...g.data,status:"failed",result:"Permission denied"}),new Error("Permission denied")}async checkNewVersion(u,p){var d,f,w;if(this.actualCode)return(d=this.connector.logger)==null||d.log("New version of code already checked"),this.actualCode;let g=(0,t.parseUrl)(u.manifest.executor);if(g||(g=(0,t.parseUrl)(location.origin+u.manifest.executor)),!g)throw new Error("Invalid executor URL");g.searchParams.set("nonce",n);const c=await fetch(g.toString()).then(y=>{if(!y.ok)throw new Error(`Failed to load executor: ${y.status}`);return y.text()});return(f=this.connector.logger)==null||f.log("New version of code fetched"),this.actualCode=c,c===p?((w=this.connector.logger)==null||w.log("New version of code is the same as the current version"),this.actualCode):(await this.connector.db.setItem(`${this.manifest.id}:${this.manifest.version}`,c).then(()=>{var y;return(y=this.connector.logger)==null?void 0:y.log("New version of code saved to cache")}).catch(y=>{var x;return(x=this.connector.logger)==null?void 0:x.log("Failed to cache new version of code",y)}),c)}async loadCode(){var g;const u=await this.connector.db.getItem(`${this.manifest.id}:${this.manifest.version}`).catch(()=>null);(g=this.connector.logger)==null||g.log("Code loaded from cache",u!==null);const p=this.checkNewVersion(this,u);return u||await p}async call(u,p){var f,w,y,x,A;(f=this.connector.logger)==null||f.log("Add to queue",u,p),(w=this.connector.logger)==null||w.log("Calling method",u,p);const g=await this.loadCode();(y=this.connector.logger)==null||y.log("Code loaded, preparing");const c=new s.default(this,g,this._onMessage,this.connector.cspNonce);(x=this.connector.logger)==null||x.log("Code loaded, iframe initialized"),await c.readyPromise,(A=this.connector.logger)==null||A.log("Iframe ready");const d=(0,r.uuid4)();return new Promise(($,v)=>{var k;try{const S=C=>{var b;C.data.id!==d||C.data.origin!==c.origin||(c.dispose(),window.removeEventListener("message",S),(b=this.connector.logger)==null||b.log("postMessage",{result:C.data,request:{method:u,params:p}}),C.data.status==="failed"?v(C.data.result):$(C.data.result))};window.addEventListener("message",S),c.postMessage({method:u,params:p,id:d}),c.on("close",()=>v(new Error("Wallet closed")))}catch(S){(k=this.connector.logger)==null||k.log("Iframe error",S),v(S)}})}async getAllStorage(){const u=Object.keys(localStorage).filter(g=>g.startsWith(`${this.storageSpace}:`)),p={};for(const g of u)p[g.replace(`${this.storageSpace}:`,"")]=localStorage.getItem(g);return p}async clearStorage(){const u=Object.keys(localStorage).filter(p=>p.startsWith(`${this.storageSpace}:`));for(const p of u)localStorage.removeItem(p)}}return z.default=i,z}var Qe;function ft(){if(Qe)return B;Qe=1;var e=B&&B.__importDefault||function(s){return s&&s.__esModule?s:{default:s}};Object.defineProperty(B,"__esModule",{value:!0}),B.SandboxWallet=void 0;const t=me(),r=ye(),l=e(Yt());class o{constructor(n,i){m(this,"connector");m(this,"manifest");m(this,"executor");this.connector=n,this.manifest=i,this.executor=new l.default(n,i)}async signIn(n){return this.executor.call("wallet:signIn",{network:(n==null?void 0:n.network)??this.connector.network,addFunctionCallKey:n==null?void 0:n.addFunctionCallKey})}async signInAndSignMessage(n){return this.executor.call("wallet:signInAndSignMessage",{network:(n==null?void 0:n.network)??this.connector.network,addFunctionCallKey:n==null?void 0:n.addFunctionCallKey,messageParams:n.messageParams})}async signOut(n){const i={...n,network:(n==null?void 0:n.network)??this.connector.network};await this.executor.call("wallet:signOut",i),await this.executor.clearStorage()}async getAccounts(n){const i={...n,network:(n==null?void 0:n.network)??this.connector.network};return this.executor.call("wallet:getAccounts",i)}async signAndSendTransaction(n){const i=(0,t.nearActionsToConnectorActions)(n.actions);(0,r.assertGasKeyActionsSupported)(this.manifest.features,i,this.manifest.name);const h={...n,actions:i,network:n.network??this.connector.network};return this.executor.call("wallet:signAndSendTransaction",h)}async signAndSendTransactions(n){const i=n.transactions.map(u=>({actions:(0,t.nearActionsToConnectorActions)(u.actions),receiverId:u.receiverId}));(0,r.assertGasKeyActionsSupported)(this.manifest.features,i.flatMap(u=>u.actions),this.manifest.name);const h={...n,transactions:i,network:n.network??this.connector.network};return this.executor.call("wallet:signAndSendTransactions",h)}async signMessage(n){const i={...n,network:n.network??this.connector.network};return this.executor.call("wallet:signMessage",i)}async signDelegateActions(n){const i={...n,delegateActions:n.delegateActions.map(h=>({...h,actions:(0,t.nearActionsToConnectorActions)(h.actions)})),network:n.network??this.connector.network};return(0,r.assertGasKeyActionsSupported)(this.manifest.features,i.delegateActions.flatMap(h=>h.actions),this.manifest.name),this.executor.call("wallet:signDelegateActions",i)}}return B.SandboxWallet=o,B.default=o,B}var de={},et;function gt(){if(et)return de;et=1,Object.defineProperty(de,"__esModule",{value:!0}),de.InjectedWallet=void 0;const e=me(),t=ye();let r=class{constructor(o,s){m(this,"connector");m(this,"wallet");this.connector=o,this.wallet=s}get manifest(){return this.wallet.manifest}async signIn({addFunctionCallKey:o,network:s}){return this.wallet.signIn({network:s??this.connector.network,addFunctionCallKey:o})}async signInAndSignMessage(o){return this.wallet.signInAndSignMessage({network:(o==null?void 0:o.network)??this.connector.network,addFunctionCallKey:o.addFunctionCallKey,messageParams:o.messageParams})}async signOut(o){await this.wallet.signOut({network:(o==null?void 0:o.network)??this.connector.network})}async getAccounts(o){return this.wallet.getAccounts({network:(o==null?void 0:o.network)??this.connector.network})}async signAndSendTransaction(o){const s=(0,e.nearActionsToConnectorActions)(o.actions);(0,t.assertGasKeyActionsSupported)(this.manifest.features,s,this.manifest.name);const n=o.network??this.connector.network,i=await this.wallet.signAndSendTransaction({...o,actions:s,network:n});if(!i)throw new Error("No result from wallet");return Array.isArray(i.transactions)?i.transactions[0]:i}async signAndSendTransactions(o){const s=o.network??this.connector.network,n=o.transactions.map(h=>({actions:(0,e.nearActionsToConnectorActions)(h.actions),receiverId:h.receiverId}));(0,t.assertGasKeyActionsSupported)(this.manifest.features,n.flatMap(h=>h.actions),this.manifest.name);const i=await this.wallet.signAndSendTransactions({...o,transactions:n,network:s});if(!i)throw new Error("No result from wallet");return Array.isArray(i.transactions)?i.transactions:i}async signMessage(o){return this.wallet.signMessage({...o,network:o.network??this.connector.network})}async signDelegateActions(o){const s=o.delegateActions.map(n=>({...n,actions:(0,e.nearActionsToConnectorActions)(n.actions)}));return(0,t.assertGasKeyActionsSupported)(this.manifest.features,s.flatMap(n=>n.actions),this.manifest.name),this.wallet.signDelegateActions({...o,delegateActions:s,network:o.network??this.connector.network})}};return de.InjectedWallet=r,de}var F={},ue={},tt;function zt(){if(tt)return ue;tt=1,Object.defineProperty(ue,"__esModule",{value:!0}),ue.NearWalletsPopup=void 0;const e=Pe(),t=ut(),r=pt(),l={id:"custom-wallet",name:"Custom Wallet",icon:"https://www.mynearwallet.com/images/webclip.png",description:"Custom wallet for NEAR.",website:"",version:"1.0.0",executor:"your-executor-url.js",type:"sandbox",platform:{},features:{signMessage:!0,signInWithoutAddKey:!0,signInAndSignMessage:!0,signAndSendTransaction:!0,signAndSendTransactions:!0,signDelegateActions:!0},permissions:{storage:!0,allowsOpen:[]}};let o=class extends r.Popup{constructor(i){super(i);m(this,"delegate");this.delegate=i,this.update({wallets:i.wallets,showSettings:!1})}handlers(){super.handlers(),this.addListener(".settings-button","click",()=>this.update({showSettings:!0})),this.addListener(".back-button","click",()=>this.update({showSettings:!1})),this.root.querySelectorAll(".connect-item").forEach(i=>{i instanceof HTMLDivElement&&this.addListener(i,"click",()=>this.delegate.onSelect(i.dataset.type))}),this.root.querySelectorAll(".remove-wallet-button").forEach(i=>{i instanceof SVGSVGElement&&this.addListener(i,"click",async h=>{h.stopPropagation(),await this.delegate.onRemoveDebugManifest(i.dataset.type);const u=this.state.wallets.filter(p=>p.id!==i.dataset.type);this.update({wallets:u})})}),this.addListener(".add-debug-manifest-button","click",async()=>{var i;try{const h=((i=this.root.querySelector("#debug-manifest-input"))==null?void 0:i.value)??"",u=await this.delegate.onAddDebugManifest(h);this.update({showSettings:!1,wallets:[u,...this.state.wallets]})}catch(h){alert(`Something went wrong: ${h}`)}})}create(){super.create({show:!0})}walletDom(i){var u;const h=(0,e.html)`
      <svg
        class="remove-wallet-button"
        data-type="${i.id}"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="margin-right: 4px;"
      >
        <path d="M18 6L6 18" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6 6L18 18" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;return(0,e.html)`
      <div class="connect-item" data-type="${i.id}">
        <img style="background: #333" src="${i.icon}" alt="${i.name}" />
        <div class="connect-item-info">
          <span>${i.name}</span>
          <span class="wallet-address">${(u=(0,t.parseUrl)(i.website))==null?void 0:u.hostname}</span>
        </div>
        ${i.debug?h:""}
      </div>
    `}get footer(){if(!this.delegate.footer)return"";const{icon:i,heading:h,link:u,linkText:p}=this.delegate.footer;return(0,e.html)`
      <div class="footer">
        ${i?(0,e.html)`<img src="${i}" alt="${h}" />`:""}
        <p>${h}</p>
        <a class="get-wallet-link" href="${u}" target="_blank">${p}</a>
      </div>
    `}get dom(){return this.state.showSettings?(0,e.html)`
        <div class="modal-container">
          <div class="modal-content">
            <div class="modal-header">
              <button class="back-button" style="left: 16px; right: unset;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <p>Settings</p>
            </div>

            <div class="modal-body">
              <p style="text-align: left;">
                You can add your wallet to dapp for debug,
                <a href="https://github.com/azbang/hot-connector" target="_blank">read the documentation.</a> Paste your manifest and click "Add".
              </p>

              <textarea style="width: 100%;" id="debug-manifest-input" rows="10">${JSON.stringify(l,null,2)}</textarea>
              <button class="add-debug-manifest-button">Add</button>
            </div>

            ${this.footer}
          </div>
        </div>
      `:(0,e.html)`<div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <p>Select wallet</p>
          <button class="settings-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.5)" />
              <circle cx="19" cy="12" r="2" fill="rgba(255,255,255,0.5)" />
              <circle cx="5" cy="12" r="2" fill="rgba(255,255,255,0.5)" />
            </svg>
          </button>
        </div>

        <div class="modal-body">${this.state.wallets.map(i=>this.walletDom(i))}</div>

        ${this.footer}
      </div>
    </div>`}};return ue.NearWalletsPopup=o,ue}var fe={},nt;function Ht(){if(nt)return fe;nt=1,Object.defineProperty(fe,"__esModule",{value:!0});class e{constructor(r,l){m(this,"dbName");m(this,"storeName");m(this,"version");this.dbName=r,this.storeName=l,this.version=1}getDb(){return new Promise((r,l)=>{if(typeof window>"u"||typeof indexedDB>"u"){l(new Error("IndexedDB is not available (SSR environment)"));return}const o=indexedDB.open(this.dbName,this.version);o.onerror=s=>{console.error("Error opening database:",s.target.error),l(new Error("Error opening database"))},o.onsuccess=s=>{r(o.result)},o.onupgradeneeded=s=>{const n=o.result;n.objectStoreNames.contains(this.storeName)||n.createObjectStore(this.storeName)}})}async getItem(r){const l=await this.getDb();if(typeof r=="number"&&(r=r.toString()),typeof r!="string")throw new Error("Key must be a string");return new Promise((o,s)=>{if(!this.storeName){s(new Error("Store name not set"));return}const n=l.transaction(this.storeName,"readonly");n.onerror=u=>s(n.error);const h=n.objectStore(this.storeName).get(r);h.onerror=u=>s(h.error),h.onsuccess=()=>{o(h.result),l.close()}})}async setItem(r,l){const o=await this.getDb();if(typeof r=="number"&&(r=r.toString()),typeof r!="string")throw new Error("Key must be a string");return new Promise((s,n)=>{if(!this.storeName){n(new Error("Store name not set"));return}const i=o.transaction(this.storeName,"readwrite");i.onerror=p=>n(i.error);const u=i.objectStore(this.storeName).put(l,r);u.onerror=p=>n(u.error),u.onsuccess=()=>{o.close(),s()}})}async removeItem(r){const l=await this.getDb();if(typeof r=="number"&&(r=r.toString()),typeof r!="string")throw new Error("Key must be a string");return new Promise((o,s)=>{if(!this.storeName){s(new Error("Store name not set"));return}const n=l.transaction(this.storeName,"readwrite");n.onerror=u=>s(n.error);const h=n.objectStore(this.storeName).delete(r);h.onerror=u=>s(h.error),h.onsuccess=()=>{l.close(),o()}})}async keys(){const r=await this.getDb();return new Promise((l,o)=>{if(!this.storeName){o(new Error("Store name not set"));return}const s=r.transaction(this.storeName,"readonly");s.onerror=h=>o(s.error);const i=s.objectStore(this.storeName).getAllKeys();i.onerror=h=>o(i.error),i.onsuccess=()=>{l(i.result),r.close()}})}async count(){const r=await this.getDb();return new Promise((l,o)=>{if(!this.storeName){o(new Error("Store name not set"));return}const s=r.transaction(this.storeName,"readonly");s.onerror=h=>o(s.error);const i=s.objectStore(this.storeName).count();i.onerror=h=>o(i.error),i.onsuccess=()=>{l(i.result),r.close()}})}async length(){return this.count()}async clear(){const r=await this.getDb();return new Promise((l,o)=>{if(!this.storeName){o(new Error("Store name not set"));return}const s=r.transaction(this.storeName,"readwrite");s.onerror=h=>o(s.error);const i=s.objectStore(this.storeName).clear();i.onerror=h=>o(i.error),i.onsuccess=()=>{r.close(),l()}})}}return fe.default=e,fe}var rt;function Gt(){if(rt)return F;rt=1;var e=F&&F.__importDefault||function(g){return g&&g.__esModule?g:{default:g}};Object.defineProperty(F,"__esModule",{value:!0}),F.NearConnector=void 0;const t=ht(),r=zt(),l=ct(),o=e(Ht()),s=dt(),n=gt(),i=ft(),h=["https://raw.githubusercontent.com/hot-dao/near-selector/refs/heads/main/repository/manifest.json","https://cdn.jsdelivr.net/gh/azbang/hot-connector/repository/manifest.json"];function u(g){return c=>Object.entries(g).length===0?!0:Object.entries(g).filter(([d,f])=>f===!0).every(([d])=>{var f;return((f=c.manifest.features)==null?void 0:f[d])===!0})}let p=class{constructor(c){m(this,"storage");m(this,"events");m(this,"db");m(this,"logger");m(this,"wallets",[]);m(this,"manifest",{wallets:[],version:"1.0.0"});m(this,"features",{});m(this,"network","mainnet");m(this,"providers",{mainnet:[],testnet:[]});m(this,"walletConnect");m(this,"footerBranding");m(this,"excludedWallets",[]);m(this,"autoConnect");m(this,"cspNonce");m(this,"whenManifestLoaded");m(this,"_handleNearWalletInjected",c=>{this.wallets=this.wallets.filter(d=>d.manifest.id!==c.detail.manifest.id),this.wallets.unshift(new n.InjectedWallet(this,c.detail)),this.events.emit("selector:walletsChanged",{})});this.db=new o.default("hot-connector","wallets"),this.storage=(c==null?void 0:c.storage)??new l.LocalStorage,this.events=(c==null?void 0:c.events)??new t.EventEmitter,this.logger=c==null?void 0:c.logger,this.cspNonce=c==null?void 0:c.cspNonce,this.network=(c==null?void 0:c.network)??"mainnet",this.walletConnect=c==null?void 0:c.walletConnect,this.autoConnect=(c==null?void 0:c.autoConnect)??!0,this.providers=(c==null?void 0:c.providers)??{mainnet:[],testnet:[]},this.excludedWallets=(c==null?void 0:c.excludedWallets)??[],this.features=(c==null?void 0:c.features)??{},(c==null?void 0:c.footerBranding)!==void 0?this.footerBranding=c==null?void 0:c.footerBranding:this.footerBranding={icon:"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%20512%20512%22%20class%3D%22size-7%22%3E%3Crect%20width%3D%22512%22%20height%3D%22512%22%20fill%3D%22%2300ec97%22%20rx%3D%22110%22%2F%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M373.89%20106.199a31.95%2031.95%200%200%200-27.213%2015.207l-62.631%2092.979a6.67%206.67%200%200%200-.989%205.001%206.66%206.66%200%200%200%202.837%204.235%206.67%206.67%200%200%200%208.032-.494l61.643-53.47c1.02-.924%202.599-.827%203.523.193.419.473.644%201.074.644%201.697v167.402a2.49%202.49%200%200%201-2.502%202.491%202.48%202.48%200%200%201-1.912-.891L168.976%20117.497a31.93%2031.93%200%200%200-24.356-11.298h-6.508c-17.623%200-31.917%2014.294-31.917%2031.917v235.767c0%2017.623%2014.294%2031.917%2031.917%2031.917a31.94%2031.94%200%200%200%2027.213-15.206l62.631-92.98a6.66%206.66%200%200%200-1.847-9.236%206.67%206.67%200%200%200-8.033.494l-61.643%2053.471c-1.02.923-2.599.826-3.522-.194a2.5%202.5%200%200%201-.634-1.697V173.008a2.49%202.49%200%200%201%202.502-2.492c.731%200%201.439.322%201.912.891l186.313%20223.096a31.95%2031.95%200%200%200%2024.357%2011.297h6.508c17.623%200%2031.927-14.272%2031.938-31.895V138.116c0-17.623-14.294-31.917-31.917-31.917%22%2F%3E%3C%2Fsvg%3E",heading:"NEAR Connector",link:"https://wallet.near.org",linkText:"Don't have a wallet?"},this.whenManifestLoaded=new Promise(async d=>{(c==null?void 0:c.manifest)==null||typeof c.manifest=="string"?this.manifest=await this._loadManifest(c==null?void 0:c.manifest).catch(()=>({wallets:[],version:"1.0.0"})):this.manifest=(c==null?void 0:c.manifest)??{wallets:[],version:"1.0.0"};const f=new Set(this.excludedWallets);f.delete("hot-wallet"),this.manifest.wallets=this.manifest.wallets.filter(w=>!(w.permissions.walletConnect&&!this.walletConnect||f.has(w.id))),await new Promise(w=>setTimeout(w,100)),d()}),typeof window<"u"&&(window.addEventListener("near-wallet-injected",this._handleNearWalletInjected),window.dispatchEvent(new Event("near-selector-ready")),window.addEventListener("message",async d=>{d.data.type==="near-wallet-injected"&&(await this.whenManifestLoaded.catch(()=>{}),this.wallets=this.wallets.filter(f=>f.manifest.id!==d.data.manifest.id),this.wallets.unshift(new s.ParentFrameWallet(this,d.data.manifest)),this.events.emit("selector:walletsChanged",{}),this.autoConnect&&this.connect({walletId:d.data.manifest.id}))})),this.whenManifestLoaded.then(()=>{typeof window<"u"&&window.parent.postMessage({type:"near-selector-ready"},"*"),this.manifest.wallets.forEach(d=>this.registerWallet(d)),this.storage.get("debug-wallets").then(d=>{JSON.parse(d??"[]").forEach(w=>this.registerDebugWallet(w))})})}get availableWallets(){return this.wallets.filter(d=>Object.entries(this.features).every(([f,w])=>{var y;return!(w&&!((y=d.manifest.features)!=null&&y[f]))})).filter(d=>{var f;return!(this.network==="testnet"&&!((f=d.manifest.features)!=null&&f.testnet))})}async _loadManifest(c){const d=c?[c]:h;for(const f of d){const w=await fetch(f).catch(()=>null);if(!(!w||!w.ok))return await w.json()}throw new Error("Failed to load manifest")}async switchNetwork(c,d){this.network!==c&&(await this.disconnect().catch(()=>{}),this.network=c,await this.connect(d))}async registerWallet(c){if(c.type!=="sandbox")throw new Error("Only sandbox wallets are supported");this.wallets.find(d=>d.manifest.id===c.id)||(this.wallets.push(new i.SandboxWallet(this,c)),this.events.emit("selector:walletsChanged",{}))}async registerDebugWallet(c){const d=typeof c=="string"?JSON.parse(c):c;if(d.type!=="sandbox")throw new Error("Only sandbox wallets type are supported");if(!d.id)throw new Error("Manifest must have an id");if(!d.name)throw new Error("Manifest must have a name");if(!d.icon)throw new Error("Manifest must have an icon");if(!d.website)throw new Error("Manifest must have a website");if(!d.version)throw new Error("Manifest must have a version");if(!d.executor)throw new Error("Manifest must have an executor");if(!d.features)throw new Error("Manifest must have features");if(!d.permissions)throw new Error("Manifest must have permissions");if(this.wallets.find(w=>w.manifest.id===d.id))throw new Error("Wallet already registered");d.debug=!0,this.wallets.unshift(new i.SandboxWallet(this,d)),this.events.emit("selector:walletsChanged",{});const f=this.wallets.filter(w=>w.manifest.debug).map(w=>w.manifest);return this.storage.set("debug-wallets",JSON.stringify(f)),d}async removeDebugWallet(c){this.wallets=this.wallets.filter(f=>f.manifest.id!==c);const d=this.wallets.filter(f=>f.manifest.debug).map(f=>f.manifest);this.storage.set("debug-wallets",JSON.stringify(d)),this.events.emit("selector:walletsChanged",{})}async selectWallet({features:c={}}={}){return await this.whenManifestLoaded.catch(()=>{}),new Promise((d,f)=>{const w=new r.NearWalletsPopup({footer:this.footerBranding,wallets:this.availableWallets.filter(u(c)).map(y=>y.manifest),onRemoveDebugManifest:async y=>this.removeDebugWallet(y),onAddDebugManifest:async y=>this.registerDebugWallet(y),onReject:()=>(f(new Error("User rejected")),w.destroy()),onSelect:y=>(d(y),w.destroy())});w.create()})}async connect(c={}){var w,y,x,A,$,v;let d=c.walletId;const f=c.signMessageParams;await this.whenManifestLoaded.catch(()=>{}),d||(d=await this.selectWallet({features:{signInAndSignMessage:c.signMessageParams!=null?!0:void 0,signInWithFunctionCallKey:c.addFunctionCallKey!=null?!0:void 0}}));try{const k=await this.wallet(d);(w=this.logger)==null||w.log("Wallet available to connect",k),await this.storage.set("selected-wallet",d),(y=this.logger)==null||y.log(`Set preferred wallet, try to signIn${f!=null?" (with signed message)":""}`,d);let S;if(c.addFunctionCallKey!=null&&((x=this.logger)==null||x.log("Adding function call access key during sign in with params",c.addFunctionCallKey),S={...c.addFunctionCallKey,gasAllowance:c.addFunctionCallKey.gasAllowance??{amount:"250000000000000000000000",kind:"limited"}}),f!=null){const C=await k.signInAndSignMessage({addFunctionCallKey:S,messageParams:f,network:this.network});if(!(C!=null&&C.length))throw new Error("Failed to sign in");(A=this.logger)==null||A.log("Signed in to wallet (with signed message)",d,C),this.events.emit("wallet:signInAndSignMessage",{wallet:k,accounts:C,success:!0}),this.events.emit("wallet:signIn",{wallet:k,accounts:C.map(b=>({accountId:b.accountId,publicKey:b.publicKey})),success:!0,source:"signInAndSignMessage"})}else{const C=await k.signIn({addFunctionCallKey:S,network:this.network});if(!(C!=null&&C.length))throw new Error("Failed to sign in");($=this.logger)==null||$.log("Signed in to wallet",d,C),this.events.emit("wallet:signIn",{wallet:k,accounts:C,success:!0,source:"signIn"})}return k}catch(k){throw(v=this.logger)==null||v.log("Failed to connect to wallet",k),k}}async disconnect(c){c||(c=await this.wallet()),await c.signOut({network:this.network}),await this.storage.remove("selected-wallet"),this.events.emit("wallet:signOut",{success:!0})}async getConnectedWallet(){await this.whenManifestLoaded.catch(()=>{});const c=await this.storage.get("selected-wallet"),d=this.wallets.find(w=>w.manifest.id===c);if(!d)throw new Error("No wallet selected");const f=await d.getAccounts();if(!(f!=null&&f.length))throw new Error("No accounts found");return{wallet:d,accounts:f}}async wallet(c){if(await this.whenManifestLoaded.catch(()=>{}),!c)return this.getConnectedWallet().then(({wallet:f})=>f).catch(async()=>{throw await this.storage.remove("selected-wallet"),new Error("No accounts found")});const d=this.wallets.find(f=>f.manifest.id===c);if(!d)throw new Error("Wallet not found");return d}async use(c){await this.whenManifestLoaded.catch(()=>{}),this.wallets=this.wallets.map(d=>new Proxy(d,{get(f,w,y){const x=Reflect.get(f,w,y);if(w in c&&typeof x=="function"){const A=c[w];return function(...$){const v=()=>x.apply(f,$);return $.length>0?A.call(this,...$,v):A.call(this,void 0,v)}}return x}}))}on(c,d){this.events.on(c,d)}once(c,d){this.events.once(c,d)}off(c,d){this.events.off(c,d)}removeAllListeners(c){this.events.removeAllListeners(c)}};return F.NearConnector=p,F}var st;function Vt(){return st||(st=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.assertGasKeyActionsSupported=e.isGasKeyAction=e.nearActionsToConnectorActions=e.NearConnector=e.InjectedWallet=e.SandboxWallet=e.ParentFrameWallet=e.LocalStorage=void 0;var t=ct();Object.defineProperty(e,"LocalStorage",{enumerable:!0,get:function(){return t.LocalStorage}});var r=dt();Object.defineProperty(e,"ParentFrameWallet",{enumerable:!0,get:function(){return r.ParentFrameWallet}});var l=ft();Object.defineProperty(e,"SandboxWallet",{enumerable:!0,get:function(){return l.SandboxWallet}});var o=gt();Object.defineProperty(e,"InjectedWallet",{enumerable:!0,get:function(){return o.InjectedWallet}});var s=Gt();Object.defineProperty(e,"NearConnector",{enumerable:!0,get:function(){return s.NearConnector}});var n=me();Object.defineProperty(e,"nearActionsToConnectorActions",{enumerable:!0,get:function(){return n.nearActionsToConnectorActions}});var i=ye();Object.defineProperty(e,"isGasKeyAction",{enumerable:!0,get:function(){return i.isGasKeyAction}}),Object.defineProperty(e,"assertGasKeyActionsSupported",{enumerable:!0,get:function(){return i.assertGasKeyActionsSupported}})})(ke)),ke}var Jt=Vt();const wt={testnet:{networkId:"testnet",nodeUrl:"https://rpc.testnet.near.org",explorerTxBase:"https://testnet.nearblocks.io/txns/"},mainnet:{networkId:"mainnet",nodeUrl:"https://rpc.mainnet.near.org",explorerTxBase:"https://nearblocks.io/txns/"}},mt={testnet:"https://wallet.intear.tech/",mainnet:"https://wallet.meteorwallet.app/"};let T=null,O=null,_="",G=null;async function Ne(e){var r;if(T&&G===e)return T;T&&O&&await T.disconnect().catch(()=>{}),O=null,_="",G=e;const t=new Jt.NearConnector({network:e});T=t,t.on("wallet:signIn",({accounts:l})=>{var o;T===t&&(_=((o=l[0])==null?void 0:o.accountId)??_,t.getConnectedWallet().then(({wallet:s})=>{T===t&&(O=s)}).catch(()=>{}))}),t.on("wallet:signOut",()=>{T===t&&(O=null,_="")});try{const l=await t.getConnectedWallet();T===t&&(O=l.wallet,_=((r=l.accounts[0])==null?void 0:r.accountId)??"")}catch{}return t}function yt(){if(!T)throw new Error("NEAR not initialized — call initNear first.");return T}function bt(){return O!==null&&_!==""}function Xt(){return _}async function Zt(){var l;const t=await yt().connect(),r=await t.getAccounts({network:G??void 0});if(O=t,_=((l=r[0])==null?void 0:l.accountId)??_,!_)throw new Error("The wallet did not return an account.")}async function Qt(){const e=T;O=null,_="",e&&await e.disconnect().catch(()=>{})}async function en(){var e;if(!bt()||!G)return null;try{const t=wt[G],r=await fetch(t.nodeUrl,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:"nearsplit",method:"query",params:{request_type:"view_account",finality:"optimistic",account_id:_}})});if(!r.ok)return null;const l=await r.json();if(l.error||typeof((e=l.result)==null?void 0:e.amount)!="string")return null;const o=BigInt(l.result.amount),s=BigInt(l.result.locked??"0");return(o-s).toString()}catch{return null}}async function tn(e,t,r){var n,i,h;(G!==e||!T)&&await Ne(e);let l=O;if(!l)try{l=await yt().wallet();const u=await l.getAccounts({network:e});O=l,_=((n=u[0])==null?void 0:n.accountId)??_}catch{l=null}if(!l||!_)throw new Error("Connect your NEAR wallet first.");const o=await l.signAndSendTransaction({receiverId:t,actions:[{type:"Transfer",params:{deposit:r}}]}),s=((i=o.transaction_outcome)==null?void 0:i.id)||(typeof((h=o.transaction)==null?void 0:h.hash)=="string"?o.transaction.hash:"")||"";return{txHash:s,explorerUrl:$e(e,s)}}function $e(e,t){return`${wt[e].explorerTxBase}${t}`}function nn(e){const t=e instanceof Error?e.message:String(e??""),r=t.toLowerCase();return r.includes("reject")||r.includes("cancel")||r.includes("denied")||r.includes("user closed")||r.includes("not authorized")?{kind:"cancelled",message:"Payment cancelled in the wallet — nothing was sent."}:r.includes("insufficient")||r.includes("not enough")?{kind:"error",message:"Not enough NEAR in the connected account for this share plus the network fee. Top up and try again."}:r.includes("does not exist")||r.includes("account id")&&r.includes("invalid")?{kind:"error",message:"The receiving account in this link does not look valid on this network. Ask the organizer for a fresh link."}:{kind:"error",message:t?`Payment failed: ${t}`:"Payment failed. Please try again."}}const vt="nearsplit.splits.v1",kt="nearsplit.paid.v1",xt="nearsplit.network.v1";function At(e,t){try{const r=localStorage.getItem(e);return r?JSON.parse(r)??t:t}catch{return t}}function St(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}function U(){const e=At(vt,[]);return Array.isArray(e)?e:[]}function Ct(e){St(vt,e)}function be(e){const t=U(),r=t.findIndex(l=>l.id===e.id);return r>=0?t[r]=e:t.unshift(e),Ct(t),t}function rn(e){const t=U().filter(r=>r.id!==e);return Ct(t),t}function Et(){const e=At(kt,[]);return Array.isArray(e)?e:[]}function sn(e){return Et().find(t=>t.ref===e)}function on(e){const t=Et().filter(r=>r.ref!==e.ref);t.unshift(e),St(kt,t)}function an(){try{return localStorage.getItem(xt)==="mainnet"?"mainnet":"testnet"}catch{return"testnet"}}function ln(e){try{localStorage.setItem(xt,e)}catch{}}const ot="0123456789ABCDEFGHJKLMNPQRSTUVXY";function It(e){const t=new Uint8Array(e);crypto.getRandomValues(t);let r="";for(let l=0;l<e;l++)r+=ot[t[l]%ot.length];return r}function Pt(){return It(8).toLowerCase()}const cn=/^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/,dn=/^[0-9a-f]{64}$/;function un(e){return dn.test(e)}function _e(e){return typeof e!="string"||e.length<2||e.length>64?!1:un(e)?!0:cn.test(e)}function hn(e){return e.trim().toLowerCase()}function Te(e){return e.length<=16?e:`${e.slice(0,8)}…${e.slice(-4)}`}function pn(e,t){return`NSP-${e.slice(0,4).toUpperCase()}-${t+1}`}function fn(e,t){const r=e.participants[t];return{v:1,id:e.id,t:e.title,o:e.organizer,a:e.nearAccount,net:e.network,tot:e.totalYocto,amt:r.shareYocto,n:r.name,ref:pn(e.id,t),cnt:e.participants.length,all:e.participants.map(l=>l.name)}}function gn(e){const t=new TextEncoder().encode(e);let r="";return t.forEach(l=>{r+=String.fromCharCode(l)}),btoa(r).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function wn(e){const t=e.replace(/-/g,"+").replace(/_/g,"/"),r=t+"=".repeat((4-t.length%4)%4),l=atob(r),o=Uint8Array.from(l,s=>s.charCodeAt(0));return new TextDecoder().decode(o)}function mn(e){return gn(JSON.stringify(e))}function yn(e,t){const r=mn(fn(e,t));return`${`${location.origin}${location.pathname}`}#/pay/${r}`}const at=/^\d+$/;function bn(e){try{const t=JSON.parse(wn(e));return!t||t.v!==1||typeof t.id!="string"||typeof t.t!="string"||typeof t.o!="string"||typeof t.n!="string"||!_e(t.a)||t.net!=="testnet"&&t.net!=="mainnet"||typeof t.tot!="string"||!at.test(t.tot)||typeof t.amt!="string"||!at.test(t.amt)||!Array.isArray(t.all)?null:t}catch{return null}}function vn(){return It(3).toLowerCase()}const Ae=10n**24n,Se=24;function it(e){if(typeof e!="string")return null;const t=e.trim().replace(/\s/g,"").replace(",",".");if(!t||!/^\d*(\.\d*)?$/.test(t)||t===".")return null;const[r,l=""]=t.split("."),o=r===""?"0":r;if(l.length>Se)return null;const s=l.padEnd(Se,"0");try{return BigInt(o)*Ae+(s?BigInt(s):0n)}catch{return null}}function Nt(e,t=5){const r=typeof e=="bigint"?e:BigInt(e),l=r<0n,o=l?-r:r,s=o/Ae,n=o%Ae,i=s.toLocaleString("en-US");let h="";return n>0n&&(h="."+n.toString().padStart(Se,"0").slice(0,t).replace(/0+$/,""),h==="."&&(h="")),`${l?"-":""}${i}${h}`}function N(e){return`${Nt(e)} NEAR`}function lt(e,t){if(t<=0)return[];const r=BigInt(t),l=e/r,o=e-l*r;return Array.from({length:t},(s,n)=>l+(BigInt(n)<o?1n:0n))}function kn(e,t){return e*BigInt(100+t)/100n}function xn(e){return e.reduce((t,r)=>t+BigInt(r),0n)}function An(e,t){const r=a("section",{class:"card wallet-card","aria-label":"Wallet status"}),l=e.network==="testnet"?"NEAR Testnet":"NEAR Mainnet";if(e.signedIn){const o=[a("div",{class:"wallet-dot wallet-dot-on","aria-hidden":"true"}),a("div",{class:"wallet-main"},a("div",{class:"wallet-title"},"Connected NEAR wallet"),a("div",{class:"wallet-sub"},e.accountId?Te(e.accountId):"Account loading…",` · ${l}`))];e.balanceYocto!==void 0&&o.push(a("div",{class:"wallet-balance"},a("span",{class:"wallet-balance-amount"},Nt(e.balanceYocto)),a("span",{class:"wallet-balance-unit"},"NEAR"))),r.append(a("div",{class:"wallet-row"},...o));const s=a("button",{class:"btn btn-ghost btn-small",type:"button"},"Sign out");s.addEventListener("click",t.onSignOut),r.append(a("div",{class:"wallet-actions"},s))}else{r.append(a("div",{class:"wallet-row"},a("div",{class:"wallet-dot wallet-dot-off","aria-hidden":"true"}),a("div",{class:"wallet-main"},a("div",{class:"wallet-title"},"No NEAR wallet connected"),a("div",{class:"wallet-sub"},`Connect with Meteor, Intear, HOT and more to pay shares on ${l}. Creating splits works without a wallet.`))));const o=a("button",{class:"btn btn-secondary btn-small",type:"button"},t.connectBusy?"Opening wallet picker…":"Connect NEAR wallet");o.disabled=t.connectBusy,o.addEventListener("click",t.onConnect);const s=a("a",{class:"btn btn-ghost btn-small",href:mt[e.network],target:"_blank",rel:"noopener"},e.network==="testnet"?"Create a free testnet account":"Create a NEAR account");r.append(a("div",{class:"wallet-actions"},o,s))}return r}function Sn(){return a("section",{class:"card how-card","aria-label":"How NearSplit works"},a("h3",{class:"section-title"},"How it works"),a("ol",{class:"how-list"},a("li",{},"Create a split: title, total in NEAR, who is in. Shares are calculated exactly — down to the last yocto."),a("li",{},"Send each person their personal pay link. No app install, no sign-up for them."),a("li",{},"They open the link, connect their NEAR wallet (Meteor, Intear, HOT, … via NEAR Connect), and pay their exact share to you in one tap. The payment settles on NEAR and shows up on NearBlocks.")),a("p",{class:"hint"},"NearSplit has no backend and never touches your keys — payments go wallet-to-wallet on NEAR. Splits are stored only on this device; the pay links carry the bill details."))}function $t(e){return xn(e.participants.filter(t=>t.paid).map(t=>t.shareYocto))}function Cn(e,t){const r=e.participants.filter(u=>u.paid).length,l=e.participants.length,o=$t(e),s=r===l,n=a("article",{class:"card split-card"}),i=()=>t(e.id);n.addEventListener("click",i),n.setAttribute("tabindex","0"),n.setAttribute("role","button"),n.setAttribute("aria-label",`Open split ${e.title}`),n.addEventListener("keydown",u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),i())});const h=l===0?0:Math.round(r/l*100);return n.append(a("div",{class:"split-card-head"},a("h3",{class:"split-card-title"},e.title),a("span",{class:`badge ${s?"badge-done":"badge-open"}`},s?"Settled ✓":`${r}/${l} paid`)),a("div",{class:"split-card-meta"},`${N(e.totalYocto)} · to ${e.nearAccount} · ${e.network}`),a("div",{class:"progress","aria-hidden":"true"},a("div",{class:"progress-bar",style:`width:${h}%`})),a("div",{class:"split-card-foot"},a("span",{},`Collected ${N(o)}`),a("span",{class:"muted"},`Outstanding ${N(BigInt(e.totalYocto)-o)}`))),n}function En(e,t,r){let l="equal";const o=[],s=a("section",{class:"view"}),n=a("input",{class:"input",type:"text",id:"f-title",maxlength:"80",placeholder:"Team dinner at Warung Sari",autocomplete:"off"}),i=a("input",{class:"input",type:"text",id:"f-organizer",maxlength:"40",placeholder:"Your name",autocomplete:"off"}),h=a("input",{class:"input",type:"text",id:"f-total",inputmode:"decimal",placeholder:"0.00",autocomplete:"off"}),u=a("select",{class:"input",id:"f-tip"},a("option",{value:"0"},"No tip"),a("option",{value:"5"},"Tip 5%"),a("option",{value:"10"},"Tip 10%"),a("option",{value:"15"},"Tip 15%"),a("option",{value:"20"},"Tip 20%")),p=a("input",{class:"input mono",type:"text",id:"f-near-account",maxlength:"64",placeholder:"yourname.testnet",autocomplete:"off",spellcheck:"false"});e.signedIn&&e.accountId&&(p.value=e.accountId);const g=a("button",{type:"button",class:"seg-btn seg-btn-active"},"Split equally"),c=a("button",{type:"button",class:"seg-btn"},"Custom amounts"),d=b=>{l=b,g.classList.toggle("seg-btn-active",b==="equal"),c.classList.toggle("seg-btn-active",b==="custom"),o.forEach(I=>{I.amount.style.display=b==="custom"?"":"none"}),v()};g.addEventListener("click",()=>d("equal")),c.addEventListener("click",()=>d("custom"));const f=a("div",{class:"participant-rows"}),w=(b="")=>{const I=a("input",{class:"input",type:"text",maxlength:"40",placeholder:"Name","aria-label":"Participant name",autocomplete:"off"});I.value=b;const P=a("input",{class:"input participant-amount",type:"text",inputmode:"decimal",placeholder:"0.00","aria-label":"Custom amount",autocomplete:"off"});P.style.display="none";const W=a("button",{type:"button",class:"btn btn-ghost btn-icon","aria-label":"Remove participant"},"✕"),j=a("div",{class:"participant-row"},I,P,W),Y={name:I,amount:P,row:j};W.addEventListener("click",()=>{const V=o.indexOf(Y);V>=0&&o.splice(V,1),j.remove(),v()}),I.addEventListener("input",v),P.addEventListener("input",v),o.push(Y),f.append(j)};w("You"),w(""),w("");const y=a("button",{type:"button",class:"btn btn-ghost"},"+ Add person");y.addEventListener("click",()=>{w("");const b=o[o.length-1];b==null||b.name.focus()});const x=a("p",{class:"form-preview muted",role:"status"}),A=a("p",{class:"form-error",role:"alert"});A.style.display="none";function $(){const b=it(h.value);if(b===null||b<=0n)return null;const I=Number(u.value)||0;return kn(b,I)}function v(){const b=o.filter(P=>P.name.value.trim().length>0),I=$();if(I===null||b.length===0){x.textContent=b.length===0?"Add at least one person to split with.":"Enter the bill total to see the shares.";return}if(l==="equal"){const P=lt(I,b.length);x.textContent=`${b.length} people · ${N(P[0])} each`+(P.some(W=>W!==P[0])?" (rounded fairly)":"")+` · Total ${N(I)}`}else x.textContent=`Total ${N(I)} — custom amounts must add up to it exactly.`}h.addEventListener("input",v),u.addEventListener("change",v),p.addEventListener("input",v);function k(b){A.textContent=b,A.style.display="",A.scrollIntoView({behavior:"smooth",block:"center"})}const S=a("button",{type:"button",class:"btn btn-primary btn-block"},"Create split & get pay links");S.addEventListener("click",()=>{A.style.display="none";const b=n.value.trim();if(!b)return k("Give the bill a title, e.g. “Team dinner at Warung Sari”.");const I=i.value.trim();if(!I)return k("Add your name so friends know who organized this split.");const P=$();if(P===null)return k("Enter a valid total amount in NEAR.");const W=hn(p.value);if(!_e(W))return k(`The receiving NEAR account “${p.value.trim()}” is not a valid account id. Named accounts are lowercase (e.g. yourname.testnet on testnet, yourname.near on mainnet); payments go to this account, so check it carefully.`);if(e.network==="testnet"&&!W.endsWith(".testnet")&&W.includes("."))return k("You are on Testnet — the receiving account should be a testnet account (… .testnet). Switch the network in the header for mainnet accounts.");if(e.network==="mainnet"&&W.endsWith(".testnet"))return k("You are on Mainnet but the receiving account is a testnet account. Switch the network in the header to Testnet.");const j=o.filter(M=>M.name.value.trim().length>0);if(j.length===0)return k("Add at least one person to split with.");const Y=j.map(M=>M.name.value.trim()),V=Y.filter((M,L)=>Y.indexOf(M)!==L);if(V.length>0)return k(`“${V[0]}” appears twice. Give everyone a unique name so their pay links stay personal.`);let J;if(l==="equal")J=lt(P,j.length);else{J=[];for(const L of j){const X=it(L.amount.value);if(X===null||X<=0n)return k(`Enter a valid amount for ${L.name.value.trim()}.`);J.push(X)}const M=J.reduce((L,X)=>L+X,0n);if(M!==P)return k(`Custom amounts add up to ${N(M)}, but the total is ${N(P)}. `+(M<P?`You are missing ${N(P-M)}.`:`That is ${N(M-P)} too much.`))}const _t=j.map((M,L)=>({id:`${L}`,name:Y[L],shareYocto:J[L].toString(),paid:!1})),Tt={id:Pt(),title:b,organizer:I,nearAccount:W,network:e.network,totalYocto:P.toString(),tipPercent:Number(u.value)||0,mode:l,participants:_t,createdAt:new Date().toISOString()};K("Split created 🎉","success"),t(Tt)});const C=a("button",{type:"button",class:"btn btn-ghost"},"Cancel");return C.addEventListener("click",r),s.append(a("h2",{class:"view-title"},"Split a bill"),a("p",{class:"hint"},`This split lives on ${e.network==="testnet"?"NEAR Testnet":"NEAR Mainnet"} — the network selected in the header.`),a("div",{class:"field"},a("label",{class:"label",for:"f-title"},"What is this bill for?"),n),a("div",{class:"field"},a("label",{class:"label",for:"f-total"},"Total amount (NEAR)"),h),a("div",{class:"field"},a("label",{class:"label",for:"f-tip"},"Tip"),u,a("p",{class:"hint"},"The tip is added on top of the total before splitting.")),a("div",{class:"field"},a("label",{class:"label",for:"f-organizer"},"Your name (organizer)"),i),a("div",{class:"field"},a("label",{class:"label",for:"f-near-account"},"Your NEAR account (receives every share)"),p,a("p",{class:"hint"},e.signedIn?"Auto-filled from your connected wallet. Everyone pays their share directly to this account.":"Connect your wallet to auto-fill this, or type your NEAR account id. Everyone pays their share directly to this account.")),a("div",{class:"field"},a("label",{class:"label"},"Who is splitting?"),a("div",{class:"seg",role:"group","aria-label":"Split mode"},g,c),f,y,a("p",{class:"hint"},"Tip: include yourself if you also owe a share. Everyone gets their own personal pay link.")),x,A,a("div",{class:"form-actions"},C,S)),v(),s}function In(e,t){const r=a("section",{class:"view"}),l=$t(e),o=e.participants.filter(u=>u.paid).length,s=e.participants.map((u,p)=>{const g=yn(e,p),c=a("button",{type:"button",class:"btn btn-ghost btn-small"},"Copy link");c.addEventListener("click",async()=>{const x=await We(g);K(x?`Pay link for ${u.name} copied`:"Copy failed — long-press the link to copy it.",x?"success":"error")});const d=a("button",{type:"button",class:"btn btn-ghost btn-small"},"Share");d.addEventListener("click",async()=>{if(!await Ot({title:"NearSplit",text:`Hi ${u.name}, your share of “${e.title}” is ${N(u.shareYocto)}. Pay it in NEAR here:`,url:g})){const A=await We(g);K(A?"Share not available — link copied instead":"Could not share or copy the link.",A?"info":"error")}});const f=a("button",{type:"button",class:`btn btn-small ${u.paid?"btn-ghost":"btn-secondary"}`},u.paid?"Mark unpaid":"Mark as paid");f.addEventListener("click",()=>t.onTogglePaid(e,u.id));const w=u.paid?a("span",{class:"status status-paid"},u.paidVia==="wallet"?"Paid via wallet ✓":"Paid ✓ (marked)"):a("span",{class:"status status-open"},"Waiting to pay"),y=u.txHash?a("a",{class:"tx-link mono",href:$e(e.network,u.txHash),target:"_blank",rel:"noopener"},`tx ${u.txHash.slice(0,10)}…`):a("span",{});return a("li",{class:"participant-card"},a("div",{class:"participant-head"},a("span",{class:"participant-name"},u.name),a("span",{class:"participant-amount"},N(u.shareYocto))),a("div",{class:"participant-row-between"},w,y),a("div",{class:"participant-actions"},c,d,f))}),n=a("button",{type:"button",class:"btn btn-secondary"},"Split again (clone)");n.addEventListener("click",()=>t.onClone(e));const i=a("button",{type:"button",class:"btn btn-danger-ghost"},"Delete split");i.addEventListener("click",()=>{window.confirm(`Delete “${e.title}”? The pay links for this split will stop matching your list.`)&&t.onDelete(e)});const h=a("button",{type:"button",class:"btn btn-ghost"},"← All splits");return h.addEventListener("click",t.onBack),r.append(h,a("h2",{class:"view-title"},e.title),a("p",{class:"muted"},`Total ${N(e.totalYocto)}`+(e.tipPercent>0?` (incl. ${e.tipPercent}% tip)`:"")+` · ${e.participants.length} people · organized by ${e.organizer}`),a("p",{class:"muted small"},`Payments go to ${e.nearAccount} on ${e.network==="testnet"?"NEAR Testnet":"NEAR Mainnet"}`),a("div",{class:"summary-card card"},a("div",{class:"summary-item"},a("span",{class:"summary-label"},"Collected"),a("span",{class:"summary-value"},N(l))),a("div",{class:"summary-item"},a("span",{class:"summary-label"},"Outstanding"),a("span",{class:"summary-value"},N(BigInt(e.totalYocto)-l))),a("div",{class:"summary-item"},a("span",{class:"summary-label"},"Paid"),a("span",{class:"summary-value"},`${o} of ${e.participants.length}`))),a("h3",{class:"section-title"},"Pay links — send each person their own"),a("ul",{class:"participant-list"},...s),a("p",{class:"hint"},"When someone pays through their link, their payment lands directly in the organizer account on NEAR (check it on NearBlocks) — or just mark them as paid here. Statuses live on this device."),a("div",{class:"form-actions"},i,n)),r}function Pn(e,t,r){const l=a("section",{class:"view"}),o=_e(e.a),s=t.network!==e.net,n=U().find(v=>v.id===e.id),i=n?n.participants.filter(v=>v.paid).length:null,h=sn(e.ref);let u=h?"paid":"idle",p=h==null?void 0:h.txHash;const g=a("div",{class:"pay-status"}),c=a("div",{class:"pay-actions"}),d=a("div",{class:"pay-note"});function f(){g.replaceChildren(),u==="paid"?g.append(a("div",{class:"paid-banner",role:"status"},a("div",{class:"paid-banner-title"},"You paid your share ✓"),p?a("a",{class:"tx-link mono",href:$e(e.net,p),target:"_blank",rel:"noopener"},`View on NearBlocks: ${p.slice(0,12)}…`):a("span",{class:"muted small"},"Marked as paid on this device."))):u==="paying"&&g.append(a("p",{class:"muted",role:"status"},"Sending your payment on NEAR…"))}function w(){if(c.replaceChildren(),d.replaceChildren(),u==="paid"||u==="paying")return;if(!o){c.append(a("p",{class:"form-error",role:"alert"},"The NEAR account in this link does not look valid. Ask the organizer to send you a fresh link — do not pay to a different account."));return}if(s){const S=a("button",{type:"button",class:"btn btn-primary btn-block btn-big"},`Switch to ${e.net==="testnet"?"Testnet":"Mainnet"} to pay`);S.addEventListener("click",r.onSwitchNetwork),c.append(S),d.append(a("p",{class:"hint"},`This bill is on ${e.net==="testnet"?"NEAR Testnet":"NEAR Mainnet"}, but the app is currently set to ${t.network}. NEAR accounts and funds are separate per network — switching only changes which network NearSplit talks to.`));return}if(!t.signedIn){const S=a("button",{type:"button",class:"btn btn-primary btn-block btn-big"},"Connect NEAR wallet");S.addEventListener("click",r.onConnect);const C=a("a",{class:"btn btn-ghost btn-block",href:mt[e.net],target:"_blank",rel:"noopener"},e.net==="testnet"?"No account yet? Create a free testnet account":"No account yet? Create a NEAR account");c.append(S,C),d.append(a("p",{class:"hint"},"A wallet picker (NEAR Connect) opens right here — pick your wallet (Meteor, Intear, HOT, …) and approve the connection without leaving this page. NearSplit never simulates payments — paying means connecting a real wallet and sending real NEAR on "+(e.net==="testnet"?"testnet (test funds, no real money).":"mainnet.")));return}const v=a("button",{type:"button",class:"btn btn-primary btn-block btn-big"},`Pay ${N(e.amt)}`);v.addEventListener("click",()=>void y(v)),c.append(v);const k=[`Connected as ${t.accountId??""} — the payment goes directly to ${e.a}. A small network fee (usually < 0.001 NEAR) is paid by your account on top of the share.`];t.balanceYocto!==void 0&&BigInt(t.balanceYocto)<BigInt(e.amt)&&k.push("Heads up: your available balance looks lower than this share — the payment will fail until you top up."),d.append(a("p",{class:"hint"},k.join(" ")))}async function y(v){u="paying",v.disabled=!0,v.textContent="Sending…",f();try{const k=await tn(e.net,e.a,e.amt);u="paid",p=k.txHash||void 0,on({ref:e.ref,splitId:e.id,txHash:k.txHash||void 0,at:new Date().toISOString()}),x(k.txHash||void 0),K("Payment sent 🎉","success"),f(),w(),r.refreshWallet()}catch(k){u="idle";const S=nn(k);K(S.message,S.kind==="cancelled"?"info":"error"),v.disabled=!1,v.textContent=`Pay ${N(e.amt)}`,f()}}function x(v){const S=U().find(I=>I.id===e.id);if(!S)return;const C=Number(e.ref.split("-").pop())-1;let b=S.participants[C];(!b||b.name!==e.n||b.shareYocto!==e.amt)&&(b=S.participants.find(I=>I.name===e.n&&I.shareYocto===e.amt)),!(!b||b.paid)&&(b.paid=!0,b.paidVia="wallet",b.txHash=v,b.paidAt=new Date().toISOString(),be(S))}const A=a("button",{type:"button",class:"btn btn-ghost"},"← My splits");A.addEventListener("click",r.onBack);const $=e.all.map(v=>a("li",{class:`roster-item ${v===e.n?"roster-item-you":""}`},v,v===e.n?" (you)":""));return l.append(A,a("p",{class:"eyebrow"},`${e.o} is splitting a bill`),a("h2",{class:"view-title"},e.t),a("div",{class:"card pay-card"},a("div",{class:"pay-share-label"},`${e.n}, your share is`),a("div",{class:"pay-share-amount"},N(e.amt)),a("div",{class:"pay-share-meta"},`of ${N(e.tot)} total · ${e.cnt} people · ${e.net==="testnet"?"NEAR Testnet":"NEAR Mainnet"}`),g,c,d,a("p",{class:"muted small"},`Paid to ${Te(e.a)} (${e.a}) · Ref ${e.ref}`)),a("div",{class:"card"},a("h3",{class:"section-title"},"Who is in this split"),a("ul",{class:"roster"},...$),i!==null?a("p",{class:"muted small"},`Progress on this device: ${i} of ${e.cnt} shares marked paid.`):a("p",{class:"muted small"},"Progress is tracked by the organizer — after paying, show them your NearBlocks confirmation so they can tick you off."))),f(),w(),l}const ge=document.getElementById("app");if(!ge)throw new Error("Missing #app element");const E={network:an(),signedIn:!1};let Ce=!1;async function ve(){try{await Ne(E.network),E.signedIn=bt(),E.accountId=E.signedIn?Xt():void 0,E.balanceYocto=E.signedIn?await en()??void 0:void 0}catch{E.signedIn=!1}D()}async function Ee(){Ce=!0,D();try{await Ne(E.network),await Zt(),await ve()}catch(e){const t=e instanceof Error?e.message:"";K(t.toLowerCase().includes("reject")?"Wallet connection cancelled — nothing was connected.":t||"Could not open the wallet picker.","error")}finally{Ce=!1,D()}}function Nn(){Qt(),E.signedIn=!1,E.accountId=void 0,E.balanceYocto=void 0,K("Wallet disconnected","info"),D()}async function we(e){e!==E.network&&(E.network=e,ln(e),E.signedIn=!1,E.accountId=void 0,E.balanceYocto=void 0,await ve())}function $n(){const e=location.hash||"#/";if(e==="#/"||e==="#")return{name:"home"};if(e==="#/create")return{name:"create"};const t=e.match(/^#\/split\/([a-z0-9]+)$/i);if(t)return{name:"split",id:t[1]};const r=e.match(/^#\/pay\/([A-Za-z0-9_-]+)$/);return r?{name:"pay",encoded:r[1]}:{name:"notfound"}}function R(e){location.hash===e?D():location.hash=e}function _n(e){be(e),R(`#/split/${e.id}`)}function Tn(e,t){const l=U().find(s=>s.id===e.id);if(!l)return;const o=l.participants.find(s=>s.id===t);o&&(o.paid=!o.paid,o.paidVia=o.paid?"manual":void 0,o.paidAt=o.paid?new Date().toISOString():void 0,o.txHash=o.paid?o.txHash:void 0,be(l),D())}function Mn(e){const t={...e,id:`${Pt()}${vn()}`.slice(0,11),title:e.title,participants:e.participants.map(r=>({...r,paid:!1,paidVia:void 0,txHash:void 0,paidAt:void 0})),createdAt:new Date().toISOString()};be(t),K("Cloned — a fresh copy with all shares unpaid","success"),R(`#/split/${t.id}`)}function Wn(e){rn(e.id),K("Split deleted","info"),R("#/")}function Ln(){const e=a("button",{type:"button",class:`seg-btn ${E.network==="testnet"?"seg-btn-active":""}`},"Testnet");e.addEventListener("click",()=>void we("testnet"));const t=a("button",{type:"button",class:`seg-btn ${E.network==="mainnet"?"seg-btn-active":""}`},"Mainnet");return t.addEventListener("click",()=>void we("mainnet")),a("header",{class:"app-header"},a("a",{class:"brand",href:"#/"},a("span",{class:"brand-mark","aria-hidden":"true"},"◐"),a("span",{class:"brand-name"},"Near",a("span",{class:"brand-accent"},"Split"))),a("div",{class:"header-right"},a("div",{class:"seg",role:"group","aria-label":"Network"},e,t),E.signedIn&&E.accountId?a("span",{class:"net-badge"},Te(E.accountId)):a("span",{class:"net-badge net-badge-off"},"Not connected")))}function On(){return a("footer",{class:"app-footer"},a("p",{},"NearSplit splits bills in NEAR. Payments go wallet-to-wallet on the NEAR blockchain — NearSplit never sees your keys."),a("p",{class:"muted small"},"Splits are stored only on this device. Pay links contain the bill details, so treat them like the bill itself."))}function Rn(e){e.append(An(E,{onConnect:()=>void Ee(),onSignOut:Nn,connectBusy:Ce}));const t=a("button",{type:"button",class:"btn btn-primary btn-block"},"+ Create a split");t.addEventListener("click",()=>R("#/create")),e.append(t),e.append(a("h2",{class:"section-title splits-heading"},"My splits"));const r=U();if(r.length===0)e.append(a("div",{class:"card empty-state"},a("div",{class:"empty-emoji","aria-hidden":"true"},"🧾"),a("h3",{},"No splits yet"),a("p",{class:"muted"},"Split a dinner, a taxi, or the rent. Everyone gets a personal pay link and pays their share in NEAR in one tap.")));else{const l=a("div",{class:"split-list"});for(const o of r)l.append(Cn(o,s=>R(`#/split/${s}`)));e.append(l)}e.append(Sn())}function D(){if(!ge)return;Lt(ge);const e=$n(),t=a("main",{class:"app-main",id:"main"});switch(ge.append(Ln(),t,On()),e.name){case"home":Rn(t);break;case"create":t.append(En(E,_n,()=>R("#/")));break;case"split":{const r=U().find(l=>l.id===e.id);if(!r){t.append(a("div",{class:"card empty-state"},a("h3",{},"Split not found"),a("p",{class:"muted"},"This split is not stored on this device. Splits live in this browser only — open NearSplit on the device where you created it."),(()=>{const l=a("button",{type:"button",class:"btn btn-primary"},"Go to my splits");return l.addEventListener("click",()=>R("#/")),l})()));break}t.append(In(r,{onTogglePaid:Tn,onClone:Mn,onDelete:Wn,onBack:()=>R("#/")}));break}case"pay":{const r=bn(e.encoded);if(!r){t.append(a("div",{class:"card empty-state"},a("h3",{},"This pay link looks broken"),a("p",{class:"muted"},"The link may have been cut off while sharing. Ask the organizer to copy and send it again."),(()=>{const l=a("button",{type:"button",class:"btn btn-primary"},"Go to my splits");return l.addEventListener("click",()=>R("#/")),l})()));break}t.append(Pn(r,E,{onBack:()=>R("#/"),onConnect:()=>{E.network!==r.net?we(r.net).then(()=>Ee()):Ee()},onSwitchNetwork:()=>void we(r.net),refreshWallet:ve}));break}default:t.append(a("div",{class:"card empty-state"},a("h3",{},"Page not found"),a("p",{class:"muted"},"This address does not match any NearSplit page.")))}window.scrollTo({top:0})}D();window.addEventListener("hashchange",D);ve();
