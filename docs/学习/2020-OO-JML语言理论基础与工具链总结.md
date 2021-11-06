---
title: 2020 OO JML语言理论基础与工具链总结
---
第三单元终于结束了，这是我目前为止最惨的一单元，第十次作业强测20分，互测杀成狗……虽然都知道只关注分数没有什么意义，我更应该去体会的是通过JML学习对于程序设计理念的认知，但是……心真的很痛。

下面就进入单元总结：



## 1. JML语言理论基础与工具链

### 1.1 JML语言是什么

参考课程组下发的《JML(Level 0)使用手册》，JML语言的定义如下：

> JML(Java Modeling Language)是用于对Java程序进行规格化设计的一种表示语言。JML是一种行为接口规格语言（Behavior Interface Specification Language，BISL），基于Larch方法构建。

也就是说，JML是一种对代码语言的抽象——不同的语言有着不同的语法，而JML通过自己的规则对代码进行了形式化的表述，一旦规格确定，除非涉及复杂的算法要求，实现代码就变成了一个相对简单的事情。

### 1.2 JML语言基本语法

JML的核心在于用表达式对规格进行描述，首先从常见的表达式说起，给人的感觉类似离散数学：

| 表达式                    | 含义                                           |
| ------------------------- | ---------------------------------------------- |
| \result                   | 方法的返回值（非void类型）                     |
| \old(expr)                | 表达式expr在方法执行前的取值                 |
| \not_assigned(x, y, ...)  | 括号中的变量是否在方法执行过程中未被赋值       |
| \not_modified(x, y, ...)  | 限制括号中的变量在方法执行期间的取值未发生变化 |
| \forall | 全称量词                                       |
| \exists | 存在量词                                       |
| \sum  | 返回给定范围内的表达式的和                     |
| \product | 返回给定范围内的表达式的连乘结果 |
| \max  | 返回给定范围内的表达式的最大值                 |
| \min  | 返回给定范围内的表达式的最小值                 |
| \num_of | 返回指定变量中满足相应条件的取值个数 |
| <: | 子类型关系操作符 |
| <==>                      | 等价关系操作符                              |
| ==>                       | 推理操作符                                |
| \everything               | 全集                                           |
| \nothing                  | 空集                                           |

表达式中容易错的地方在于\old(`expr`)表达式，作为一般规则，任何情况下，都应该使用\old把关心的表达式取值整体括起来。

| 方法规格                    | 含义                                                         |
| --------------------------- | ------------------------------------------------------------ |
| requires                    | 表达的意思是“要求调用者确保P为真”                            |
| ensures                     | 表达的意思是“方法实现者确保方法执行返回结果一定满足谓词P的要求，即确保P为真” |
| assignable/modifiable       | 副作用范围限定，副作用指方法在执行过程中会修改对象的属性数据或者类的静态成员数据，从而给后续方法的执行带来影响。`assignble`表示可赋值，而`modifiable`则表示可修改 |
| pure                        | 纯粹访问性的方法，不会对对象的状态进行任何改变，也不需要提供输入参数 |
| public normal_behavior      | 正常功能，一般指输入或方法关联this对象的状态在正常范围内时所指向的功能。 |
| public exceptional_behavior | 与正常功能相对                                               |
| signals                     | 结构为`signals (***Exception e) b_expr;`，意思是当`b_expr`为`true`时，方法会抛出括号中给出的相应异常`e` |

最后是类型规格，指针对类或接口所设计的约束规则。

| 类型规格   | 含义                                                     |
| ---------- | -------------------------------------------------------- |
| invariant  | 不变式，只针对可见状态(即当下可见状态)的取值进行约束     |
| constraint | 状态变化约束，对前序可见状态和当前可见状态的关系进行约束 |

### 1.3 应用工具链情况

在网络上查找JML工具链，搜索到的大多是OO博客的内容。工具主要包括OpenJML、JMLUnitNG等。

- OpenJML: http://www.openjml.org/
- JMLUnitNG: http://insttech.secretninjaformalmethods.org/software/jmlunitng/

在编写三次作业时，我用的java版本是JDK13，无法使用相关工具链，于是也在作业中并没有使用；撰写本次博客时重新安装了JRE1.8，具体使用在下面的部分描述。



## 2. SMT Solver验证

参考了J哥的教程（https://www.cnblogs.com/pekopekopeko/p/12920417.html#4581709），进行OpenJML的基础组件SMT Solver验证，文件树如下：

