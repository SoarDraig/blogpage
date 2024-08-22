---
sidebar_position: 1
---

# STL:Vector
> 本文仅包含用法，了解更多请访问[C++标准库——STL库之顺序容器](/blog/C++stlA)  

代码示例:
``` cpp
#include <iostream>
#include <vector>

int main() {
    // 创建两个向量 a 和 b
    std::vector<int> a;
    std::vector<int> b = {1, 2, 3, 4, 5, 9, 8}; // 初始化 b

    // (1) 将 b 的前 3 个元素赋值给 a
    a.assign(b.begin(), b.begin() + 3); // a = {1, 2, 3}
    std::cout << "a.assign(b.begin(), b.begin()+3): ";
    for (const auto& val : a) std::cout << val << " ";
    std::cout << std::endl;

    // (2) a 只含 4 个元素，且每个元素为 2
    a.assign(4, 2); // a = {2, 2, 2, 2}
    std::cout << "a.assign(4, 2): ";
    for (const auto& val : a) std::cout << val << " ";
    std::cout << std::endl;

    // (3) 返回 a 的最后一个元素
    std::cout << "a.back(): " << a.back() << std::endl;

    // (4) 返回 a 的第一个元素
    std::cout << "a.front(): " << a.front() << std::endl;

    // (5) 返回 a 的第 i 个元素
    int i = 2;
    std::cout << "a[" << i << "]: " << a[i] << std::endl;

    // (6) 清空 a 中的元素
    a.clear();
    std::cout << "a.clear(): a size = " << a.size() << std::endl;

    // (7) 判断 a 是否为空
    std::cout << "a.empty(): " << (a.empty() ? "true" : "false") << std::endl;

    // (8) 在 a 中添加元素以演示 pop_back
    a.push_back(10);
    a.push_back(20);
    std::cout << "a.push_back(10), a.push_back(20): ";
    for (const auto& val : a) std::cout << val << " ";
    std::cout << std::endl;

    // (8) 删除 a 向量的最后一个元素
    a.pop_back(); // a 现在是 {10}
    std::cout << "a.pop_back(): ";
    for (const auto& val : a) std::cout << val << " ";
    std::cout << std::endl;

    // (9) 删除 a 中的第 1 个到第 2 个元素
    a.push_back(20);
    a.push_back(30);
    std::cout << "a.push_back(20), a.push_back(30): ";
    for (const auto& val : a) std::cout << val << " ";
    std::cout << std::endl;
    
    a.erase(a.begin() + 1, a.begin() + 3); // 删除第 1 和 2 个元素
    std::cout << "a.erase(a.begin() + 1, a.begin() + 3): ";
    for (const auto& val : a) std::cout << val << " ";
    std::cout << std::endl;

    // (10) 在 a 的最后一个向量后插入一个元素，其值为 5
    a.push_back(5); // a = {10, 5}
    std::cout << "a.push_back(5): ";
    for (const auto& val : a) std::cout << val << " ";
    std::cout << std::endl;

    // (11) 在 a 的第 1 个元素的位置插入数值 5
    a.insert(a.begin() + 1, 5); // a = {10, 5, 5}
    std::cout << "a.insert(a.begin() + 1, 5): ";
    for (const auto& val : a) std::cout << val << " ";
    std::cout << std::endl;

    // (12) 在 a 的第 1 个元素的位置插入 3 个数，其值都为 5
    a.insert(a.begin() + 1, 3, 5); // a = {10, 5, 5, 5, 5}
    std::cout << "a.insert(a.begin() + 1, 3, 5): ";
    for (const auto& val : a) std::cout << val << " ";
    std::cout << std::endl;

    // (13) 在 a 的第 1 个元素的位置插入 b 的第 3 个到第 5 个元素
    a.insert(a.begin() + 1, b.begin() + 3, b.begin() + 6); // b = {4, 5, 9}
    std::cout << "a.insert(a.begin() + 1, b + 3, b + 6): ";
    for (const auto& val : a) std::cout << val << " ";
    std::cout << std::endl;

    // (14) 返回 a 中元素的个数
    std::cout << "a.size(): " << a.size() << std::endl;

    // (15) 返回 a 在内存中总共可以容纳的元素个数
    std::cout << "a.capacity(): " << a.capacity() << std::endl;

    // (16) 将 a 的现有元素个数调至 10 个
    a.resize(10); // a = {10, 5, 5, 5, 5, 0, 0, 0, 0, 0}
    std::cout << "a.resize(10): ";
    for (const auto& val : a) std::cout << val << " ";
    std::cout << std::endl;

    // (17) 将 a 的现有元素个数调至 10 个，其值为 2
    a.resize(10, 2); // a = {10, 5, 5, 5, 5, 2, 2, 2, 2, 2}
    std::cout << "a.resize(10, 2): ";
    for (const auto& val : a) std::cout << val << " ";
    std::cout << std::endl;

    // (18) 将 a 的容量扩充至 100
    a.reserve(100);
    std::cout << "a.reserve(100): a.capacity() = " << a.capacity() << std::endl;

    // (19) b 为向量，将 a 中的元素和 b 中的元素进行整体性交换
    std::vector<int> b2 = {7, 8, 9}; // 新建一个 b2
    a.swap(b2); // 交换 a 和 b2 的元素
    std::cout << "a.swap(b2): ";
    for (const auto& val : a) std::cout << val << " ";
    std::cout << std::endl;

    // (20) 返回指向容器第一个元素的迭代器
    auto it = a.begin();
    std::cout << "a.begin(): " << *it << std::endl;

    // (21) 返回指向容器最后一个元素的迭代器
    auto itEnd = a.end();
    std::cout << "a.end(): " << *(--itEnd) << std::endl;

    // (22) 向量的比较操作
    std::cout << "a == b2: " << (a == b2 ? "true" : "false") << std::endl;

    return 0;
}


