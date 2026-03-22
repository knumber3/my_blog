const r=`---\r
title: JavaScript中的Promise\r
category: 前端\r
category-id: frontend\r
blog: JavaScript\r
blog-id: javascript\r
slug: what-is-Promise\r
date: 2026-3-17\r
lastUpdated: 2026-3-23\r
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
在 new Promise 时，Promise 构造函数需要接收一个函数参数，这个参数在 Promise 中叫 executor。这个 executor 在 Promise 被创建时就会被马上执行。\r
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
\r
#### resolve 和 reject\r
\r
作为对象，Promise 包含许多方法，分为静态方法和实例方法。静态方法是 Promise 构造函数使用的方法（函数在 JavaScript 中也是一种对象），实例方法是创建出来的 Promise 对象使用的方法。\r
\r
先来讲两个最重要的静态方法：resolve 和 reject。\r
在上面举例的 Promise 创建代码中，可以看到在 executor 的参数中，resolve 和 reject 都被传入了，因为这两个函数的后续使用对于 Promise 的运行至关重要。\r
\r
\`\`\`\r
const promise = new Promise((resolve, reject) => {\r
  let success = true;\r
  fn1();\r
  if (success) {\r
    resolve("成功了"); //调用resolve\r
  } else {\r
    reject("失败了");  //调用reject\r
  }\r
});\r
\`\`\`\r
\r
在这段简单的示例代码中，我们可以把 fn1()看作是我们需要执行的异步函数，例如 fn1()的作用是向服务器请求数据并返回，而 success 是 fn1()是否成功的指示器，由 fn1()控制。\r
那么在 resolve 执行的时候，会发生以下几件事： 1.把 PromiseState 改变为 fulfilled 2.把 PromiseResult 改为 resolve 接收的参数(在例子中即为“成功了”)\r
如果将“成功了”改为其他内容，例如替换成 fn1()返回的数据，那么这些数据就会存储到 PromiseResult 中。\r
而在 reject 执行时，对应地： 1.把 PromiseState 改变为 rejected 2.把 PromiseResult 改为 reject 接收的参数(在例子中即为“失败了”)\r
如果将“失败了”改为其他内容，例如替换成 fn1()失败时的报错，那么这些报错就会存储到 PromiseResult 中。\r
\r
也就是说，Internal Slots 中的 PromiseState 和 PromiseResult 的状态变化由 resolve 和 reject 来决定。\r
函数执行成功时 => 调用 resolve => PromiseState 改变为成功(即 fulfilled) => PromiseResult 存储成功时的返回值\r
函数执行失败时 => 调用 reject => PromiseState 改变为失败(即 rejected) => PromiseResult 存储失败时的返回值\r
捋清楚这个逻辑后，我们就弄懂了 Promise 的第一步运作：把需要执行的任务放到 Promise 中，根据执行情况改变 Promise 状态并存储结果。\r
\r
#### then 和 catch\r
\r
接下来，在 Promise 的状态变化以后，我们就需要根据 PromiseState 和 PromiseResult 的值，进行后续操作，也就是 Promise 链式处理任务序列的实现。这时我们就需要用到 then 和 catch。\r
例如，我们需要用商品数据渲染一个网购页面，但是商品数据需要实时向后端请求，那么就可以把数据请求放到 Promise 中，然后用 then 和 catch 执行渲染 html 的动作。\r
我们用一段简单的代码来说明：\r
\r
\`\`\`\r
function getData(success) {\r
  return new Promise((resolve, reject) => {\r
    if (success) {\r
      resolve("拿到数据了");\r
    } else {\r
      reject("出错了");\r
    }\r
  });\r
}\r
\`\`\`\r
\r
先定义一个函数返回一个 Promise，来模拟数据请求的过程。那么拿到数据(或出错)后，就将调用 then 和 catch。\r
\r
\`\`\`\r
getData(true)\r
  .then(result => {\r
    console.log("成功：", result);\r
  })\r
  .catch(error => {\r
    console.log("失败：", error);\r
  });\r
\`\`\`\r
\r
我们可以看出，因为 getData 的返回值是一个 Promise 对象，所以 then 和 catch 是作用在对象实例上的实例方法。而调用 then 和 catch 的时候，我们剩下的两个 Internal Slots，也就是 PromiseFulfillReactions 和 PromiseRejectReactions 该登场了。\r
首先可以看到，then 和 catch 接收的参数都是一个回调函数(也就是例子中我们需要进行的渲染操作)，这个回调函数在 then 和 catch 被调用时就会被注册。then 接收的回调会被保存到 PromiseFulfillReactions 中的 handler 中。catch 接收的回调函数会被保存到 PromiseRejectReactions 的 handler 中。(别急，一会儿解释 handler 是什么)。\r
保存了之后怎么办呢？这就与 Promise 第一步的执行有关了。\r
当 resolve 执行，PromiseState 变为 fulfilled 时，PromiseFulfillReactions 的 handler 中保存的函数就会被执行。\r
反之，当 reject 执行，PromiseState 变为 rejected 时，PromiseRejectReactions 的 handler 中保存的函数就会被执行。\r
而 handler 的参数，如下：\r
\r
\`\`\`\r
.then(result => { //参数result\r
    console.log("成功：", result);\r
  })\r
.catch(error => { //参数error\r
    console.log("失败：", error);\r
  });\r
\`\`\`\r
\r
一个叫 result，一个叫 error。但是名称其实不重要，他们都是一个东西，就是 PromiseResult 的值。\r
\r
总结一下：\r
当 then 被调用时 => then 的回调函数被存入 PromiseFulfillReactions 中的 handler 中 => 等待 Promise 的 resolve 调用 => resolve 执行，改变 PromiseState 和 PromiseResult => 将 PromiseResult 作为参数，执行 handler 中保存的回调函数。\r
当 catch 被调用时 => catch 的回调函数被存入 PromiseRejectReactions 中的 handler 中 => 等待 Promise 的 reject 调用 => reject 执行，改变 PromiseState 和 PromiseResult => 将 PromiseResult 作为参数，执行 handler 中保存的回调函数。\r
\r
注意：then 和 catch 的调用无需等待 Promise 中的进程执行完毕，也就是说，回调函数是先注册后调用，即使后续不被调用也会被注册。\r
\r
PS. handler 其实是名叫 Reaction 的对象的一个属性，而 PromiseFulfillReactions 和 PromiseRejectReactions 中能存储多个 Reaction 对象，一个 Promise 可以并列调用多次 then，每调用一次就会生成一个 Reaction。而 Reaction 中存储的不仅是回调函数，还有多个 Promise 之间的关系。此部分较为复杂，鄙人也不是很明白，所以文中简化表述，暂不展开讨论。\r
\r
#### 其他方法\r
\r
Promise 还有许多其他的方法可供使用，在这里简单列出介绍一下。\r
\r
实例方法：\r
finally：\r
\r
\`\`\`\r
p.finally(callback);\r
\`\`\`\r
\r
无论 Promise 的成功失败都执行 callback 函数。\r
\r
静态方法：\r
1.withResolvers\r
\r
\`\`\`\r
const { promise, resolve, reject } = Promise.withResolvers();\r
\`\`\`\r
\r
创建 Promise 时同时返回 resolve 和 reject，在外部控制 Promise。\r
\r
2.all\r
\r
\`\`\`\r
Promise.all([p1, p2]);\r
\`\`\`\r
\r
两个子 Promise(p1 和 p2)都成功才返回成功，否则返回失败。\r
\r
3.race\r
\r
\`\`\`\r
Promise.race([p1, p2]);\r
\`\`\`\r
\r
p1 和 p2 哪个先完成就使用哪个\r
\r
4.allSettled\r
\r
\`\`\`\r
Promise.allSettled([p1, p2, p3])\r
\`\`\`\r
\r
必定 fulfilled，返回一个数组，说明 p1，p2，p3 的执行情况。\r
例如：\r
\r
\`\`\`\r
[\r
  { status: "fulfilled", value: 1 },\r
  { status: "rejected", reason: "出错" },\r
  { status: "fulfilled", value: 3 }\r
]\r
\`\`\`\r
\r
5.any\r
\r
\`\`\`\r
Promise.any([p1, p2]);\r
\`\`\`\r
\r
p1 和 p2 有一个成功就返回成功，否则返回失败\r
\r
#### 小结\r
\r
到这里，我们已经解决了前两个问题 => 异步和 Promise 的基本结构与运作。那么还剩一个最烧脑的问题 => Promise 的返回值还是一个 Promise 该如何理解。\r
\r
## Promise 的链式调用\r
\r
其实要理解“Promise 的返回值还是一个 Promise”并不难，其关键点就在于 then 的调用。\r
上文提到，then 在调用的时候，会把回调函数存储到 PromiseFulfillReactions 中，在 Promise 被 resolve 时，这个回调函数会被执行。没有提到的是，与此同时一个新的 Promise 会被创建。而这个新 Promise 的运作，和回调函数的返回值挂钩。\r
\r
### 返回值与 newPromise\r
\r
回调函数返回不同值的时候，下一个 promise 会产生不同的状态和结果。\r
\r
1.返回普通值\r
在对回调函数的返回值进行判断时，所有非 Promise 的值都叫做普通值，包括对象、数组、字符串等。\r
\r
\`\`\`\r
Promise.resolve(1)\r
  .then(res => {\r
    return res + 1;\r
  })\r
  .then(res => {\r
    console.log(res); // 2\r
  });\r
\`\`\`\r
\r
在这个例子中，第一个 Promise 的 resolve 的值是 1，那么 1 就会作为参数传入到第一个 then 的回调函数中。而第一个回调函数 res => {return res + 1;}会 return 1+1，也就是 2。\r
2 是数字，是一个普通值，那么这时由第一个 then 创建的 newPromise 中会发生如下变化：\r
PromiseState 变为 fulfilled\r
PromiseResult 变为回调函数的 return 值，也就是 2\r
相当于 newPromise.resolve(2)\r
而这个 2 继续传入下一个 then 的回调，最后使控制台输出 2.\r
\r
2.返回 Promise 值\r
如果 then 的回调返回了一个 Promise 对象，运行过程就会大不相同。例如：\r
\r
\`\`\`\r
Promise.resolve(1)\r
  .then(() => {\r
    return new Promise(resolve => {\r
      setTimeout(() => resolve(100), 1000);\r
    });\r
  })\r
  .then(res => {\r
    console.log(res); // 100（1秒后）\r
  });\r
\`\`\`\r
\r
在这个例子中，第一个 then 注册了一个回调函数，然而这个回调函数的返回值是一个 Promise。那么按之前的逻辑，会出现 resolve 套 Promise 的情况。那么 resolve 能把 Promise 给处理了吗？显然是不能。那么这时 JS 内部就会做一件叫做 Promise Resolution 的事情，内部逻辑类似：\r
\r
\`\`\`\r
const p2 = new Promise((resolve, reject) => {\r
  const result = fn(p1的结果);\r
\r
  if (result 是 Promise) {\r
    result.then(resolve, reject); //关键\r
  } else {\r
    resolve(result);\r
  }\r
});\r
\`\`\`\r
\r
关键的一行在于 result.then(resolve, reject);\r
写详细一些就是：\r
\r
\`\`\`\r
result.then(\r
  value => resolve(value),\r
  error => reject(error)\r
);\r
\`\`\`\r
\r
这一步做的就是把 then 创建的 newPromise 的 resolve 和 reject 的控制权交给回调函数返回的 returnPromise。也就是说，newPromise 的状态与值，将完全取决与函数 return 的 Promise 的结果。JS 将先执行 returnPromise，然后 returnPromise resolve 了什么，那么 newPromise 就 resolve 什么；returnPromise reject 了什么，那么 newPromise 就 reject 什么。\r
\r
PS. 有一种 thenable 的对象，会使 JS 在现在介绍的两种返回值解析方式之间产生错误。thenable 对象，就是包含了名为 then 的方法的非 Promise 对象。常见于你自己定义了一个对象，然后给它定义了一个名为 then 的方法。这样 JS 会把本应按照普通值解析的对象改为使用 Promise 解析，可能产生错误。而 JS 这样设置的原因，在于在 ES6 之前，JS 中没有原生 Promise，那时的 Promise 由各种外部库提供，也就有多种实现。所以 JS 设置了 thenable 对象来兼容所有 Promise。\r
\r
3.回调函数抛出错误\r
\r
\`\`\`\r
Promise.resolve(1)\r
  .then(() => {\r
    throw new Error("fail");\r
  })\r
  .then(\r
    res => console.log(res),\r
    err => console.log(err) // 捕获错误\r
  );\r
\`\`\`\r
\r
回调函数中 throw 了 Error 时，等价于 newPromise 执行了 reject(“fail”)；\r
\r
4.没有 return\r
没有返回值时，newPromise 会变为 fulfilled，但是 PromiseResult 是 undefined。\r
\r
##总结\r
这是本人的第一篇 JS 编程博客，但其实更应该叫做学习笔记。查了很多资料(其实都是 chatGPT 喂我的资料 😋)，看了几个视频，梳理了 Promise 运行的表层逻辑。只求在写的过程和以后没准回来自己看看的时候能有所收获，就十分满足。\r
\r
推荐视频：https://youtu.be/Xs1EMmBLpn4?si=d_sbCuv9TK-cxgEg\r
\r
⬆️ 这个博主讲的真的很好。\r
`;export{r as default};
