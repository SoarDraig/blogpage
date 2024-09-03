---
slug: C++push_back&emplace_back
title: 从源代码看push_back与emplace_back
tags:
  - C++
  - Programming
date: 2024-09-03
summary: "深入探讨 C++ 中的 push_back 和 emplace_back 的区别，通过源代码分析性能优化及构造行为。"
keywords: [C++, push_back, emplace_back, std::vector, 拷贝构造, 移动构造, 性能优化, 完美转发, 源代码分析, 容器]
draft: false
hide_table_of_contents: false
---

为更好地理解这两者的区别，我决定通过源代码进行深入研究。本文将分析这两个函数的实现机制，探讨它们在性能和使用上的差异，并总结在使用时的最佳实践。
<!--truncate-->
## 引入
最近在复习C++，正好看到 `push_back` 与 `emplace_back`，网上的教程各有说辞，令人困惑。为了更好地理解这两者的区别，我决定自己动手看看源代码，研究研究。

首先，让我们看一个常见的观点：

> `vector` 的函数 `emplace_back()`  
> 它和 `push_back()` 函数一样，都是用来在容器尾部插入一个元素。  
> 区别在于，使用 `push_back()` 需要调用拷贝构造函数，而 `emplace_back()` 则是原地构造元素，不会触发拷贝构造，因此效率更高。

我们暂且不讨论这个观点的准确性，直接来看看以下的代码示例：
```cpp
std::vector<A> v;
v.reserve(10);

A tem = A(1);  
// A Construction2
A tem3 = A(1); 
// A Construction2

v.emplace_back(1); 
// A Construction2

v.push_back(1); 
// A Construction2
// A Move Construction

v.emplace_back(tem); 
// A Copy Construction

v.push_back(tem); 
// A Copy Construction

v.emplace_back(A(1));
// A Construction2
// A Move Construction

v.push_back(A(1));
// A Construction2
// A Move Construction

v.push_back(std::move(A(1))); 
// A Construction2
// A Move Construction

v.emplace_back(std::move(A(1))); 
// A Construction2
// A Move Construction

v.push_back(std::move(tem3)); 
// A Move Construction

v.emplace_back(std::move(tem)); 
// A Move Construction
```

从代码中我们可以明显看出，只有在直接传入参数构造时，`push_back` 和 `emplace_back` 的行为存在差异。  
有小伙伴可能会疑惑，以下部分似乎有些不妥：
```cpp
v.emplace_back(1); 
// A Construction2

v.push_back(1);  // 传入1？不应该传入A类对象吗？
// A Construction2
// A Move Construction
```
由此可见：
- 两者之间的区别仅在于直接构造时的使用参数传递。
- 而由于 `push_back` 只能接受对象，若忽略多余的构造过程，两者实际上没有本质区别。

> 此过程指的是 `v.push_back(1);` 将 `1` 构造为 `A` 类对象。

因此，可以得出结论：这两者在本质上并没有太大的差异，在程序员视角中，甚至可以认为**没有差距**。
## 源代码分析

### 1. `push_back(左值)`

这是 `push_back` 的左值引用版本，用于向 `std::vector` 添加元素，具体步骤如下：

```cpp
push_back(const value_type& __x) {
    if (this->_M_impl._M_finish != this->_M_impl._M_end_of_storage) {
        _GLIBCXX_ASAN_ANNOTATE_GROW(1);
        _Alloc_traits::construct(this->_M_impl, this->_M_impl._M_finish, __x);
        ++this->_M_impl._M_finish;
        _GLIBCXX_ASAN_ANNOTATE_GREW(1);
    } else {
        _M_realloc_insert(end(), __x);
    }
}
```

#### 解析：

