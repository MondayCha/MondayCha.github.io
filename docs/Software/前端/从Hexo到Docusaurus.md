---
title: 个人网站迁移之旅：从博客到知识库，从 Hexo 到 Docusaurus 
---

或是出于跟风，或是为了简历能好看点，2020 年 2 月，在翻看了中文互联网大量的「免费个人网页搭建教程」后，我选择了 Hexo + Github Pages 的方案，找了一款看上去还不错的主题，搭建了自己的第一个博客网站。

很难量化我在这接近两年的时间里有了什么成长，我迎来了一学期的网课（甚至期末考试都是线上），见证了前所未有的生活方式的转变（从此社恐人可以合理戴口罩了），学习了更多的计算机专业课知识（虽然已经忘光），写了更多的汉字（我都不好意思说能叫文章），体验了一边在互联网企业 996 一边赶学期大作业 Deadline 的生活（然后现在推行「1075工作制」），准备考研又开始准备找工作，准备找工作又准备 Gap 去支教……

这之中大概还是有很多值得记录的吧，然而从结果上看我并没有留下什么，因此我也开始思考就我个人的情况而言，用时间轴将文章串联起来的博客，是否是个人网站最合适的载体。

## 你需要的怎样的个人网站？

知乎、简书、博客园、微信公众号……那些优秀或不那么优秀的写作平台已经有很多很多。而选择独立于这些大平台，去运营自己的个人网站，这件事多少带点理想主义色彩——个人网站缺乏稳定的流量来源，在国内更是需要备案等操作，虽然能免于平台审核的等待，但更多时候恐怕只是小圈子的孤芳自赏。

而我最早是为什么开始写文章的呢？虽然「nobody cares」，但我现在想想依然觉得有些不可思议，当时的自己为什么有勇气做这种事（顺带一提我突然想起了粉丝刚刚破一万时我是如何声情并茂地和舍友讲了一下午我是怎么涨粉的的黑历史，太尴尬了，现在我已经忘了当时他的脸上是怎样的神情）。

搭建个人网站则主要是为了寻找一种将所学知识归类展示的渠道，希望可以通过笔记避免知识的遗忘。从我之前在 Hexo 上发布的博客来看，我发布的内容以课程内容、软件技巧为主，这些内容一般有比较明确的分类和标签，比起瀑布流式的文章，更适合用树状的Docs进行整理，这也成了本次迁移到 Docusaurus 的主要动力。

## Hexo 有哪些不适合你的地方？

在使用 Hexo 的过程中，我主要遇到了以下痛点（事实上很多痛点都是技术菜所导致的）：

- **Node 版本问题**：此前 Hexo 在 Node 14.x 以上版本运行时会存在兼容问题（我不清楚现在是否解决了），网上的资料通常是建议将 Node.js 降级至 12.x 版本使用。为此我不得不安装 nvm 管理电脑上不同的 Node 版本，每次写博客前还需要切换 Node 环境，在一定程度上打击了创作积极性。
- **不够省心的客户端**：体验过几个 Hexo 客户端，感觉界面和自己的期待有些差距，使用时也会遇到一些小问题，于是又回到了命令行创建新博客的方式。
- **瀑布流式的文章组织方式**：虽然 Hexo 提供了标签、分类等功能，但是没有进一步的层级关系，标签过多也不利于日后复盘。因此，文档式的知识库也许更符合我的需求。
- **较高的主题定制门槛**：我使用的是从 Github 上找的 Hexo 主题，作者主要使用 JQuery 开发，然而我在前端上学艺不精，只会站在 React、Vue 的肩膀上修修补补，似乎除了改改主题颜色就没有别的能做的事情了。
- **CI/CD 部署问题**：之前创建博客时没有使用 CI/CD，每次更新 Github Pages 都需要经过「写博客 → 生成静态页面 → 上传到 Github」的过程，所以这次采用 Docusaurus 构建个人知识库时就用了自动部署。

## Docusaurus 是什么？有哪些优势？

Docusaurus 是一款基于 React 构建的站点生成器，可用于构建文档网站、博客、营销页面（落地页）等。

