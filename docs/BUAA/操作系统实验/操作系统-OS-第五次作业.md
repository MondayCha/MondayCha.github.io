---
title: 操作系统 OS 第五次作业
---



1）叙述缺页中断的处理流程。



1. 现场保护：陷入内核态，保存必要的信息。
2. 页面定位：查找出发生缺页中断的虚拟页面。
3. 权限检查：检查虚拟地址的有效性以及安全保护位，如果发生保护错误，则杀死该进程。
4. 分配页框：查找一个空闲的页框；如果没有则通过页面置换算法找到一个需要换出的页框。
5. 页面写回：如果找的页框中的内容被修改了，则需要将修改的内容保存到磁盘上。
6. 页面调入：将保持在磁盘上的页面内容复制到该页框中。
7. 更新页表：当磁盘中的页面内容全部装入页框后，向CPU发送一个中断。操作系统更新内存中的页表项，将虚拟页面映射的页框号更新为写入的页框，并将页框标记为正常状态。
8. 恢复现场：恢复缺页中断发生前的状态，将程序指针重新指向引起缺页中断的指令。
9. 继续执行：退出内核态，程序重新执行引发缺页中断的指令，进行存储访问。

---



2）假设页面的访问存在一定的周期性循环，但周期之间会随机出现一些页面的访问。例如0,1,2…,511,431,0,1,2…511,332,0,1,2,…,511等。请思考：
(1) LRU、FIFO和Clock算法的效果如何？
(2) 如果有500个页框，能否设计一个优于LRU、FIFO和Clock的算法？



1. LRU、FIFO和Clock算法的效果均相同。
2. 算法：尽可能减少替换的页面。将其中499页框用于固定页面的映射，剩下1个页面可替换。

---



3）假设有10个页面，n个页框。页面的访问顺序为0, 9, 8, 4, 4, 3, 6, 5, 1, 5, 0, 2, 1, 1, 1, 1, 8, 8, 5, 3, 9, 8, 9, 9, 6, 1, 8, 4, 6, 4, 3, 7, 1, 3, 2, 9, 8, 6, 2, 9, 2, 7, 2, 7, 8, 4, 2, 3, 0, 1, 9, 4, 7, 1, 5, 9, 1, 7, 3, 4, 3, 7, 1, 0, 3, 5, 9, 9, 4, 9, 6, 1, 7, 5, 9, 4, 9, 7, 3, 6, 7, 7, 4, 5, 3, 5, 3, 1, 5, 6, 1, 1, 9, 6, 6, 4, 0, 9, 4, 3。
当n在[1,10]中取值时，请编写程序实现OPT、LRU、FIFO页面置换算法，并根据页面访问顺序模拟执行，分别计算缺页数量，画出缺页数量随页框数n的变化曲线（3条线）



