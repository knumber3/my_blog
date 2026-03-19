const r=`---\r
title: JavaScript中的Promise\r
category: 前端\r
category-id: frontend\r
blog: JavaScript\r
blog-id: javascript\r
slug: what-is-Promise\r
date: 2026-3-17\r
lastUpdated: 2026-3-17\r
---\r
\r
# JavaScript 中的 Promise\r
\r
## Promise 很烦人\r
\r
一想到 JS 中的 Promise 就很烦。有这么几个烦的点：\r
首先是它用来处理异步操作，沾上异步，就天生带点烦。\r
其次是它有三种状态，两个常用的静态方法和两个对应的实例方法，对于我这种不想去记忆的懒人来说，很烦。\r
而最后，也是最恐怖的是你在学习 Promise 的时候一定听过一句话：“一个 Promise 是一个对象，而 Promise 的返回值还是一个 Promise 对象。”这一句话直接形成嵌套，子子孙孙无穷尽也，把人脑子都烧干。\r
然而，天天一想到 Promise 就烦的感觉实在难受，遂决定今天把它从头到尾捋一遍，不说十分参透，也起码混个略知一二，降低一点它对我大脑的伤害。\r
\r
## Promise 是什么\r
\r
那么，我们首先来看看 ChatGPT 对 Promise 的定义：\r
在 JavaScript 中，Promise（承诺）是一种用于处理异步操作的对象。它可以让你用更清晰、可控的方式来处理“未来才会完成的事情”（比如网络请求、定时器、文件读取等）。\r
\r
这是一个非常泛的概括，我们可以先提取两个关键词：异步、对象。接下来我们就从这两个词逐步入手。\r
\r
## 处理异步\r
\r
在 Promise 出现前，想要 JavaScript 中处理异步的任务序列，需要将异步任务进行嵌套。也就是用回调函数的方式，把后续的异步函数直接包到前面的异步函数里面，导致函数越来越胖，变成所谓“回调地狱”。\r
\r
PS. 关于“回调地狱”，本人知之甚少，让 ChatGPT 举例子它也只会嵌套一堆 SetTimeOut()，这里就不多说明了，感兴趣的可以自行了解了解。\r
\r
而在使用 Promise 之后，异步函数之间可以使用 then 来连接，将嵌套结构变为链式结构，增强了可读性和控制性，并且可以通过一个统一的 catch 集中处理错误。\r
\r
## Promise 基本结构\r
\r
说了那么多，都很空。要了解 Promise 是什么，就必须先了解它基本的结构。首先 Promise 是一个对象，由同名 Promise 构造函数创建。\r
\r
\`\`\`\r
//一个简单的Promise创建\r
const promise = new Promise((resolve, reject) => {\r
  let success = true;\r
\r
  if (success) {\r
    resolve("成功了");\r
  } else {\r
    reject("失败了");\r
  }\r
});\r
\`\`\`\r
\r
### Promise 的内部槽\r
\r
Internal Slots（内部槽）是是 JavaScript 引擎在对象内部维护的一种“隐藏属性”，几乎存在于所有对象当中，例如所有对象都有的 Prototype，数组对象的 ArrayLength。而对于 Promise，有 4 个 Internal Slots 对于其运作非常重要。如下：\r
\r
\`\`\`\r
{\r
  [[PromiseState]]: "pending",\r
  [[PromiseResult]]: undefined,\r
  [[PromiseFulfillReactions]]: [],\r
  [[PromiseRejectReactions]]: []\r
}\r
\`\`\`\r
\r
其中 PromiseState 有 3 种状态：默认 pending、成功 fufilled、失败 rejected。\r
至于这三种状态如何转换，以及 PromiseResult、PromiseFulfillReactions、PromiseRejectReactions 是干什么的，这里先不着急，我们在下文中结合其他知识来说。\r
\r
### Promise 的方法\r
`;export{r as default};
