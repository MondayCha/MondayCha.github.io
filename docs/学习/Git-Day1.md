---
title: Git-Day1
---

### 创建版本库

选择一个合适的地方，创建一个空目录：

```
$ mkdir learngit
$ cd learngit
$ pwd
```

初始化一个Git仓库，使用`git init`命令。

添加文件到Git仓库，分两步：

1. 使用命令`git add `，注意，可反复多次使用，添加多个文件；
2. 使用命令`git commit -m `，完成。



### 时光机穿梭

要随时掌握工作区的状态，使用`git status`命令。

如果`git status`告诉你有文件被修改过，用`git diff`可以查看修改内容。

:::note
这是一篇从Hexo迁移的文章，创建于2020-02-07 04:56:57
:::
