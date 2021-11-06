---
title: "「DP」房间传送门问题"
---

## 问题描述

> 链接：https://www.nowcoder.com/questionTerminal/58b04ed2865f4ff4921290f1bd4ee486
> 来源：牛客网

存在n+1个房间，每个房间依次为房间1 2 3...i，每个房间都存在一个传送门，i房间的传送门可以把人传送到房间pi(1<=pi<=i),现在路人甲从房间1开始出发(当前房间1即第一次访问)，每次移动他有两种移动策略：
   A. 如果访问过当前房间 i 偶数次，那么下一次移动到房间i+1；
   B. 如果访问过当前房间 i 奇数次，那么移动到房间pi；
 现在路人甲想知道移动到房间n+1一共需要多少次移动；

### 输入描述:

```
第一行包括一个数字n(30%数据1<=n<=100，100%数据 1<=n<=1000)，表示房间的数量，接下来一行存在n个数字 pi(1<=pi<=i), pi表示从房间i可以传送到房间pi。
```

### 输出描述:

```
输出一行数字，表示最终移动的次数，最终结果需要对1000000007 (10e9 + 7) 取模。
```



## 递推公式

- 第一次到达房间$i$时, 需要在第二次到达房间$i-1$的基础上$+1$

- 第一次到达房间$i$后, 下一步会到达房间$p[i]$, 之后再第二次走到房间$i$
- 到达$p[i]$时, 从$p[i]+1$到$i-1$的房间均被访问偶数次, 与未访问过的情况(访问0次)一致
- 所以我们可以认为, 从$p[i]$到$i$所需步数, 为$(dp[i]-dp[p[i]])$

综上所述, 得到状态转移方程:
$$
DP[i] = 2 * DP[i-1] + DP[P[i-1]] + 2
$$


## 代码实现

```java
import java.util.*;

public class Main{
    public static void main(String[] args){
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] p = new int[n + 1];
        for(int i = 1; i <= n; i++){
            p[i] = scanner.nextInt();
        }
        System.out.println(moveTime(n, p));
    }
    
    private static int moveTime(int n, int[] p){
        int[] dp = new int[n+2];
        dp[1] = 0;
        for(int i = 2; i <= n+1; i++){
            dp[i] = (2 * dp[i-1] - dp[p[i-1]] + 2) % (1000000007);
        }
        return dp[n+1] < 0 ? dp[n+1] + (1000000007) : dp[n+1];
    }
}
```

注意要对结果取模, 存在负数的情况, 也就是因为取模导致$2 * dp[i-1] - dp[p[i-1]]$为负数, 因此最后的结果需要补正, 否则只能通过$80\%$的测试点.

:::note
这是一篇从Hexo迁移的文章，创建于2021-01-19 03:42:02
:::
