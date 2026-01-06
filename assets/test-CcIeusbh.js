const n=`# 标题\r
\r
## 二级标题\r
\r
这是一段 **加粗** **字体**  \r
这是一段 _斜体字_  \r
这是一段 **_加粗斜体字_**  \r
这是一段 ~~划线文本~~\r
\r
这是一段代码 \`let i = 1\`  \r
这是一段长代码\r
\r
\`\`\`\r
export function useTheme() {\r
  const [theme, setTheme] = useState("dark");\r
  return { theme, toggleTheme };\r
}\r
\r
\r
\`\`\`\r
\r
[这是一个链接](http://localhost:5173/)  \r
这也是一个连接<http://localhost:5173/>  \r
这是猴儿![猴儿](./images/happy_monkey.jpg)\r
\r
> 这是一段引用\r
>\r
> > 这是第二段引用\r
> >\r
> > > 这是第三段引用\r
\r
下面是一条分隔线\r
\r
---\r
\r
1. 这是项目 1\r
1. 这是项目 2\r
1. 这是项目 3\r
\r
- 这是项目 1\r
  - 这是子项目 1\r
    - 这是子项目 2\r
- 这是项目 2\r
- 这是项目 3\r
\r
这是一个表格\r
| 左对齐 | 居中对齐 | 右对齐 |\r
| ---- | :----: | ----:|\r
| 1 | 1 | 1 |\r
| 2 | 2 | 2 |\r
| 3 | 3 | 3 |\r
| 4 | 4 | 4 |\r
\r
这是一个复选框\r
\r
- [ ] c++\r
- [x] python\r
`;export{n as default};