```
PS G:\STUDY\BUAA-2020-OO\Week12> tree /F
卷 办公 的文件夹 PATH 列表
卷序列号为 AA85-2D30
G:.
│  Group.java
│  Person.java
│
└─openjml-0.8.44-20200413
    │  epl-v10.html
    │  jml-reference-manual.pdf
    │  jmlruntime.jar
    │  jmlspecs.jar
    │  LICENSE.rtf
    │  openjml-template.properties
    │  openjml.jar
    │  OpenJMLUserGuide.pdf
    │  VERSION_INFO
    │
    ├─Solvers-linux
    │      cvc4-1.6
    │      z3-4.3.0
    │      z3-4.3.1
    │      z3-4.7.1
    │
    ├─Solvers-macos
    │      cvc4-1.6
    │      z3-4.3.1
    │      z3-4.5.0
    │      z3-4.6.0
    │      z3-4.7.1
    │
    └─Solvers-windows
            cvc4-1.6.exe
            z3-4.3.2.exe
            z3-4.7.1.exe
```

先运行静态验证指令：`java -jar .\openjml.jar -exec .\Solvers-windows\z3-4.7.1.exe -esc ..\Group.java`，得到初步结果：

```
public class Person {
       ^
..\Group.java:34: 警告: A non-pure method is being called where it is not permitted: Person.isLinked(Person)
      @          (\sum int j; 0 <= j && j < people.length && people[i].isLinked(people[j]); 1));
                                                                               ^
..\Group.java:40: 警告: A non-pure method is being called where it is not permitted: Person.isLinked(Person)
      @           people[i].isLinked(people[j]); people[i].queryValue(people[j])));
                                    ^
..\Group.java:40: 警告: A non-pure method is being called where it is not permitted: Person.queryValue(Person)
..\Group.java:47: 警告: A non-pure method is being called where it is not permitted: Person.getCharacter()
      @          temp.length == people.length && temp[0] == people[0].getCharacter();
                                                                                  ^
..\Group.java:49: 警告: A non-pure method is being called where it is not permitted: Person.getCharacter()
      @            temp[i] == temp[i-1].xor(people[i].getCharacter())) &&
                                                                  ^
..\Group.java:59: 警告: A non-pure method is being called where it is not permitted: Person.getAge()
                                                                            ^
..\Group.java:58: 错误: 不可比较的类型: int和INT#1
    /*@ ensures \result == (people.length == 0? 0 :
                        ^
  其中, INT#1是交叉类型:
    INT#1扩展Number,Comparable
      @          (people[i].getAge() - getAgeMean()) * (people[i].getAge() - getAgeMean())) /
                                  ^
..\Group.java:64: 警告: A non-pure method is being called where it is not permitted: Person.getAge()
      @          (people[i].getAge() - getAgeMean()) * (people[i].getAge() - getAgeMean())) /
                                                                        ^
..\Group.java:63: 错误: 不可比较的类型: int和INT#1
                        ^
  其中, INT#1是交叉类型:
    INT#1扩展Number,Comparable
3 个错误
8 个警告
```

报错和警告主要有两种，在不允许的地方调用非纯方法，以及不可比较的类型（貌似是不能识别三目运算符？），动态验证的信息就更多了。

总之我感觉看着结果云里雾里的，SMT Solver目前好像也无法对exist等进行验证，不过作者一直在更新，相信下一届的同学们可以享受到更加舒适的SMT Solver的！



## 3. JMLUnitNG/JMLUnit自动生成测试用例

辛辛苦苦以10KB/S的速度下载下来，一运行傻了——

到百度求助，表示版本太低，然而我已经下载了官网最新的1.8版本……另外发现这中间似乎插了句人话：`错误: 非法的类型开始 value = new ArrayList<>();`，感情必须要写成`value = new ArrayList<Integer>();`的形式？这也太OUT了吧……

之后又出现了群里提到的神秘的++，触发了`JmlInternalError`,更加迷惑了。

```
org.jmlspecs.openjml.JmlInternalError: The operation symbol ++ for type java.lang.Object could not be resolved
```

#### 简要分析

最后我折腾了很久还是不行……运行完什么结果也没有……我也很疑惑为什么运行SMT Solver时就相对顺风顺水但JMLUnitNG怎么整都不行（对帮我找问题的PB同学深表歉意）。因为我的电脑不能生成，所以就看了很多同学的博客，这里借用@VOIDMalkuth的测试结果：



从同学们的结果来看，JMLUnitNG自动生成的样例可以检测到一定的错误，对于INT数据测试了极端情况等与实际应用不符合的数据输入，要成为真正有用的工具，还有很长的路要走……



## 4. 架构设计梳理与模型构建策略分析

### 4.1 第九次作业

UML类图如下：

本次作业只要对着规格就能完成大部分任务，架构上使用的MyPerson、MyNetwork均继承课程组所给的接口。

