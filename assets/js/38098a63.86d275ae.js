"use strict";(self.webpackChunkl_1_l_blog=self.webpackChunkl_1_l_blog||[]).push([[6388],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return m}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),u=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=u(e.components);return n.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),f=u(r),m=o,d=f["".concat(l,".").concat(m)]||f[m]||s[m]||a;return r?n.createElement(d,i(i({ref:t},p),{},{components:r})):n.createElement(d,i({ref:t},p))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=f;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var u=2;u<a;u++)i[u]=r[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},8576:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return c},contentTitle:function(){return l},metadata:function(){return u},toc:function(){return p},default:function(){return f}});var n=r(7462),o=r(3366),a=(r(7294),r(3905)),i=["components"],c={title:"\u5982\u4f55\u4f7f\u7528Git\u4ece\u8fdc\u7a0b\u4ed3\u5e93\u83b7\u53d6\u6240\u6709\u5206\u652f"},l=void 0,u={unversionedId:"Software/Git/\u5982\u4f55\u4f7f\u7528Git\u4ece\u8fdc\u7a0b\u4ed3\u5e93\u83b7\u53d6\u6240\u6709\u5206\u652f",id:"Software/Git/\u5982\u4f55\u4f7f\u7528Git\u4ece\u8fdc\u7a0b\u4ed3\u5e93\u83b7\u53d6\u6240\u6709\u5206\u652f",isDocsHomePage:!1,title:"\u5982\u4f55\u4f7f\u7528Git\u4ece\u8fdc\u7a0b\u4ed3\u5e93\u83b7\u53d6\u6240\u6709\u5206\u652f",description:"\u6765\u6e90\uff1aStackoverflow",source:"@site/docs/Software/Git/\u5982\u4f55\u4f7f\u7528Git\u4ece\u8fdc\u7a0b\u4ed3\u5e93\u83b7\u53d6\u6240\u6709\u5206\u652f.md",sourceDirName:"Software/Git",slug:"/Software/Git/\u5982\u4f55\u4f7f\u7528Git\u4ece\u8fdc\u7a0b\u4ed3\u5e93\u83b7\u53d6\u6240\u6709\u5206\u652f",permalink:"/Software/Git/\u5982\u4f55\u4f7f\u7528Git\u4ece\u8fdc\u7a0b\u4ed3\u5e93\u83b7\u53d6\u6240\u6709\u5206\u652f",tags:[],version:"current",frontMatter:{title:"\u5982\u4f55\u4f7f\u7528Git\u4ece\u8fdc\u7a0b\u4ed3\u5e93\u83b7\u53d6\u6240\u6709\u5206\u652f"},sidebar:"tutorialSidebar",previous:{title:"Git-Day3",permalink:"/Software/Git/Git-Day3"},next:{title:"\u5c06\u4e2a\u4eba\u535a\u5ba2\u4eceHexo\u8fc1\u79fb\u5230Docusaurus",permalink:"/Software/\u524d\u7aef/\u4eceHexo\u5230Docusaurus"}},p=[],s={toc:p};function f(e){var t=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},'git branch -r | grep -v \'\\->\' | while read remote; do git branch --track "${remote#origin/}" "$remote"; done\ngit fetch --all\ngit pull --all\n')),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"\u6765\u6e90\uff1aStackoverflow"),(0,a.kt)("p",{parentName:"blockquote"},"\u94fe\u63a5\uff1a",(0,a.kt)("a",{parentName:"p",href:"http://stackoverflow.com/questions/10312521/how-to-fetch-all-git-branches"},"http://stackoverflow.com/questions/10312521/how-to-fetch-all-git-branches"))),(0,a.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"\u8fd9\u662f\u4e00\u7bc7\u4eceHexo\u8fc1\u79fb\u7684\u6587\u7ae0\uff0c\u521b\u5efa\u4e8e2020-03-24 01:00:36"))))}f.isMDXComponent=!0}}]);