---
sidebar_position: 2
---

# STL:List
> 本文仅包含用法，了解更多请访问[C++标准库——STL库之顺序容器](/blog/C++stlA)

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
