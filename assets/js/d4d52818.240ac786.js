"use strict";(self.webpackChunkl_1_l_blog=self.webpackChunkl_1_l_blog||[]).push([[4302],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),s=p(n),d=i,m=s["".concat(c,".").concat(d)]||s[d]||f[d]||a;return n?r.createElement(m,o(o({ref:t},u),{},{components:n})):r.createElement(m,o({ref:t},u))}));function d(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=s;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var p=2;p<a;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},9951:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return o},default:function(){return f},frontMatter:function(){return a},metadata:function(){return l},toc:function(){return p}});var r=n(3117),i=(n(7294),n(3905));const a={title:"Git-Day1"},o=void 0,l={unversionedId:"Software/Git/Git-Day1",id:"Software/Git/Git-Day1",title:"Git-Day1",description:"\u521b\u5efa\u7248\u672c\u5e93",source:"@site/docs/Software/Git/Git-Day1.md",sourceDirName:"Software/Git",slug:"/Software/Git/Git-Day1",permalink:"/Software/Git/Git-Day1",draft:!1,tags:[],version:"current",frontMatter:{title:"Git-Day1"},sidebar:"tutorialSidebar",previous:{title:"\u6211\u7684\u7b2c\u4e00\u4e2aVue\u7ec3\u624b\u9879\u76ee",permalink:"/Software/Frontend/\u6211\u7684-\u7b2c\u4e00\u4e2a-Vue\u7ec3\u624b\u9879\u76ee"},next:{title:"Git-Day2",permalink:"/Software/Git/Git-Day2"}},c={},p=[{value:"\u521b\u5efa\u7248\u672c\u5e93",id:"\u521b\u5efa\u7248\u672c\u5e93",level:3},{value:"\u65f6\u5149\u673a\u7a7f\u68ad",id:"\u65f6\u5149\u673a\u7a7f\u68ad",level:3}],u={toc:p};function f(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h3",{id:"\u521b\u5efa\u7248\u672c\u5e93"},"\u521b\u5efa\u7248\u672c\u5e93"),(0,i.kt)("p",null,"\u9009\u62e9\u4e00\u4e2a\u5408\u9002\u7684\u5730\u65b9\uff0c\u521b\u5efa\u4e00\u4e2a\u7a7a\u76ee\u5f55\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"$ mkdir learngit\n$ cd learngit\n$ pwd\n")),(0,i.kt)("p",null,"\u521d\u59cb\u5316\u4e00\u4e2aGit\u4ed3\u5e93\uff0c\u4f7f\u7528",(0,i.kt)("inlineCode",{parentName:"p"},"git init"),"\u547d\u4ee4\u3002"),(0,i.kt)("p",null,"\u6dfb\u52a0\u6587\u4ef6\u5230Git\u4ed3\u5e93\uff0c\u5206\u4e24\u6b65\uff1a"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"\u4f7f\u7528\u547d\u4ee4",(0,i.kt)("inlineCode",{parentName:"li"},"git add "),"\uff0c\u6ce8\u610f\uff0c\u53ef\u53cd\u590d\u591a\u6b21\u4f7f\u7528\uff0c\u6dfb\u52a0\u591a\u4e2a\u6587\u4ef6\uff1b"),(0,i.kt)("li",{parentName:"ol"},"\u4f7f\u7528\u547d\u4ee4",(0,i.kt)("inlineCode",{parentName:"li"},"git commit -m "),"\uff0c\u5b8c\u6210\u3002")),(0,i.kt)("h3",{id:"\u65f6\u5149\u673a\u7a7f\u68ad"},"\u65f6\u5149\u673a\u7a7f\u68ad"),(0,i.kt)("p",null,"\u8981\u968f\u65f6\u638c\u63e1\u5de5\u4f5c\u533a\u7684\u72b6\u6001\uff0c\u4f7f\u7528",(0,i.kt)("inlineCode",{parentName:"p"},"git status"),"\u547d\u4ee4\u3002"),(0,i.kt)("p",null,"\u5982\u679c",(0,i.kt)("inlineCode",{parentName:"p"},"git status"),"\u544a\u8bc9\u4f60\u6709\u6587\u4ef6\u88ab\u4fee\u6539\u8fc7\uff0c\u7528",(0,i.kt)("inlineCode",{parentName:"p"},"git diff"),"\u53ef\u4ee5\u67e5\u770b\u4fee\u6539\u5185\u5bb9\u3002"),(0,i.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"\u8fd9\u662f\u4e00\u7bc7\u4eceHexo\u8fc1\u79fb\u7684\u6587\u7ae0\uff0c\u521b\u5efa\u4e8e2020-02-07 04:56:57"))))}f.isMDXComponent=!0}}]);