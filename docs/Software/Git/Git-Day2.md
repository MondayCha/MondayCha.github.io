---
title: Git-Day2
---

### 从一次尝试说起

今天试着把自己的祭祖代码提交到 Github 上，总结一下操作：

1. 进入本地项目文件夹，右键“Git Bash Here”
2. 输入`git init`，完成初始化
3. 输入`git add .`，将当前目录下所有文件添加到仓库
4. 输入`git commit -m "xxxx"`，提交修改
5. 首次提交要git pull 一下，`git pull origin master`
6. 将代码提交到GitHub上，`git push -f origin master`

这里，关于第六步，有两种办法：

```
git push -u origin master
git push -f origin master
```

后者是强制上传覆盖远程文件。

最后总算是提交成功了，附上仓库地址——

https://github.com/MondayCha/BUAA-CO-2019

:::note
这是一篇从Hexo迁移的文章，创建于2020-02-08 04:56:57
:::
