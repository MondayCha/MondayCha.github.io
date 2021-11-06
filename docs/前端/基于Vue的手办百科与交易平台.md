---
title: 基于Vue的手办百科与交易平台
---

> 项目地址：https://github.com/MondayCha/FigureHub-Frontend



## 网站主页

网站名为“Figure Hub”，通过npm run serve指令，将前端部署到本地服务器后，即可进入数据库网站。网站整体采用新拟态风格，效果介于扁平化与投影风之间。

对于访客用户，可以浏览首页的推荐以及商城卡片，需要注册登录才能浏览百科、商品详情，进行购买、发布商品等操作。

![我的动画啊啊啊啊，全部不能展示](https://pic2.zhimg.com/v2-f3847ae7927c0b2d46cd72fc9c60a86d_b.png)



## 用户注册与登录

通过顶部栏的“登录”按钮可以进入登录以及注册页面。前端实现了简单的数据校验，密码支持英文、数字、下划线，当检验到用户名和密码不为空时，才发送登录请求。

![pixiv id：81821752](https://pic3.zhimg.com/v2-e690c85af268ae3384a52ea8056c2886_b.png)

点击注册按钮进入注册页面，输入用户名、密码，上传头像和登记昵称后，在注册页面可以进行用户类型的选择。

可以注册的用户类型包括管理员、厂商用户、普通用户。通过前端的业务逻辑以及后端的token校验，为不同类型的访问者提供对应的功能。

![没错，你说得对](https://pic2.zhimg.com/v2-c8b44a1c9ffaeef5af748fdf28566745_b.png)



![感谢PB给我抄登陆界面](https://pic4.zhimg.com/v2-57568fc97a2f00bda6ab9d45204909ef_b.png)



## 商品与交易

登陆后，顶部导航栏显示用户头像，并在最右侧显示“发布”按钮，普通用户可以在这里发布自己的二手或全新手办模型，在一次交易发起后从商城下架，厂商用户则可以发布余量充足的产品。

![img](https://pic4.zhimg.com/v2-61025aeab91539610d70a3560b07ecb7_b.png)

在上传商品时，最多可以上传9张详情图片。

![img](https://pic3.zhimg.com/v2-734a934a7a5ee7156dd015a06da92e3a_b.png)

发布成功后将弹出成功提示，并在“购物”栏目下显示发布的手办橱窗。与详情页相比，橱窗卡片显示了价格、发布者等简要信息。

![233](https://pic1.zhimg.com/v2-beac2ab565141fb156faa1fd2ea922d0_b.png)

橱窗整体采用三栏布局，每次对商品表进行计算后排列。

![img](https://pic4.zhimg.com/v2-1cbc26ebd28885d610a672ec0833bed7_b.png)

抄的Pixivic和舍友修改的代码

>  源地址：https://github.com/cheer-fun/pixivic-pcgithub.com

首页同样可以点击卡片引流，进入详情页面。

![img](https://pic3.zhimg.com/v2-d3b9e24c4bee0ee00068ca7c1748d1ee_b.png)

> 首页参考的是Bilibili-Evgithub.com

点击橱窗卡片（或从首页进入）后，会显示动画效果并跳转到详情页面，集成了浏览详情图片（多张，滚动播放）、收藏、购买、百科、发布者主页、相关推荐、评论、点赞、删除评论等功能。用户可在个人中心下架自己发布的商品。

![img](https://pic1.zhimg.com/v2-7bbdb8a63e0f704d662982869cb69808_b.png)

点击详情页面的“收藏”按钮，可以将商品加入收藏。

![img](https://pic1.zhimg.com/v2-25203d045698db58d171cfd7fed98da0_b.png)

点击“购买”按钮，可以确认当前商品信息，执行假支付后将提交交易订单，交易状态为待确认。

![感谢GTC给我抄支付页面](https://pic3.zhimg.com/v2-9ddc8d930b90994c7e43b30f9d901dae_b.png)

通过顶部栏的“订单”可以进入订单页面，显示用户发布、卖出、买入信息，管理员账户则增加“交易管理”页面，可以删除订单。

![img](https://pic4.zhimg.com/v2-9b0e0899393b4dd23948b48cc729d97b_b.png)

在订单页面，可以确认收货：

![img](https://pic3.zhimg.com/v2-feed8280a48aca9fe46d0b3abfee844e_b.png)

收货后交易状态变更为待评价，按钮变为“我要评价”：

![img](https://pic2.zhimg.com/v2-570ee8589aff27d27a10595023ef6e75_b.png)

评价完成后，可以查看自己发布的评论：

![img](https://pic4.zhimg.com/v2-98ae30b36a14c2c047cc98efc38fd2bb_b.png)

用户也可以删除自己买入和卖出的订单：

![img](https://pic3.zhimg.com/v2-ff36aa9eb7798f32835b89e67062e6ca_b.png)

## 百科信息

在管理界面，管理员以及厂商用户可以对厂商信息、角色信息、手办模型信息、作品信息以及手办与角色对应关系进行增删查改等操作。对普通用户，“百科管理”并不显示（如上图演示的管理界面中就没有此页面）。

![img](https://pic4.zhimg.com/v2-761d9a1d7fdede89f857c2b2a2f9f393_b.png)

通过左侧的侧边栏选择不同的列表。同时页面支持响应式布局，可以针对不同页面宽度，自行适配合适的页面布局。

![img](https://pic4.zhimg.com/v2-e779dea7a3661f2edc2147afd8799a57_b.png)

下面进行表格的增加、删除、查找、修改操作的演示。

### 4.1 页面初始化

开启页面时，前端通过axios向后端发送请求，如果不能正常加载数据，则显示加载动画和错误提示。

![img](https://pic1.zhimg.com/v2-18f550c30ad1f41b4dc37cfc6409fa28_b.jpg)

初始化成功，页面以每页4条的格式渲染数据，并显示当前的总数据量。

![img](https://pic4.zhimg.com/v2-114c68825c13a0928d8bd9862930ea53_b.png)

### 4.2 添加项目

单击左上角的“添加”按钮，即可弹出添加新项目的表单。

![img](https://pic3.zhimg.com/v2-4beb392f1f2fe052dc8d43b292dc93ee_b.png)

在表单中会对项目内容做初步验证（如模型名称不能为空、价格须为数字等）。

![img](https://pic4.zhimg.com/v2-5075585dafe932c01e5ffb09b21c9443_b.png)

添加成功后，前端向后端发送添加请求，重新获取数据后渲染到页面，同时在数据库可查询到添加的项目。

![img](https://pic1.zhimg.com/v2-8abf0b54a9ba933968ae892c2f815410_b.jpg)

### 4.3 删除数据

需要删除某一条数据时，单击操作中的“删除”按钮，弹出气泡确认框。

![img](https://pic2.zhimg.com/v2-8984ec85b5cf0ba3f51d2a9896292971_b.jpg)

确定后，前端向后端发送删除请求，并在重新获取数据后将其渲染到页面，自动进行刷新，原本的条目已被删除。

### 4.4 查找数据

在右上角的输入框选择筛选的类型（如：名字、性别等），可以进行关键词搜索。

![img](https://pic2.zhimg.com/v2-3d27ff9310cd27f9493eae970557a641_b.png)

### 4.5 修改数据

对需要修改的数据进行修改操作，会弹出修改项目的表单，该行数据的内容已预填入表单中：

![img](https://pic2.zhimg.com/v2-339a464a500d7a3281d5036cd843ee69_b.png)

在这里我们将模型类型修改成“粘土人”，在通过字典转换成int型数据后，向后端发送修改请求并拉取新数据。

![img](https://pic3.zhimg.com/v2-d9672045e6de627c21e73c79a30fec66_b.jpg)

### 4.6 上传图片

角色和手办模型都对应多张图片，每次最多可以上传9张详情图片。         

![img](https://pic3.zhimg.com/v2-a89f8b330c5d4df910ab2422c0d3c74a_b.png)

为了方便管理，图片在管理页面中不显示，可以在百科中显示。

![img](https://pic4.zhimg.com/v2-1c4d2b9359438d8fe29bb7cf5188c43f_b.png)

## 评论管理

用户除了发布评价，还可以对手办进行评论。在商品页面，将该商品对应的厂商以及关键词以标签形式展示，点击标签即可跳转到对应的百科页面。

![img](https://pic1.zhimg.com/v2-b2480c8b1e8a9f81f778997dc75d4d9c_b.png)

评论有两个入口，一是商品页面直接链接到该商品对应手办的评论区；一是手办的百科详情页。

![img](https://pic4.zhimg.com/v2-fd8d3268f671bfd444b40f5e7c19e4fb_b.png)

输入评论后即可发布，将显示时间戳、点赞、删除（管理员或者自己可以删除）按钮。自己无法给自己的评论点赞，通过前端实现此逻辑。

![img](https://pic1.zhimg.com/v2-feb43028317af0b41dbd2c5e65986a64_b.png)

时间戳将转换为时间范围，鼠标浮动时显示具体的时间，提升用户体验。

![感谢WPB的评论区！！！](https://pic2.zhimg.com/v2-f100e44f8b8e019591d40155c019f679_b.png)点击删除后将删除此评论。

![img](https://pic4.zhimg.com/v2-141a90143919a368001126b7e9652baf_b.png)

其他用户可以为该用户点赞，点赞后按钮变为粉色，显示点赞数，无法继续点赞。         

![img](https://pic2.zhimg.com/v2-48971b33d59e6c2962764f5137663361_b.png)

在商品详情页面右侧，显示了发布者的信息，可以进入个人主页：

![感谢DBX的详情页！他是仿的Pixiv](https://pic1.zhimg.com/v2-bffaa5b58e0fb6e0c6b3e16328601e08_b.png)

在个人主页，可以查看该用户的用户类型、收藏与评论信息：

![感谢WPB！！！](https://pic1.zhimg.com/v2-177f9f9c6fd265becfedb1a73eb95118_b.png)

以上，网站源代码见开头，后端不是我写的，所以没给代码。

:::note
这是一篇从Hexo迁移的文章，创建于2020-12-13 20:23:51
:::
