const n=`---\r
title: JS小知识\r
category: 前端\r
category-id: frontend\r
blog: JavaScript\r
blog-id: javascript\r
slug: JS-tips\r
date: 2026-3-26\r
lastUpdated: 2026-3-26\r
---\r
\r
# JS 小知识\r
\r
## 简介\r
\r
本文用于写一些 JavaScript 中的小知识。怎么个小法呢？目前想到两种情况，第一种是一些小的知识点，不至于用一篇单独文章的体量来写。第二种呢是一些大的知识点，详细剖析的话完全可以放到单独文章，但是鉴于个人能力和经验不足，先写到这里做一个简介，等择日我有能力去把它说清楚的时候，再另起炉灶单独成文。\r
\r
### 1.typeof null\r
\r
我们的第一条是什么呢？当然的最经典的 typeof null 啦。\r
JS 中有这样一个情况：\r
\r
\`\`\`\r
 console.log(typeof null); // "object"\r
\`\`\`\r
\r
这不明摆着是错的吗？但是在 JavaScript 中，这就是标准定义。原因是什么呢，我们要从历史说起。\r
在最初的 JS 引擎中，各类值在底层用二进制表示类型：\r
| 类型 | 类型标记 |\r
| --------- | ----- |\r
| object | \`000\` |\r
| number | \`001\` |\r
| string | \`010\` |\r
| boolean | \`011\` |\r
| undefined | \`100\` |\r
\r
而 null 的底层值为 00000000，其前三位 000 和 object 的标记重复，JS 引擎在判断时就会把 null 误判为 object。也就说，这本质是 JS 早期的一个 bug。\r
那么后来为什么不修呢 😡？\r
因为许多就代码已经遵从了这个逻辑，例如：\r
\r
\`\`\`\r
if (typeof value === "object") {\r
  // 旧代码默认包含 null\r
}\r
\`\`\`\r
\r
程序员可能使用上面一段代码来同时选中对象和 null，而这段代码可能已经被用在了许多大型项目中。修改 null 的类型判断的话可能导致更多错误。\r
于是在之后，JS 标准委员会将错就错，把这个 bug 变为了 JS 的规范。\r
所以时至今日，甚至以后，JS 中的 typeof null 都要被错认为 object 了。\r
\r
那么如果我们想区分 null 和 object 怎么办，也很简单，直接判断\r
\r
\`\`\`\r
if(value === null)\r
\`\`\`\r
\r
值是不是 null 就好了。\r
\r
附.JS 中所有 typeof 返回值\r
\r
\`\`\`\r
typeof 1          // "number"\r
typeof "hello"    // "string"\r
typeof true       // "boolean"\r
typeof undefined  // "undefined"\r
typeof Symbol()   // "symbol"\r
typeof function(){} // "function"\r
typeof {}         // "object"\r
typeof null       // "object"\r
\`\`\`\r
\r
PS. typeof NaN === "number"\r
\r
### 2. 0.1 + 0.2\r
\r
如果你随便打开一个浏览器，再按 Ctrl + Shift + C 打开 DevTool，输入 console.log(0.1+0.2)，你会发现输出值是 0.30000000000000004，而不是 0.3.这是为什么呢？\r
这是因为 JS 中 number 的类型是 IEEE 754 双精度浮点数。\r
IEEE 754 是 IEEE 在 1985 年制定的国际标准，用于统一浮点数的表示方法。而计算机要表示小数，当然也必须转换成二进制。那么小数和二进制之间如何转换呢，遵循的原则叫做乘 2 取整，例如：\r
\r
0.625 × 2 = 1.25 → 取整数 1\r
\r
0.25 × 2 = 0.5 → 取整数 0\r
\r
0.5 × 2 = 1.0 → 取整数 1\r
\r
那么最终结果就是：0.625 = 0.101 (二进制)\r
`;export{n as default};