- Docusaurus 的文档和博客功能都是开箱即用的，背靠 Facebook 开源项目团队（现在应该叫 Meta ？），官方文档对于中文的支持也很友好，主要功能都能在文档上找到。
- 支持在 Markdown 语法中嵌入 React 组件，此外还有丰富的插件库，比如能在线运行的代码执行器等，可以进一步丰富个人网站的功能。在这次的迁移过程中我就用 Infima 的 Note 组件美化了迁移信息。
- Docusaurus 是一款 React 应用程序，对于曾在「软件工程」课上被 React + Typescript 折磨的我来说，我对于 React 语法比较熟悉，可以尝试增加自己所需的功能。
- 颜值高：第一眼看上去感觉 Docs 很像 Gitbook，自身的配色我感觉也挺不错，之后可能会微调下标题字号。

当然，经过近一周的使用我也发现了一些小问题：

- 标签功能并不好用：Docusaurus 会将标签按照首字母进行分类，英文标签还好，中文标签则每一个单字都会成为一个分类。
- 暂时还没有评论功能：Docusaurus 支持添加文档搜索模块，但我还没找到类似 Gitalk 的评论插件（虽然这个功能也没啥必要）。
- 同样缺乏 GUI：好在 Docusaurus 会自动根据 docs 下的目录树划分文档层级，便于建立个人知识库。博客则需要在标题中注明时间与题目，可能需要自己写一个简单的脚本。
- 导航栏定制问题：Docusaurus 采用 Infima 的Navigation Bar 组件，通过注入的方式设定导航栏参数。原生导航栏定制自由度不高，好在可以放弃引入，自行编写导航栏（从「[Docusaurus 站点展示 | Docusaurus 中文文档 | Docusaurus 中文网](https://www.docusaurus.cn/showcase)」里的源码学到的）。

目前 Docusaurus v2 还是 beta 版本，社区很活跃，看好这个工具的前景。

## 从 Hexo 迁移到 Docusaurus 需要几步？

忍不住讲起某个大象与冰箱的笑话，虽然我一直感觉这个笑话好冷。[Hexo](https://hexo.io/zh-cn/docs/front-matter) 和 [Docusaurus](https://www.docusaurus.cn/docs/blog#adding-posts) 的 Front-matter 存在部分命名上的差异，好在它们都是用 YAML 格式组织的，因此我写了两个简单的 Ruby 脚本（[Github 仓库地址](https://github.com/MondayCha/Hexo2Docusaurus)），可以提取出原先在 Hexo 生成博文的时间戳、标题、标签、分类等信息，将其分别转换为 Docusaurus 格式的文档和博客 Markdown。

```ruby
#!/usr/bin/ruby

require 'pathname'
require 'tmpdir'
require 'yaml'

def copy_not_null_array(hexo_yaml_info, hexo_key, docusaurus_yaml_info, docusaurus_key)
  if hexo_yaml_info[hexo_key]
    if hexo_yaml_info[hexo_key].class != Array
      docusaurus_yaml_info[docusaurus_key] = [hexo_yaml_info[hexo_key]]
    else
      docusaurus_yaml_info[docusaurus_key] = hexo_yaml_info[hexo_key]
    end
  end
end

def parse_markdown_file(filepath)
  output_directory_name = "./output"
  text_all = File.read filepath.to_s

  # 分割博文的头部和正文
  begin_split = text_all.index('---')
  unless begin_split
    return
  end
  end_split = text_all.index('---', begin_split + 1)
  head = text_all[0, end_split]
  body = text_all[end_split + 4, text_all.size]

  # 读取YAML头部信息
  temp_filename = File.join(Dir.tmpdir, "yaml_head.temp")
  temp_file = File.new(temp_filename, "w")
  temp_file.puts head
  temp_file.close
  hexo_yaml_info = YAML.load_file(temp_filename)
  File.delete(temp_filename)

  # 迁移所需的YAML信息
  # - Docusaurus文章属性: https://www.docusaurus.cn/docs/blog#header-options
  blog_name = hexo_yaml_info['title'].gsub(/[()]/, '('=>'「', ')'=>'」')

  docusaurus_yaml_info = Hash.new
  docusaurus_yaml_info['authors'] = 'mondaycha' # 在authors.yml中完善信息
  # docusaurus_yaml_info['author_url'] = 'https://github.com/MondayCha'
  # docusaurus_yaml_info['author_image_url'] = 'https://github.com/MondayCha.png'
  # docusaurus_yaml_info['author_title'] = '我逐渐理解了一切（完全没理解）'
  docusaurus_yaml_info['title'] = blog_name
  docusaurus_yaml_info['date'] = hexo_yaml_info['date'].strftime("%Y-%m-%d %H:%M:%S")
  copy_not_null_array(hexo_yaml_info, 'tags', docusaurus_yaml_info, 'tags')
  copy_not_null_array(hexo_yaml_info, 'categories', docusaurus_yaml_info, 'keywords')
  if hexo_yaml_info['photos'] and hexo_yaml_info['photos'][0]
    docusaurus_yaml_info['image'] = hexo_yaml_info['photos'][0]
  end

  # 将新头部和正文写入文件
  unless File.directory? output_directory_name
    Dir.mkdir(output_directory_name, 755)
  end
  create_time = hexo_yaml_info['date'].strftime("%Y-%m-%d") # 时区有问题，待修复
  title = hexo_yaml_info['title']
  output_filename = File.join(output_directory_name, create_time << '-' << blog_name.gsub(' ','-') << '.md')
  if File.file? output_filename
    File.delete(output_filename)
  end
  output_file = File.open(output_filename, 'a+')
  output_file.puts docusaurus_yaml_info.to_yaml

  # 生成摘要，否则缩略页不忍直视
  truncate = "---\n<!--truncate-->"
  output_file.puts truncate
  output_file.puts body
  output_file.close
end


directory_name = "./"
file_list = Pathname.new(directory_name).children.select { |c| c.to_s.match('.*.md$') }
file_list.each do |filepath|
  puts filepath
  parse_markdown_file(filepath)
end
```

将脚本放在 Hexo 目录下的 `\source\_posts`文件夹下，与此前创建的博文平级，之后运行脚本即可获得适用于 Docusaurus 的 `.md`文件。

## 从零开始的 Docusaurus 配置生活

### 1. 环境配置

以 Windows 系统为例，需求 Node.js 版本 ≥ 14，最好选择 Yarn 作为你的包管理工具。从官网下载 Node.js 的安装包并安装完成后，确保 Node.js 已经添加到了环境变量中：

```powershell
PS F:\FuckNPM\l1lBlog> node -v
v16.13.0
```

使用自带的 npm 完成 Yarn 的安装，正如曾几何时 Edge 打开的第一个与最后一个网页就是 Chrome 下载页。

```powershell
npm install -global yarn
yarn config set registry https://registry.npm.taobao.org/ # 使用淘宝维护的npm镜像源
yarn config set proxy http://XX
yarn config set https-proxy http://XX
```

### 2. 初始化网站

Docusaurus 已经提供了一个模板（或者说 Scaffold？），我在 Github 上也看到有人做的精简后的模板。如果你已经完成了 Node.js 和 Yarn 的安装，那么只需要几行命令就能很快启动网站：

```powershell
npx create-docusaurus@latest my-website classic
cd my-website
yarn start
```

部署完成后，如果 3000 端口没有被占用，那么访问 [localhost:3000](localhost:3000) 就能看到提供的模板页面了。

### 3. 创作你的创作

如果你已经有 Hexo 博文，那么正如上一节，将博文的 Front-matter 转换后放入根目录下的`blog`或`docs`文件夹。可以参见官方文档中的说明，非常详细。

### 4. 最期待的 CI/CD 环节

我选择使用 Github Pages 进行部署，先参考「[部署 | Docusaurus 中文文档 | Docusaurus 中文网](https://www.docusaurus.cn/docs/deployment#docusaurusconfigjs-settings)」一节，修改`docusaurus.config.js`的`module.exports`部分，否则 Github Actions 会显示无权访问，因为你把网页部署到 Facebook 那里去了……

参考「[部署 | Docusaurus 中文文档 | Docusaurus 中文网](https://www.docusaurus.cn/docs/deployment#triggering-deployment-with-github-actions)」一节进行 ssh key 的设置，由于我并非生成某个 Github 项目的文档页，而是生成 Github 的根博客，官方提供的`documentation.yml`代码并不能很好运行，在参考了其他项目后，我使用了如下配置文件：

```yaml
name: documentation

on:
  push:
    branches: [documentation]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # checkout && nodejs 
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '15'

      - run: yarn install && npm run build
      
      # delopy
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

我的 Github 项目分支结构可以参考「[MondayCha/MondayCha.github.io: MondayCha's blog, made with Docusaurus v2.](https://github.com/MondayCha/MondayCha.github.io)」

至此就完成了从 Hexo 到 Docusaurus 的迁移与部署工作了，最后放几张新知识库的图片吧：

以上，未来一年好好准备毕业设计，准备教师资格证考试，准备研究生阶段的知识。如果说您有疑问的话也可以在知乎评论区或 Github Issue 区留言，我有看到就会回复的。