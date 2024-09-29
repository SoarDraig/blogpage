---
sidebar_position: 18
---

# List、Vector、Map、Set
:::info
本文仅包含用法，了解更多请访问  
[C++标准库——STL库之顺序容器](/blog/C++stlA)  
[C++关于关联容器的理解感悟](/blog/C++stlB)
:::

## std::vector
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
```

## std::list
代码示例:
``` cpp
#include <iostream>
#include <list>

int main() {
    // 创建一个空的 List
    std::list<int> myList;

    // (1) 添加元素
    myList.push_back(10); // 尾部添加 10
    myList.push_back(20); // 尾部添加 20
    myList.push_front(5); // 头部添加 5
    std::cout << "添加元素后: ";
    for (const auto& val : myList) std::cout << val << " "; // 输出: 5 10 20
    std::cout << std::endl;

    // (2) 获取第一个和最后一个元素
    std::cout << "第一个元素: " << myList.front() << std::endl; // 输出: 5
    std::cout << "最后一个元素: " << myList.back() << std::endl; // 输出: 20

    // (3) 删除元素
    myList.remove(10); // 删除值为 10 的元素
    std::cout << "删除 10 后: ";
    for (const auto& val : myList) std::cout << val << " "; // 输出: 5 20
    std::cout << std::endl;

    // (4) 在指定位置插入元素
    auto it = myList.begin(); // 获取指向第一个元素的迭代器
    ++it; // 移动到第二个元素
    myList.insert(it, 15); // 在第二个位置插入 15
    std::cout << "在第二个位置插入 15 后: ";
    for (const auto& val : myList) std::cout << val << " "; // 输出: 5 15 20
    std::cout << std::endl;

    // (5) 清空 List
    myList.clear(); // 清空 List
    std::cout << "清空后: myList.size() = " << myList.size() << std::endl; // 输出: 0

    // (6) 检查 List 是否为空
    std::cout << "myList.empty(): " << (myList.empty() ? "true" : "false") << std::endl; // 输出: true

    // (7) 添加元素以演示 pop_front 和 pop_back
    myList.push_back(30);
    myList.push_back(40);
    myList.push_back(50);
    std::cout << "添加元素后: ";
    for (const auto& val : myList) std::cout << val << " "; // 输出: 30 40 50
    std::cout << std::endl;

    // (8) 删除第一个元素
    myList.pop_front(); // 删除头部元素
    std::cout << "pop_front 后: ";
    for (const auto& val : myList) std::cout << val << " "; // 输出: 40 50
    std::cout << std::endl;

    // (9) 删除最后一个元素
    myList.pop_back(); // 删除尾部元素
    std::cout << "pop_back 后: ";
    for (const auto& val : myList) std::cout << val << " "; // 输出: 40
    std::cout << std::endl;

    // (10) 在 List 中查找元素
    myList.push_back(60);
    myList.push_back(70);
    std::cout << "添加元素后: ";
    for (const auto& val : myList) std::cout << val << " "; // 输出: 40 60 70
    std::cout << std::endl;

    // 查找元素 60
    it = std::find(myList.begin(), myList.end(), 60);
    if (it != myList.end()) {
        std::cout << "找到元素 60" << std::endl;
    } else {
        std::cout << "未找到元素 60" << std::endl;
    }

    return 0;
}
```
## `std::map`
`std::map` 是一个键值对集合，键是唯一的。下面的示例演示如何创建、插入、查找和删除 map 中的元素。
``` cpp
#include <iostream>
#include <map>
#include <string>

int main() {
    // 创建一个空的 Map
    std::map<std::string, int> scoreMap;

    // (1) 添加元素
    scoreMap["Alice"] = 90; // 添加键值对 (Alice, 90)
    scoreMap["Bob"] = 85;   // 添加键值对 (Bob, 85)
    scoreMap["Charlie"] = 95; // 添加键值对 (Charlie, 95)

    // (2) 输出所有元素
    std::cout << "成绩表:" << std::endl;
    for (const auto& pair : scoreMap) {
        std::cout << pair.first << ": " << pair.second << std::endl; // 输出: 姓名: 分数
    }

    // (3) 查找元素
    std::string name = "Bob";
    if (scoreMap.find(name) != scoreMap.end()) {
        std::cout << name << " 的分数: " << scoreMap[name] << std::endl; // 输出: Bob 的分数: 85
    } else {
        std::cout << name << " 不在成绩表中。" << std::endl;
    }

    // (4) 删除元素
    scoreMap.erase("Alice"); // 删除键为 "Alice" 的元素
    std::cout << "删除 Alice 后的成绩表:" << std::endl;
    for (const auto& pair : scoreMap) {
        std::cout << pair.first << ": " << pair.second << std::endl; // 输出剩余元素
    }

    return 0;
}
```

## `std::set`
`std::set` 是一个唯一元素的集合，自动排序且不允许重复元素。下面的示例演示如何创建、插入、查找和删除 set 中的元素。
``` cpp
#include <iostream>
#include <set>

int main() {
    // 创建一个空的 Set
    std::set<int> mySet;

    // (1) 添加元素
    mySet.insert(30);
    mySet.insert(10);
    mySet.insert(20);
    mySet.insert(20); // 尝试插入重复元素，插入不会成功

    // (2) 输出所有元素
    std::cout << "集合中的元素:" << std::endl;
    for (const auto& val : mySet) {
        std::cout << val << " "; // 输出: 10 20 30
    }
    std::cout << std::endl;

    // (3) 查找元素
    int searchValue = 20;
    if (mySet.find(searchValue) != mySet.end()) {
        std::cout << "找到了元素 " << searchValue << std::endl; // 输出: 找到了元素 20
    } else {
        std::cout << "未找到元素 " << searchValue << std::endl;
    }

    // (4) 删除元素
    mySet.erase(10); // 删除值为 10 的元素
    std::cout << "删除 10 后的集合:" << std::endl;
    for (const auto& val : mySet) {
        std::cout << val << " "; // 输出: 20 30
    }
    std::cout << std::endl;

    return 0;
}
```