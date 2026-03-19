const r=`---\r
title: 算法复杂度\r
category: 后端与算法\r
category-id: backend-and-algorithm\r
blog: 算法基础\r
blog-id: basic-algorithm\r
slug: big-o-notation\r
date: 2026-1-8\r
lastUpdated: 2026-1-9\r
---\r
\r
# 算法复杂度 （Big O notation）\r
\r
## 一.为什么叫 Big O notation\r
\r
在数学中，大 O 是一种渐近记号（asymptotic notation），用来描述：\r
一个函数在某个极限下，被另一个函数“控制增长速度”的关系。\r
\r
### 标准定义\r
\r
设函数 f(x), g(x) 在点 a 的某个去心邻域内有定义。\r
若存在常数 C > 0 和 δ > 0，使得当\r
\r
0 < |x - a| < δ\r
\r
时有\r
\r
|f(x)| ≤ C · |g(x)|\r
\r
则称\r
\r
f(x) = O(g(x)) (x → a)\r
\r
### 如何理解\r
\r
在基础运用层面上可以这样理解：\r
\r
f(x) = O(g(x)) 等价于\r
f(x)的增长速度不超过 g(x)的常数倍\r
\r
举例说明就是：\r
\r
3x² + 5x + 7 = O(x²) (x → ∞)\r
\r
x 趋近于无穷时，左式大小不超过 x^2 的某个常数倍。也就是说它的增长速度局限于 x^2 的维度上。\r
泰勒展开式中的皮亚诺余项一般用高阶无穷小表示（也就是小 o），但在工程领域中也常用大 O 来表示。\r
\r
## 计算机领域中的大 O\r
\r
计算机中可以使用大 O 来表示多种复杂度，如时间复杂度、空间复杂度、IO 复杂度等。这里主要介绍时间复杂度，因为在大部分应用场景下，时间复杂度最为关键（且本人目前也不太懂其他复杂度 😁）。但是使用大 O 来描述复杂度的思路是通用的，在计算机领域中的大 O 不苛求数学领域中的严谨性，更多是使用大 O 来大体描绘出算法复杂度随输入数据量的变化。\r
\r
### O(1)\r
\r
最低的复杂度，表示算法的的复杂度为某个常量，与数据量无关。\r
\r
### O(n^x)\r
\r
表示算法的复杂度随数据量的增长趋势类似幂函数。比如循环遍历一个数组就是 O(n)，嵌套两重循环遍历就是 O(n^2)，嵌套三重就是 O(n^3)。\r
\r
### O(log n)\r
\r
表示算法的复杂度随数据量的增长趋势类似对数函数。典型算法为二分查找(Binary Search)，数据每次对半分。由对数函数增长趋势克制，对大数据量友好。\r
聪明的你可能会好奇，这个 log n 没写底数啊，是 log 多少的 n 呢？其实这就是前文所说大 O 在复杂度的表示上不追求过分精确的原因，表达出趋势即可。而不论你 log 的底数是多少，由换底公式可知，他们的相差只会是一个常数倍，与输入的 n 无关，而大 O 并不关心常数倍的差距。所以不论你是每次对数据进行二分还是三分（当然三分不会用在查找中），可能具体运算次数不同，但复杂度的增长都是形似对数函数，底数并不重要，所以写作 log n 即可。\r
\r
### O(n log n)\r
\r
算法复杂度相当于一次幂乘以对数函数。所以也就是在做二分的同时加入遍历。典型算法归并排序(Merge Sort)。\r
\r
\`\`\`\r
function mergeSort(arr) {\r
  // 递归终止条件\r
  if (arr.length <= 1) {\r
    return arr;\r
  }\r
\r
  // 分割数组\r
  const mid = Math.floor(arr.length / 2);\r
  const left = arr.slice(0, mid);\r
  const right = arr.slice(mid);\r
\r
  // 递归排序并合并\r
  return merge(\r
    mergeSort(left),\r
    mergeSort(right)\r
  );\r
}\r
\r
  //合并两个已排序数组\r
\r
function merge(left, right) {\r
  let result = [];\r
  let i = 0, j = 0;\r
\r
  // 比较并合并\r
  while (i < left.length && j < right.length) {\r
    if (left[i] <= right[j]) {\r
      result.push(left[i]);\r
      i++;\r
    } else {\r
      result.push(right[j]);\r
      j++;\r
    }\r
  }\r
\r
  // 拼接剩余元素(此处不懂为什么要concat一下的话，模拟一下上一步你就懂了)\r
  return result\r
    .concat(left.slice(i))\r
    .concat(right.slice(j));\r
}\r
\r
\`\`\`\r
\r
### O(2^n)\r
\r
指数级增长。典型算法是递归求斐波那契数列的项。\r
\r
\`\`\`\r
function fibRecursive(n) {\r
  if (n === 0) return 0;\r
  if (n === 1) return 1;\r
  return fibRecursive(n - 1) + fibRecursive(n - 2);\r
}\r
\`\`\`\r
\r
ps.性能被不用递归的方法吊打\r
\r
\`\`\`\r
function fibIterative(n) {\r
  if (n === 0) return 0;\r
\r
  let prev = 0;\r
  let curr = 1;\r
\r
  for (let i = 2; i <= n; i++) {\r
    const next = prev + curr;\r
    prev = curr;\r
    curr = next;\r
  }\r
\r
  return curr;\r
}\r
\r
\`\`\`\r
\r
### O(n!)\r
\r
增长速度为阶乘，增长最快，对大数据极不友好。典型算法：生成全排列。\r
\r
## 总结\r
\r
慎用 O(n!)和 O(2^n)的高复杂度算法，但不是永远不能用。复杂度仅是一个指标，仍需要结合复杂的实际情况来选取算法。\r
`;export{r as default};
