if(!self.define){let e,s={};const n=(n,t)=>(n=new URL(n+".js",t).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(t,i)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let c={};const r=e=>n(e,a),o={module:{uri:a},exports:c,require:r};s[a]=Promise.all(t.map((e=>o[e]||r(e)))).then((e=>(i(...e),c)))}}define(["./workbox-1846d813"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/VFBmj4YsKE-X6YOntmqBr/_buildManifest.js",revision:"VFBmj4YsKE-X6YOntmqBr"},{url:"/_next/static/VFBmj4YsKE-X6YOntmqBr/_middlewareManifest.js",revision:"VFBmj4YsKE-X6YOntmqBr"},{url:"/_next/static/VFBmj4YsKE-X6YOntmqBr/_ssgManifest.js",revision:"VFBmj4YsKE-X6YOntmqBr"},{url:"/_next/static/chunks/855.8865a3c2c000c5e3.js",revision:"VFBmj4YsKE-X6YOntmqBr"},{url:"/_next/static/chunks/framework-686549ad788ffa49.js",revision:"VFBmj4YsKE-X6YOntmqBr"},{url:"/_next/static/chunks/main-72033e26267bc22a.js",revision:"VFBmj4YsKE-X6YOntmqBr"},{url:"/_next/static/chunks/pages/_app-a06b6cda6a92b970.js",revision:"VFBmj4YsKE-X6YOntmqBr"},{url:"/_next/static/chunks/pages/_error-a3f18418a2205cb8.js",revision:"VFBmj4YsKE-X6YOntmqBr"},{url:"/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",revision:"VFBmj4YsKE-X6YOntmqBr"},{url:"/_next/static/chunks/webpack-48fa345e6f9fb0df.js",revision:"VFBmj4YsKE-X6YOntmqBr"},{url:"/_next/static/css/a2874f5a90f996d8.css",revision:"VFBmj4YsKE-X6YOntmqBr"},{url:"/favicon.ico",revision:"ed43acf35482486cbb9799fc9d0c4f04"},{url:"/icons/favicon-16x16.png",revision:"02488f4f1b213c3ad501410da4b2218c"},{url:"/icons/favicon-32x32.png",revision:"98608a084142a3f8a50286cc7aa7ca5e"},{url:"/icons/icon-180x180.png",revision:"5f1736494390e4b7e9cbf1eefa3c6929"},{url:"/icons/icon-192x192.png",revision:"43391fb51c7f7d86e92d819b9f03ae28"},{url:"/icons/icon-512x512.png",revision:"ffe37d544fdd8e061c43620606df5409"},{url:"/manifest.json",revision:"33a0bd3bc8cdefe7b0522a66fcc4bea2"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
