---
sidebar_position: 7
---

# 智能指针与RAII
## 一、智能指针 (Smart Pointers)
> 博客[关于智能指针的再学习与理解。](/blog/C++AdPtr)有着更完整的知识点与理解，建立优先学习博客内容。

### 1. 定义
智能指针是一种用于管理动态分配内存的对象，它能够自动释放所指向的内存，从而减少内存泄漏的风险。智能指针可以认为是对指针的封装，提供了与指针相同的方法。  
智能指针的本质是在封装与栈，还可以认为是RAII的一种实现。即完全离开作用域触发GC。

### 2. 类型
智能指针主要有以下几种类型：

- **`std::unique_ptr`**：
  - 表示独占所有权的智能指针。
  - 不能被复制，只能移动。
  - 当 `std::unique_ptr` 超出作用域时，所管理的内存会自动释放。
  
```cpp
  std::unique_ptr<int> ptr(new int(5)); // 创建一个unique_ptr
  std::unique_ptr<int> ptr1 = std::move(ptr1); // 转移所有权
```

- **`std::shared_ptr`**：
  - 表示共享所有权的智能指针。
  - 允许多个指针共享同一内存资源。
  - 使用引用计数来跟踪指向同一内存的智能指针数量，当引用计数归零时，内存自动释放。

```cpp
  std::shared_ptr<int> ptr1(new int(5)); // 创建一个shared_ptr
  std::shared_ptr<int> ptr2 = ptr1; // ptr1 和 ptr2 共享同一内存
```

- **`std::weak_ptr`**：
  - 与 `std::shared_ptr` 结合使用，提供对共享资源的非拥有引用。
  - 防止循环引用导致的内存泄漏。

```cpp
  std::shared_ptr<int> ptr1(new int(5)); // 创建一个shared_ptr
  std::shared_ptr<int> ptr2 = ptr1; // ptr1 和 ptr2 共享同一内存
  std::weak_ptr<int> weakPtr = ptr1; // 创建一个weak_ptr，不增加引用计数
```

### 3. 优势
- **自动内存管理**：智能指针可以自动管理内存，减少了手动释放内存的麻烦。
- **防止内存泄漏**：通过 RAII（资源获取即初始化）机制，智能指针能够确保资源在超出作用域时被正确释放。
- **异常安全**：智能指针能有效处理异常情况，确保资源的正确释放。

## 二、RAII (Resource Acquisition Is Initialization)

### 1. 定义
RAII 是一种编程技术，主要用于管理资源的生命周期。其基本理念是：资源的获取与对象的生命周期相绑定，当对象被创建时获取资源，当对象超出作用域时自动释放资源。

### 2. 特点
- **自动管理资源**：RAII 通过对象的构造和析构函数自动管理资源，如内存、文件句柄和网络连接等。
- **异常安全**：RAII 可以保证在异常发生时资源被正确释放，从而防止资源泄漏。
  
### 3. 示例
以下是一个简单的 RAII 示例，演示如何管理动态分配的内存：

```cpp
#include <iostream>

class Resource {
public:
    Resource() {
        data = new int[100]; // 获取资源
        std::cout << "Resource acquired." << std::endl;
    }
    ~Resource() {
        delete[] data; // 释放资源
        std::cout << "Resource released." << std::endl;
    }
private:
    int* data;
};

void func() {
    Resource res; // 创建 RAII 对象
    // 在此处使用资源
}

int main() {
    func(); // 离开作用域时，资源会自动释放
    return 0;
}
```

### 4. 智能指针与RAII的关系
智能指针是 RAII 的一种实现。它们在构造时获取资源（例如动态分配内存），并在析构时自动释放资源。通过智能指针，可以方便地实现 RAII，使得资源管理更加安全和高效。

## 3. 关于指针与智能指针的个人理解
**我认为智能指针才应该算是真正意义的指针，脱离内容的指针毫无意义，作为专门指向内容的类型，就应与其绑定的内容共享生命周期。**   
**或者说，智能指针是开发用的，而指针是更为底层的类型。就像Vector和基础数组的关系一样。**