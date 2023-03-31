(function(r,f,l,E){"use strict";const S=E.findByProps("getRelationships","isBlocked"),c=f.FluxDispatcher._actionHandlers._orderedActionHandlers,t="HideBlockedMessages";function p(e,u){let o={id:"",type:0,content:"",channel_id:u.id,author:{id:"",username:"",avatar:"",discriminator:"",publicFlags:0,avatarDecoration:null},attachments:[],embeds:[],mentions:[],mention_roles:[],pinned:!1,mention_everyone:!1,tts:!1,timestamp:"",edited_timestamp:null,flags:0,components:[]};return typeof e=="string"?o.content=e:o={...o,...e},o}const d=function(e){return S.isBlocked(e)};let i=[],s=0;const g=3,m=function(){try{s++,console.log(`${t} Delayed start attempt ${s}/${g}.`);const e=l.before("actionHandler",c.LOAD_MESSAGES_SUCCESS?.find(function(n){return n.name==="MessageStore"}),function(n){let a=n[0].messages.filter(function(_){return!d(_?.author?.id)});n[0].messages=a});i.push(e);const u=l.before("actionHandler",c.MESSAGE_UPDATE?.find(function(n){return n.name==="MessageStore"}),function(n){let a=n[0].message;d(a?.author?.id)&&(n[0].message={})});i.push(u);const o=l.before("actionHandler",c.MESSAGE_CREATE?.find(function(n){return n.name==="MessageStore"}),function(n){let a=n[0].message;d(a?.author?.id)&&(n[0].message={})});return i.push(o),console.log(`${t} loaded.`),null}catch(e){console.log(`[${t} Error]`,e),s<g?(console.warn(`${t} failed to start. Trying again in ${s}0s.`),setTimeout(m,s*1e4)):console.error(`${t} failed to start. Giving up.`)}};var h={onLoad:function(){console.log(`Loading ${t}...`);for(let e of["MESSAGE_CREATE","MESSAGE_UPDATE"])console.log(`Dispatching ${e} to enable action handler.`),f.FluxDispatcher.dispatch({type:e,message:p("PLACEHOLDER",{id:"0"})});setTimeout(function(){return m()},300)},onUnload:function(){console.log(`Unloading ${t}...`);for(let e of i)e();console.log(`${t} unloaded.`)}};return r.default=h,Object.defineProperty(r,"__esModule",{value:!0}),r})({},vendetta.metro.common,vendetta.patcher,vendetta.metro);
