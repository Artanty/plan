(self.webpackChunkwebHost=self.webpackChunkwebHost||[]).push([[488],{3488:(ue,x,P)=>{function v(e,r){return Object.is(e,r)}P.r(x),P.d(x,{REACTIVE_NODE:()=>d,SIGNAL:()=>l,SIGNAL_NODE:()=>k,consumerAfterComputation:()=>T,consumerBeforeComputation:()=>y,consumerDestroy:()=>L,consumerMarkDirty:()=>O,consumerPollProducersForChange:()=>E,createComputed:()=>q,createSignal:()=>z,createWatch:()=>X,defaultEquals:()=>v,getActiveConsumer:()=>M,isInNotificationPhase:()=>F,isReactive:()=>G,producerAccessed:()=>p,producerNotifyConsumers:()=>I,producerUpdateValueVersion:()=>C,producerUpdatesAllowed:()=>g,setActiveConsumer:()=>N,setAlternateWeakRefImpl:()=>Z,setPostSignalSetFn:()=>J,setThrowInvalidWriteToSignalError:()=>B,signalSetFn:()=>U,signalUpdateFn:()=>K});let n=null,c=!1,f=1;const l=Symbol("SIGNAL");function N(e){const r=n;return n=e,r}function M(){return n}function F(){return c}function G(e){return void 0!==e[l]}const d={version:0,lastCleanEpoch:0,dirty:!1,producerNode:void 0,producerLastReadVersion:void 0,producerIndexOfThis:void 0,nextProducerIndex:0,liveConsumerNode:void 0,liveConsumerIndexOfThis:void 0,consumerAllowSignalWrites:!1,consumerIsAlwaysLive:!1,producerMustRecompute:()=>!1,producerRecomputeValue:()=>{},consumerMarkedDirty:()=>{},consumerOnSignalRead:()=>{}};function p(e){if(c)throw new Error("");if(null===n)return;n.consumerOnSignalRead(e);const r=n.nextProducerIndex++;s(n),r<n.producerNode.length&&n.producerNode[r]!==e&&a(n)&&h(n.producerNode[r],n.producerIndexOfThis[r]),n.producerNode[r]!==e&&(n.producerNode[r]=e,n.producerIndexOfThis[r]=a(n)?V(e,n,r):0),n.producerLastReadVersion[r]=e.version}function C(e){if((!a(e)||e.dirty)&&(e.dirty||e.lastCleanEpoch!==f)){if(!e.producerMustRecompute(e)&&!E(e))return e.dirty=!1,void(e.lastCleanEpoch=f);e.producerRecomputeValue(e),e.dirty=!1,e.lastCleanEpoch=f}}function I(e){if(void 0===e.liveConsumerNode)return;const r=c;c=!0;try{for(const t of e.liveConsumerNode)t.dirty||O(t)}finally{c=r}}function g(){return!1!==n?.consumerAllowSignalWrites}function O(e){e.dirty=!0,I(e),e.consumerMarkedDirty?.(e)}function y(e){return e&&(e.nextProducerIndex=0),N(e)}function T(e,r){if(N(r),e&&void 0!==e.producerNode&&void 0!==e.producerIndexOfThis&&void 0!==e.producerLastReadVersion){if(a(e))for(let t=e.nextProducerIndex;t<e.producerNode.length;t++)h(e.producerNode[t],e.producerIndexOfThis[t]);for(;e.producerNode.length>e.nextProducerIndex;)e.producerNode.pop(),e.producerLastReadVersion.pop(),e.producerIndexOfThis.pop()}}function E(e){s(e);for(let r=0;r<e.producerNode.length;r++){const t=e.producerNode[r],u=e.producerLastReadVersion[r];if(u!==t.version||(C(t),u!==t.version))return!0}return!1}function L(e){if(s(e),a(e))for(let r=0;r<e.producerNode.length;r++)h(e.producerNode[r],e.producerIndexOfThis[r]);e.producerNode.length=e.producerLastReadVersion.length=e.producerIndexOfThis.length=0,e.liveConsumerNode&&(e.liveConsumerNode.length=e.liveConsumerIndexOfThis.length=0)}function V(e,r,t){if(D(e),s(e),0===e.liveConsumerNode.length)for(let u=0;u<e.producerNode.length;u++)e.producerIndexOfThis[u]=V(e.producerNode[u],e,u);return e.liveConsumerIndexOfThis.push(t),e.liveConsumerNode.push(r)-1}function h(e,r){if(D(e),s(e),1===e.liveConsumerNode.length)for(let u=0;u<e.producerNode.length;u++)h(e.producerNode[u],e.producerIndexOfThis[u]);const t=e.liveConsumerNode.length-1;if(e.liveConsumerNode[r]=e.liveConsumerNode[t],e.liveConsumerIndexOfThis[r]=e.liveConsumerIndexOfThis[t],e.liveConsumerNode.length--,e.liveConsumerIndexOfThis.length--,r<e.liveConsumerNode.length){const u=e.liveConsumerIndexOfThis[r],i=e.liveConsumerNode[r];s(i),i.producerIndexOfThis[u]=r}}function a(e){return e.consumerIsAlwaysLive||(e?.liveConsumerNode?.length??0)>0}function s(e){e.producerNode??=[],e.producerIndexOfThis??=[],e.producerLastReadVersion??=[]}function D(e){e.liveConsumerNode??=[],e.liveConsumerIndexOfThis??=[]}function q(e){const r=Object.create(j);r.computation=e;const t=()=>{if(C(r),p(r),r.value===m)throw r.error;return r.value};return t[l]=r,t}const S=Symbol("UNSET"),R=Symbol("COMPUTING"),m=Symbol("ERRORED"),j={...d,value:S,dirty:!0,error:null,equal:v,producerMustRecompute:e=>e.value===S||e.value===R,producerRecomputeValue(e){if(e.value===R)throw new Error("Detected cycle in computations.");const r=e.value;e.value=R;const t=y(e);let u;try{u=e.computation()}catch(i){u=m,e.error=i}finally{T(e,t)}r!==S&&r!==m&&u!==m&&e.equal(r,u)?e.value=r:(e.value=u,e.version++)}};let W=function H(){throw new Error};function b(){W()}function B(e){W=e}let w=null;function z(e){const r=Object.create(k);r.value=e;const t=()=>(p(r),r.value);return t[l]=r,t}function J(e){const r=w;return w=e,r}function U(e,r){g()||b(),e.equal(e.value,r)||(e.value=r,function Q(e){e.version++,function _(){f++}(),I(e),w?.()}(e))}function K(e,r){g()||b(),U(e,r(e.value))}const k={...d,equal:v,value:void 0};function X(e,r,t){const u=Object.create(Y);t&&(u.consumerAllowSignalWrites=!0),u.fn=e,u.schedule=r;const i=o=>{u.cleanupFn=o};return u.ref={notify:()=>O(u),run:()=>{if(null===u.fn)return;if(F())throw new Error("Schedulers cannot synchronously execute watches while scheduling.");if(u.dirty=!1,u.hasRun&&!E(u))return;u.hasRun=!0;const o=y(u);try{u.cleanupFn(),u.cleanupFn=A,u.fn(i)}finally{T(u,o)}},cleanup:()=>u.cleanupFn(),destroy:()=>function ee(o){(function $(o){return null===o.fn&&null===o.schedule})(o)||(L(o),o.cleanupFn(),o.fn=null,o.schedule=null,o.cleanupFn=A)}(u),[l]:u},u.ref}const A=()=>{},Y={...d,consumerIsAlwaysLive:!0,consumerAllowSignalWrites:!1,consumerMarkedDirty:e=>{null!==e.schedule&&e.schedule(e.ref)},hasRun:!1,cleanupFn:A};function Z(e){}}}]);