---
title: "POJ4048"
date: '2014-08-21'
spoiler: "计算几何 + 暴力枚举"
---

[题目链接](http://poj.org/problem?id=4048)

整个暑假都在忙ACM集训的事，也是很久没写过博客了。今天的这道题其实挺无脑的，不过是我在组队赛中拿到的第一个FB，颇有纪念意义。

题目的大意是，给你n条线段和一个起点，从起点出发作一条射线，求能经过的最多的线段。n >= 1500，坐标范围是[-10000,10000]。

注意有坐标范围，所以用一个在坐标范围外的点和起点构成的线段来代替射线，这样就转化为判断线段之间是否相交的问题了。

关键在于枚举射线的方法，容易发现，枚举各线段端点与起点构成的射线即可，然后每构造一条射线就枚举所有线段，判断这些线段是否与之相交。时间复杂度是O(n^2)。

注意此句：**Jiang Wei may possibly stand extremely close to one of the straw wall.**，由于输入的点都是整数点，其实这句的意思就是线段端点有可能与起点重合（当然也可能在线段上），所以我们可以一开始就筛除这样的线段,然后每次数相交线段时都算上就行。

```cpp
#include <algorithm>
#include <climits>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <iostream>
#include <map>
#include <queue>
#include <set>
#include <sstream>
#include <stack>
#include <string>
#include <vector>
#define MAXN 2000

typedef long long ll;
typedef unsigned long long ull;
using namespace std;

// Point
struct Point {
    double x, y;
    // constructor
    Point(double x = 0, double y = 0) : x(x), y(y) {}
};
// Vector
typedef Point Vector;

// Vector+Vector=Vector
Vector operator+(Vector A, Vector B) { return Vector(A.x + B.x, A.y + B.y); }

// Point-Point=Vector or Vector-Vector=Vector
Vector operator-(Point A, Point B) { return Vector(A.x - B.x, A.y - B.y); }

// Vector*p=Vector
Vector operator*(Vector A, double p) { return Vector(A.x * p, A.y * p); }

// Vector/p=Vector
Vector operator/(Vector A, double p) { return Vector(A.x / p, A.y / p); }

// Point comparision
bool operator<(const Point& a, const Point& b) {
    if (a.x == b.x) {
        return a.y < b.y;
    } else
        return a.x < b.x;
}

// precious
const double eps = 1e-10;
int dcmp(double x) {
    if (fabs(x) < eps)
        return 0;
    else
        return x < 0 ? -1 : 1;
}

// Point=Point?
bool operator==(const Point& a, const Point& b) {
    return dcmp(a.x - b.x) == 0 && dcmp(a.y - b.y) == 0;
}

double Dot(Vector A, Vector B) { return A.x * B.x + A.y * B.y; }

double Length(Vector A) { return sqrt(Dot(A, A)); }

double Angle(Vector A, Vector B) {
    return acos(Dot(A, B) / Length(A) / Length(B));
}

double Cross(Vector A, Vector B) { return A.x * B.y - A.y * B.x; }

double Area2(Point A, Point B, Point C) { return Cross(B - A, C - A); }

Vector Rotate(Vector A, double rad) {
    return Vector(A.x * cos(rad) - A.y * sin(rad),
                  A.x * sin(rad) + A.y * cos(rad));
}

// Please ensure that A cannot be 0
Vector Normal(Vector A) {
    double L = Length(A);
    return Vector(-A.y / L, A.x / L);
}

// line1:P+vt line2:Q+wt
// Please ensure that two lines has only one common point(cross(v,w)!=0)
Point GetLineIntersection(Point P, Vector v, Point Q, Vector w) {
    Vector u = P - Q;
    double t = Cross(w, u) / Cross(v, w);
    return P + v * t;
}

double DistanceToLine(Point P, Point A, Point B) {
    Vector v1 = B - A, v2 = P - A;
    return fabs(Cross(v1, v2)) / Length(v1);
}

double DistanceToSegment(Point P, Point A, Point B) {
    if (A == B) return Length(P - A);
    Vector v1 = B - A, v2 = P - A, v3 = P - B;
    if (dcmp(Dot(v1, v2)) < 0)
        return Length(v2);
    else if (dcmp(Dot(v1, v3)) > 0)
        return Length(v3);
    else
        return fabs(Cross(v1, v2)) / Length(v1);
}

//不算任一线段的端点
bool SegmentProperIntersection(Point a1, Point a2, Point b1, Point b2) {
    double c1 = Cross(a2 - a1, b1 - a1), c2 = Cross(a2 - a1, b2 - a1),
           c3 = Cross(b2 - b1, a1 - b1), c4 = Cross(b2 - b1, a2 - b1);
    return dcmp(c1) * dcmp(c2) < 0 && dcmp(c3) * dcmp(c4) < 0;
}

//不包含线段的端点
bool OnSegment(Point p, Point a1, Point a2) {
    return dcmp(Cross(a1 - p, a2 - p)) == 0 && dcmp(Dot(a1 - p, a2 - p)) < 0;
}

//多边形有向面积
double PolygonArea(Point* p, int n) {
    double area = 0;
    for (int i = 1; i < n - 1; i++) area += Cross(p[i] - p[0], p[i + 1] - p[0]);
    area /= 2;
    return area;
}

Point pa[MAXN], pb[MAXN];

int main() {
    int t;
    scanf("%d", &t);
    for (int cas = 1; cas <= t; cas++) {
        int n;
        scanf("%d", &n);
        for (int i = 0; i < n; i++)
            scanf("%lf%lf%lf%lf", &pa[i].x, &pa[i].y, &pb[i].x, &pb[i].y);
        Point s;
        scanf("%lf%lf", &s.x, &s.y);
        vector<Point> aa, bb;
        int basecnt = 0;
        for (int i = 0; i < n; i++) {
            if (pa[i] == s)
                basecnt++;
            else if (pb[i] == s)
                basecnt++;
            else if (OnSegment(s, pa[i], pb[i]))
                basecnt++;
            else {
                aa.push_back(pa[i]);
                bb.push_back(pb[i]);
            }
        }
        n = aa.size();
        int ans = basecnt;
        for (int i = 0; i < n; i++) {
            Point t;
            if (dcmp(s.x - aa[i].x) == 0) {
                t.x = s.x;
                if (aa[i].y > s.y)
                    t.y = 10100;
                else
                    t.y = -10100;
            } else {
                if (s.x < aa[i].x) {
                    t.x = 10100;
                    t.y = (aa[i].y - s.y) / (aa[i].x - s.x) * (t.x - s.x) + s.y;
                } else if (s.x > aa[i].x) {
                    t.x = -10100;
                    t.y = (aa[i].y - s.y) / (aa[i].x - s.x) * (t.x - s.x) + s.y;
                }
            }
            int cnt = basecnt;
            for (int i = 0; i < n; i++) {
                if (OnSegment(aa[i], s, t) || OnSegment(bb[i], s, t) ||
                    SegmentProperIntersection(aa[i], bb[i], s, t)) {
                    cnt++;
                }
            }
            if (cnt > ans) ans = cnt;
        }
        for (int i = 0; i < n; i++) {
            Point t;
            if (dcmp(s.x - bb[i].x) == 0) {
                t.x = s.x;
                if (bb[i].y > s.y)
                    t.y = 10100;
                else
                    t.y = -10100;
            } else {
                if (s.x < bb[i].x) {
                    t.x = 10100;
                    t.y = (bb[i].y - s.y) / (bb[i].x - s.x) * (t.x - s.x) + s.y;
                } else if (s.x > bb[i].x) {
                    t.x = -10100;
                    t.y = (bb[i].y - s.y) / (bb[i].x - s.x) * (t.x - s.x) + s.y;
                }
            }
            int cnt = basecnt;
            for (int i = 0; i < n; i++) {
                if (OnSegment(bb[i], s, t) || OnSegment(bb[i], s, t) ||
                    SegmentProperIntersection(bb[i], bb[i], s, t)) {
                    cnt++;
                }
            }
            if (cnt > ans) ans = cnt;
        }
        printf("%d", ans);
        if (cas != t) printf("\n");
    }
    return 0;
}
```
