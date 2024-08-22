---
sidebar_position: 2
---
# STL:Map&Set
> 浅显的理解跳转[C++关于关联容器的理解感悟](/blog/C++stlB)
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