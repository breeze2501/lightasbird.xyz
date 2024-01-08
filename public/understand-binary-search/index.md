---
title: "理解二分查找"
date: '2014-06-27'
spoiler: "提供充足的时间，仅有约10%的专业程序员能够完成一个正确的二分查找。—《编程珠玑》"
---

二分查找的原理很容易理解，所以一直都没有仔细研究.今天看了《挑战程序设计竞赛》相关的内容，发现自己实在太弱啦~其实之前一直都没理解透彻!于是重做了[CDOJ855](http://acm.uestc.edu.cn/#/problem/show/855)和[POJ1064](http://poj.org/problem?id=1064)。

我认为二分查找还是应该从**区间开闭**的角度思考的。

## lower_bound

给定长度为n的单调不下降数列a[MAXN]和数k，求满足ai >= k条件的最小的下标i，不存在则输出n。

由于想要得到的是最小的下标，所以当有a[mid] == k时答案仍有可能小于mid，因此上界r = mid，而下界是一个无限逼近答案的值。故下界取开区间，上界取闭区间，最后直到区间为(ans-1, ans]时循环结束。

```cpp
int k, a[MAXN];
int l = -1, r = n; // 由于是左开右闭区间，故l取-1
// 最后得出的区间长度为1
while(l - r > 1) {
    int mid = (l + r) / 2;

    if (a[mid] >= k) {
        r = mid;//解范围变成(l,mid]
    } else {
        l = mid;//解范围变成(mid,r]
    }
}

cout << r << endl;//由于是左开右闭区间，答案取右端
```

相关的题目就是满足某条件judge(x)的最小值。

```cpp
bool judge(int x) {
    //条件判断
}

void solve() {
    l, r//上下界
    while (r - l > 1) {
        mid = (l + r) / 2;

        if (judge(mid) || 找到的值偏大) {
            r = mid;
        } else {
            l = mid;
        }   
    }
    //最后答案是r
}
```

（突然发现做的两例题都是求最大值，抱歉，例题以后补充）

## upper_bound

与lower_bound的思考类似，用左闭右开区间，即最后答案为[ans , ans + 1)。

```cpp
int k, a[MAXN];
int l = 0, r = n + 1; //左闭右开区间
while (l - r > 1) {   //最后得出的区间长度为1,
    int mid = (l + r) / 2;

    if (a[mid] <= k) {
        l = mid; //解范围变成[mid,r)
    } else {
        r = mid; //解范围变成(l,mid]
    }
}

cout << l << endl;//由于是左闭右开区间，答案取左端
```

类似题目即满足条件judge(x)的最大值。有伪代码：

```cpp
bool judge(int x) {
    //条件判断
}

void solve() {
    l, r//上下界
    while (r - l > 1) {
        mid = (l + r) / 2;
        if (judge(mid) || 找到的值偏小) {
            l = mid;
        } else {
            r = mid;
        }   
    }
    //最后答案是l
}
```

### 例题

[CDOJ855](http://acm.uestc.edu.cn/#/problem/show/855)

```cpp
#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdlib>
#include<climits>
#include<sstream>
#include<vector>
#include<cstdio>
#include<string>
#include<stack>
#include<queue>
#include<cmath>
#include<map>
#include<set>
#define MAXN 50100

typedef long long ll;
using namespace std;

ll a[MAXN];
ll x; int n, m;

//search(l,r)
//ans!=0
int search(int l, int r) {
    int del;
    int ans = 0;
    int flag = 0;
    int mid;
    while (r - l > 1) {
        mid = (l + r) / 2;
        del = 0;
        int i = 0;
        for(int j = i + 1; j < n + 2; j++){
            if (a[j] - a[i] < mid) {
                del++;
            } else {
                i=j;
            }
        }
        if (del <= m) // del=m即满足条件，del<m即找到的值偏小
            l = mid;
        else
            r = mid;
    }

    return l;     //最后答案是下界
}

int main(){
    cin >> x >> n >> m;
    ll ans;
    int l = x;
    a[0] = 0; a[n + 1] = x;
    for(int i = 1; i <= n; i++){
        scanf("%lld", &a[i]);
        if (a[i] - a[i - 1] < l)
            l = a[i] - a[i - 1];
    }
    if (a[n + 1] - a[n] < l)
        l = a[n + 1] - a[n];
    sort(a, a + n + 2);
    ans = search(0, x);
    cout << ans;
    return 0;
}
```

[POJ1064](http://poj.org/problem?id=1064)

```cpp
#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdlib>
#include<climits>
#include<sstream>
#include<vector>
#include<cstdio>
#include<string>
#include<stack>
#include<queue>
#include<cmath>
#include<map>
#include<set>
#define inf 100005.0

typedef long long ll;
using namespace std;

double cable[10005];
int n, k;

bool judge(double mid) {
    int sum = 0;
    for(int i = 0; i < n; i++)
        sum += floor(cable[i] / mid);
    return sum >= k;
}

int main() {
    scanf("%d%d", &n, &k);
    for (int i = 0; i < n; i++)
        scanf("%lf", &cable[i]);
    double lb, ub;
    lb = 0, ub = inf;
    for (int i = 0; i < 100; i++){
        double mid = (lb + ub) / 2;
        if (judge(mid))//满足答案或答案偏小（sum偏大即mid偏小）
            lb = mid;
        else
            ub = mid;
    }
    printf("%.2lf", floor(lb * 100) / 100);//答案取下界
    return 0;
}
```
