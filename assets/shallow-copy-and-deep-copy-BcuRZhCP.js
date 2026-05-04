const n=`---\r
title: 浅拷贝与深拷贝\r
category: 前端\r
category-id: frontend\r
blog: JavaScript\r
blog-id: javascript\r
slug: shallow-copy-and-deep-copy\r
date: 2026-4-8\r
lastUpdated: 2026-5-5\r
---\r
\r
# 浅拷贝与深拷贝\r
\r
## 什么是深浅拷贝？\r
\r
当你想复制一个对象的时候，会出现以下两种情况：\r
\r
\`\`\`\r
const obj1 = {\r
  name: "Tom",\r
  info: {\r
    age: 20\r
  }\r
};\r
\r
const obj2 = { ...obj1 }; // 浅拷贝\r
\r
obj2.name = "Jack";\r
obj2.info.age = 30;\r
\r
console.log(obj1.name);     // Tom\r
console.log(obj1.info.age); // 30\r
\`\`\`\r
\r
在上述代码中，obj2 复制了 obj1，随后改变 obj2 的值，obj.name 没有变化，但是 obj 中的对象值发生了改变。\r
\r
\`\`\`\r
const obj1 = {\r
  name: "Tom",\r
  info: {\r
    age: 20\r
  }\r
};\r
\r
const obj2 = JSON.parse(JSON.stringify(obj1));\r
\r
obj2.info.age = 30;\r
\r
console.log(obj1.info.age); // 20\r
\`\`\`\r
\r
这是第二种情况，我们改变了 obj2 复制 obj1 的方式，之后再改变 obj2 的值，obj1 的值没有再受到影响。\r
\r
这就是**浅拷贝**和**深拷贝**。第一种情况中，obj2 拷贝了 obj1 的内容，但是二者仍然共用一个 info 对象，更改 obj2 的 info 会导致 obj1 的 info 一同被更改，这就是**浅拷贝**。第二种情况，obj2 与 obj1 完全独立开，对 obj2 的更改与 obj1 无关，这就是**深拷贝**。\r
\r
## 浅拷贝的原因\r
\r
深浅拷贝的本质原因在于，JS 在存储基本类型值和存储对象时的逻辑不同。在创建基本类型值时：\r
\r
\`\`\`\r
let a = 10;\r
let b = "hello";\r
\`\`\`\r
\r
变量名 a 和 b 会直接指向值：\r
a → 10\r
b → "hello"\r
\r
而在创建对象时：\r
\r
\`\`\`\r
let obj = { name: "Tom" };\r
\`\`\`\r
\r
变量名不会直接指向对象，而是会通过 Handle(对象句柄)间接指向对象：\r
obj → Handle → { name: "Tom" };\r
\r
Handle 是 JS 中的一个间接指针，相当于一个指针槽，其中存储着对象在堆中的地址。也就是说，obj 并不指向对象，也不指向对象的地址，它只是指向一个指针槽 Handle，其中存储着对象的地址。\r
所以在下述拷贝过程中：\r
\r
\`\`\`\r
const obj1 = {\r
  name: "Tom",\r
  info: {\r
    age: 20\r
  }\r
};\r
\r
const obj2 = { ...obj1 };\r
\`\`\`\r
\r
实际上执行的是：\r
\r
\`\`\`\r
obj2.info = obj1.info;\r
\`\`\`\r
\r
所以 obj2.info 拷贝的不是 obj1 的 info 对象，而是 obj1.info 的 handle 指针槽。而指针槽在拷贝时，会像基本类型值一样直接复制值。也就是说，obj1.info 和 obj2.info 此时其实在共用同一个指针槽。所以当你在更改对象属性时：\r
\r
\`\`\`\r
obj2.info.age = 30;\r
\`\`\`\r
\r
obj1 和 obj2 都会指向同一个对象,更改时产生联动。这就是产生**浅拷贝**的原因。\r
\r
## 解决办法\r
\r
那如果我们不想产生关联，想要一个完全独立的 obj2 怎么办呢？这时候我们就要用到深拷贝。\r
\r
### 常用深拷贝方法\r
\r
#### 1.JSON.parse(JSON.stringify())\r
\r
之前的深拷贝例子中用到了 JSON.parse(JSON.stringify())：\r
\r
\`\`\`\r
const obj2 = JSON.parse(JSON.stringify(obj1));\r
\r
obj2.info.age = 30;\r
\r
console.log(obj1.info.age); // 20\r
\`\`\`\r
\r
这种方法使用 JSON 对原本的对象进行两次转换。JSON.stringify 把 obj1 转换为字符串，再借用 JSON.parse 直接解析创建一个新对象。本质就是借用 JSON 自带的功能来实现新对象创建，从而斩断之前的 handle 连接。\r
但是这种方法也有缺点。因为 JSON 是一种受限制的数据格式，它只支持：\r
number\r
string\r
boolean\r
null\r
array\r
object（纯数据）\r
所以再进行转换时，函数 / Date / Map / Set 等数据就会被丢失，无法通过解析复原。同时，此方法也不支持循环引用：\r
\r
\`\`\`\r
const obj = {};\r
obj.self = obj;\r
\r
JSON.stringify(obj); // 报错\r
\`\`\`\r
\r
所以，应该在拷贝纯数据对象时，再使用 JSON 来进行深拷贝。\r
\r
### 自定义手写深拷贝方法\r
\r
想要手写深拷贝，我们需要从原理入手，也就是：\r
基本值拷贝时传值，对象值拷贝时传引用。\r
根据此原理，我们可以写出一个基础版的深拷贝：\r
\r
\`\`\`\r
function deepClone(obj) {\r
  // 基本类型 or null\r
  if (typeof obj !== "object" || obj === null) {\r
    return obj;\r
  }\r
\r
  // 数组 or 对象\r
  const newObj = Array.isArray(obj) ? [] : {};\r
\r
  for (let key in obj) {\r
    newObj[key] = deepClone(obj[key]);\r
  }\r
\r
  return newObj;\r
}\r
\`\`\`\r
\r
这种方式的逻辑是，在遇到基本值(或空值)时直接返回值，遇到对象时创建一个新对象，并进入到新对象和老对象的内部，对对象属性逐一拷贝。而出现对象嵌套的情况时，将递归拷贝重复上面的逻辑，直到所有嵌套对象被解开。\r
这种方法仍然有许多问题，例如无法处理循环引用。我们可以进行优化：\r
\r
\`\`\`\r
function deepClone(obj, map = new WeakMap()) {\r
  if (typeof obj !== "object" || obj === null) {\r
    return obj;\r
  }\r
\r
  // 解决循环引用\r
  if (map.has(obj)) {\r
    return map.get(obj);\r
  }\r
\r
  const newObj = Array.isArray(obj) ? [] : {};\r
\r
  map.set(obj, newObj);\r
\r
  for (let key in obj) {\r
    newObj[key] = deepClone(obj[key], map);\r
  }\r
\r
  return newObj;\r
}\r
\`\`\`\r
\r
借用 WeakMap 来判定对象是否被循环引用，如果是，直接结束递归嵌套。\r
\r
当然，完善的深拷贝方法比这个要复杂的多，例如还需具备区分类型、处理原型链等许多功能，在这里就不进行深入讨论。\r
`;export{n as default};
