(function(l,f,u,p,o){"use strict";const S=p.findByProps("getRelationships","isBlocked"),c=f.FluxDispatcher._actionHandlers._orderedActionHandlers,t="HideBlockedMessages";function h(e,g){let r={id:"",type:0,content:"",channel_id:g.id,author:{id:"",username:"",avatar:"",discriminator:"",publicFlags:0,avatarDecoration:null},attachments:[],embeds:[],mentions:[],mention_roles:[],pinned:!1,mention_everyone:!1,tts:!1,timestamp:"",edited_timestamp:null,flags:0,components:[]};return typeof e=="string"?r.content=e:r={...r,...e},r}const d=function(e){return S.isBlocked(e)};let s=[],a=0;const m=3,E=function(){try{a++,o.logger.log(`${t} Delayed start attempt ${a}/${m}.`);const e=u.before("actionHandler",c.LOAD_MESSAGES_SUCCESS?.find(function(n){return n.name==="MessageStore"}),function(n){let i=n[0].messages.filter(function($){return!d($?.author?.id)});n[0].messages=i});s.push(e);const g=u.before("actionHandler",c.MESSAGE_UPDATE?.find(function(n){return n.name==="MessageStore"}),function(n){let i=n[0].message;d(i?.author?.id)&&(n[0].message={})});s.push(g);const r=u.before("actionHandler",c.MESSAGE_CREATE?.find(function(n){return n.name==="MessageStore"}),function(n){let i=n[0].message;d(i?.author?.id)&&(n[0].message={})});return s.push(r),o.logger.log(`${t} loaded.`),null}catch(e){o.logger.log(`[${t} Error]`,e),a<m?(console.warn(`${t} failed to start. Trying again in ${a}0s.`),setTimeout(E,a*1e4)):console.error(`${t} failed to start. Giving up.`)}};var A={onLoad:function(){o.logger.log(`Loading ${t}...`);for(let e of["MESSAGE_CREATE","MESSAGE_UPDATE"])o.logger.log(`Dispatching ${e} to enable action handler.`),f.FluxDispatcher.dispatch({type:e,message:h("PLACEHOLDER",{id:"0"})});setTimeout(function(){return E()},300)},onUnload:function(){o.logger.log(`Unloading ${t}...`);for(let e of s)e();o.logger.log(`${t} unloaded.`)}};return l.default=A,Object.defineProperty(l,"__esModule",{value:!0}),l})({},vendetta.metro.common,vendetta.patcher,vendetta.metro,vendetta);