需要考虑算法实现的是isCircle，我采用了BFS广度优先搜索，从每个Person内调出邻接表搜索，复杂度为O(N+E)。

### 4.2 第十次作业

UML类图如下：

第十次作业与第九次作业相比新增了Group，在MyNetwork中调用MyGroup。我直到周四才开始动笔，此时同学们已经把雷区排得差不多了……于是在Group的方法上我采用了缓存法的形式。需要特别注意的是缓存法在addRelation时也要更新缓存，我采用的方式为为Group增加更新的检索方法：

```java
    public void addRelation(int id1, int id2, int value) {
        if (people.containsKey(id1) && people.containsKey(id2)) {
            relationSum += 2;
            valueSum += (2 * value);
        }
    }
```

而在计算方差时，则出现了过度化简导致误差的问题，同样需要注意。

另外需要注意的是初始化问题，HashMap默认容量为16，当当前的size超过容量×常数时就会进行扩容，而扩容操作需要耗费的时间较多，因此我直接将关系表初始化为8192容量。

### 4.3 第十一次作业

UML类图如下：

第十一次作业对算法的考察增加了：

- 在queryBlockSum我采用了并查集，进而isCircle的复杂度降至O(1)；
- queryMinPath则采用了堆优化的Dijkstra，没有手写堆，而是采用自带的PriorityQueue进行维护；
- queryStrongLink原本在想要不要学tarjan，但发现助教给的标程复杂度很宽容，所以就用了两步BFS，特判第一次BFS找到的为直连路径的情况，我写了一个忽略某点的BFS函数：

```java
private boolean searchIgnore(int id1, int id2, int ignore) {
    if (id1 == ignore || id2 == ignore || id1 == id2) {
        // err("meet id1 == ignore || id2 == ignore || id1 == id2");
        return false;
    }
    HashSet<Integer> visited = new HashSet<>(1024);
    Queue<Integer> queue = new LinkedList<>();
    queue.add(id1);
    while (!queue.isEmpty()) {
        int currentId = queue.poll();
        if (visited.contains(currentId)) {
            continue;
        }
        ArrayList<Integer> points = ((MyPerson) getPerson(currentId)).getAcquaintance();
        for (Integer i : points) {
            if (i == id2) {
                // err("Succeed! searchIgnore");
                return true;
            } else if (!visited.contains(i) && i != ignore) {
                queue.offer(i);
                // err("queue update to " + queue);
            }
        }
        visited.add(currentId);
        // err("point " + currentId + " has been searched");
    }
    return false;
}
```

如果第一次找到的路径长度为2，那么就遍历起点的邻接表，找到一条不经过起点就能到终点的路径就返回成功；否则依次忽略第一次路径中的点，如果每次都能找到路径就返回成功。最后在研讨课也学了tarjan，在求割点的过程中求出所有双连通分量，进而判断点双。

这样的结构导致MyNetwork非常臃肿，我因此将并查集、堆优化的Dijkstra单独抽象为一个类。



## 5. 代码bug和修复情况

第九次、第十一次作业均未出现Bug。

### 第十次作业

第九次作业整体相对简单，也就让我放松了警惕，在第十次作业时，我最后改了一行代码，却忘了测试：

```java
return (HashSet<Integer>) acquaintance.keySet();
```

就是这行代码，让我直接RE了大部分测试点……在编写时想当然地以为HashMap的KeySet可以用强制类型转换为HashSet，之后又没有做哪怕一次对isCircle的测试，于是强测直接爆炸……在互测屋里，看到了没有除零直接RE的同学；看到了缓存更新不及时的同学，看到了好多Bug一起犯的同学……是一次难忘的体验。

![](https://pic.downk.cc/item/5ec73f83c2a9a83be528b8bc.png)

### 第十一次作业

在第十一次作业，吸取了第十次作业的惨痛教训，用Junit对新加入的函数进行单元测试，优化算法，没有出现Bug。



## 对规格的心得体会

JML作为一种统一的规格化语言，在对代码进行了形式化的表述的同时，也给机器理解程序提供了一种可能性。

虽然从目前来看，JML相关的工具或是陈旧不堪，或是Bug满天飞，而撰写规格甚至比写程序还要复杂得多，比如对于一些Contains方法，JML的表述虽然严谨，但为人的阅读与理解提供了更大的负担。

而在未来的工作中，不单要知道如何写好程序，也需要写出好的文档，我想本单元的学习就是一次预习，虽然中间由于我的懈怠造成了大翻车，但这一单元只要认真阅读代码并不难。

:::note
这是一篇从Hexo迁移的文章，创建于2020-05-21 18:10:06
:::