![](https://pic.downk.cc/item/5e7b6422504f4bcb040f2bb5.png)

（代码附作业末）

---



4）一个32位的虚拟存储系统有两级页表，其逻辑地址中，第22到31位是第一级页表，12位到21位是第二级页表，页内偏移占0到11位。一个进程的地址空间为4GB，如果从0x80000000开始映射4MB大小页表空间，请问第一级页表所占4KB空间的起始地址？并说明理由。（注意B代表字节，一个32位地址占4字节）



计算方式与页目录自映射计算公式类似，

第一级页表所占4KB空间的起始地址为`0x80000000|0x80000000>>10 = 0x80200000`。

---



5）

1. 进程整个的地址空间有`2^32`字节？一页有`2^10`字节。

2. **0x0**

   过程：页目录地址为`0x0`，页表地址为`0x0`，页内偏移为`0x0`。

   访问页目录`0x0`，有效位为0，访问无效。

   **0x00803004**

   过程：页目录地址为`0x2`，页表地址为`0x3`，页内偏移为`0x4`。

   访问页目录`0x2`，得到页表的页框地址为`0x5000`且有效，访问页表`0x3`项，得到页框地址为`0x20000`且有效，加上偏移量即得到转换后的物理地址——`0x20004`。

   最终访存获取到的数据为`0x0`。

   **0x00402001**

   过程：页目录地址为`0x1`，页表地址为`0x2`，页内偏移为`0x1`。

   访问页目录`0x1`，得到页表的页框地址为`0x1000`且有效，访问页表`0x2`项，得到页框地址为`0x5000`且有效，加上偏移量即得到转换后的物理地址——`0x5001`。

   最终访存获取到的数据为`0x4e001`。

3. 物理地址`0x326028`对应的偏移量为0x28，对应的页框地址为`0x32600`，查找二级页表得，位于页框地址为`0x20000`的页表的第`0x1`项中，该页表信息位于页目录的第`0x3`项。

   对应的虚拟地址为`0x00c01028`。

---



### 附：第三题代码

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;

public class MainClass {
    public static final int[] readpage = {
            0, 9, 8, 4, 4, 3, 6, 5, 1, 5,
            0, 2, 1, 1, 1, 1, 8, 8, 5, 3,
            9, 8, 9, 9, 6, 1, 8, 4, 6, 4,
            3, 7, 1, 3, 2, 9, 8, 6, 2, 9,
            2, 7, 2, 7, 8, 4, 2, 3, 0, 1,
            9, 4, 7, 1, 5, 9, 1, 7, 3, 4,
            3, 7, 1, 0, 3, 5, 9, 9, 4, 9,
            6, 1, 7, 5, 9, 4, 9, 7, 3, 6,
            7, 7, 4, 5, 3, 5, 3, 1, 5, 6,
            1, 1, 9, 6, 6, 4, 0, 9, 4, 3
    };

    public static void main(String[] args) {
        System.out.print("OPT:  ");
        for (int n = 1; n <= 10; n++) {
            System.out.print(getFaultCountOfOPT(n) + " ");
        }
        System.out.print("\nLRU:  ");
        for (int n = 1; n <= 10; n++) {
            System.out.print(getFaultCountOfLRU(n) + " ");
        }
        System.out.print("\nFIFO: ");
        for (int n = 1; n <= 10; n++) {
            System.out.print(getFaultCountOfFIFO(n) + " ");
        }
    }

    public static int getFaultCountOfFIFO(int n) {
        int answer = 0;
        Queue<Integer> list = new LinkedList<>();
        for (int i = 0; i < 100; i++) {
            if (list.contains(readpage[i])) {
                continue;
            } else {
                if (list.size() == n) {
                    list.poll();
                }
                list.offer(readpage[i]);
                answer++;
            }
        }
        return answer;
    }

    public static int getFaultCountOfLRU(int n) {
        int answer = 0;
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < 100; i++) {
            int page = readpage[i];
            if (map.containsKey(page)) {
                map.put(page, i);
                continue;
            } else {
                if (map.size() == n) {
                    int minread = 101;
                    int minkey = 0;
                    for (Map.Entry<Integer, Integer> ii : map.entrySet()) {
                        if (minread > ii.getValue()) {
                            minread = ii.getValue();
                            minkey = ii.getKey();
                        }
                    }
                    map.remove(minkey);
                }
                map.put(page, i);
                answer++;
            }
        }
        return answer;
    }

    public static int getFaultCountOfOPT(int n) {
        int answer = 0;
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < 100; i++) {
            int page = readpage[i];
            if (map.containsKey(page)) {
                map.put(page, betweenUse(page,i));
                continue;
            } else {
                if (map.size() == n) {
                    int maxpause = -1;
                    int maxkey = 0;
                    for (Map.Entry<Integer, Integer> ii : map.entrySet()) {
                        if (maxpause < ii.getValue()) {
                            maxpause = ii.getValue();
                            maxkey = ii.getKey();
                        }
                    }
                    map.remove(maxkey);
                }
                map.put(page, betweenUse(page,i));
                answer++;
            }
        }
        return answer;
    }

    public static int betweenUse(int page, int now) {
        for (int i = now + 1; i < 100; i++) {
            if (readpage[i] == page) {
                return i - now;
            }
        }
        return 101;
    }
}
```

输出结果：

```shell
OPT:  90 64 50 39 29 23 17 12 11 10 
LRU:  90 79 71 58 52 42 28 17 13 10 
FIFO: 90 80 67 59 47 39 30 20 12 10 
Process finished with exit code 0
```

:::note
这是一篇从Hexo迁移的文章，创建于2020-03-26 06:14:10
:::