- **检查容量**：
  ```cpp
  if (this->_M_impl._M_finish != this->_M_impl._M_end_of_storage)
  ```
  - `_M_finish` 指向当前 `vector` 的最后一个元素的下一个位置。
  - `_M_end_of_storage` 是 `vector` 当前分配的内存的结束位置。
  - 当 `_M_finish` 不等于 `_M_end_of_storage` 时，说明还有空间可以添加新元素。

- **构造元素**：
  ```cpp
  _Alloc_traits::construct(this->_M_impl, this->_M_impl._M_finish, __x);
  ```
  - 使用分配器构造一个新元素，内容与 `__x` 相同。
  - 这实际上是调用 `__x` 的拷贝构造函数。

- **更新状态**：
  ```cpp
  ++this->_M_impl._M_finish;
  ```
  - 增加 `_M_finish` 的值，以反映新元素的添加。

- **处理异常**：
  - `_GLIBCXX_ASAN_ANNOTATE_GROW(1)` 和 `_GLIBCXX_ASAN_ANNOTATE_GREW(1)` 用于 AddressSanitizer 的注释，帮助检测内存使用问题。

- **重新分配内存**：
  ```cpp
  else
  _M_realloc_insert(end(), __x);
  ```
  - 如果没有足够的空间，调用 `_M_realloc_insert` 来重新分配内存并插入元素 `__x`。
#### 省流：
若传入的是**左值**，则在Vector中调用**拷贝构造函数**，构造新对象。

### 2. `push_back(右值)`

这是 `push_back` 的右值引用版本，适用于移动语义。它的实现非常简洁，实际上调用了 `emplace_back`：

```cpp
void push_back(value_type&& __x) {
    emplace_back(std::move(__x));
}
```

#### 解析：

- **移动构造**：
  - `std::move(__x)` 将 `__x` 转换为右值，使其可以被移动。
  - 这个版本会直接调用 `emplace_back`，实现更高效的元素添加。
#### 省流：
如果传入的是**右值**，`push_back` 会调用**emplace_back**来构造新对象。


### 3. `emplace_back()`

这是一个可变参数模板函数，用于在 `vector` 中就地构造新元素。

```cpp
template<typename... _Args>
void emplace_back(_Args&&... __args) {
    if (this->_M_impl._M_finish != this->_M_impl._M_end_of_storage) {
        _GLIBCXX_ASAN_ANNOTATE_GROW(1);
        _Alloc_traits::construct(this->_M_impl, this->_M_impl._M_finish, std::forward<_Args>(__args)...);
        ++this->_M_impl._M_finish;
        _GLIBCXX_ASAN_ANNOTATE_GREW(1);
    } else {
        _M_realloc_insert(end(), std::forward<_Args>(__args)...);
    }
}
```

#### 解析：

- **检查容量**：
  - 与 `push_back` 类似，首先检查当前 `vector` 是否有足够的空间。

- **就地构造元素**：
  ```cpp
  _Alloc_traits::construct(this->_M_impl, this->_M_impl._M_finish, std::forward<_Args>(__args)...);
  ```
  - 使用 `std::forward` 完美转发参数，使得可以根据参数的类型（左值或右值）调用适当的构造函数。

- **更新状态**：
  - 增加 `_M_finish` 的值，反映新元素的添加。

- **重新分配内存**：
  - 如果没有足够的空间，同样调用 `_M_realloc_insert`。

#### 省流：
触发**完美转发**
- **传入普通参数时调用普通构造函数。**
- **传入左值引用时调用拷贝构造函数。**
- **传入右值引用时调用移动构造函数。**

## 总结

1. **`push_back` 的左值引用版本**会复制元素并添加到 `vector` 中，如果没有空间，则重新分配内存，触发拷贝构造。
2. **`push_back` 的右值引用版本**通过移动语义来提高效率，直接调用 `emplace_back`。
3. **`emplace_back`** 允许在 `vector` 中直接构造元素，使用完美转发来支持多种参数类型，进一步优化性能。

所以遇到问题可以去翻阅源代码，能够更加清晰的了解这些功能。