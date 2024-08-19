---
slug: LuaNew
title: Lua特性初见
tags: [Lua]
date: 2024-08-19
keywords: [Lua]
draft: false
hide_table_of_contents: false
---

对Lua来说，元表用于实现 Lua 中对象的行为，如运算符重载和函数调用。而协程提供了轻量级的线程，允许程序暂停和恢复执行，适合于异步操作和生成器。
<!--truncate-->
---
在这个示例中：

 - y 捕捉了外部变量 x 并进行了初始化，同时修改了 r 的值。 
 - z 捕捉了一个字符串字面值 "string"。 
 - circle_area捕捉了一个 std::unique_ptr 对象 myPi，并通过 std::move 将其移动到 Lambda 表达式中。
## 其他特性
### `constexpr` 和 `exception` 关键字

- **`constexpr`**：指定 Lambda 表达式为常量表达式：
  ```cpp
  constexpr auto f = [](int x) -> int { return x * 2; };
  static_assert(f(3) == 6, "f(3) should be 6");
  ```

- **`exception`**：指定 Lambda 表达式可以抛出的异常：
  ```cpp
  auto f = [](int x) noexcept -> int { 
      return x * 2; 
  }; 
  ```

### nodiscard和maybe_unused关键字

- **`[[nodiscard]]`**：防止忽略返回值：

```cpp
auto f = [](int x) -> int [[nodiscard]] { 
    return x * 2; 
};

int main() {
    f(10); // 如果忽略返回值，编译器可能会给出警告
    return 0;
}
```

- **`[[maybe_unused]]`**：标记可能未使用的参数：

```cpp
auto f = [](int x [[maybe_unused]]) { 
    // 可能不使用x 
};

int main() {
    f(10); // 不会有警告，即使x未被使用
    return 0;
}

```
好了，以上就是所有内容了，欢迎点赞与收藏，如果错误，恳请指正。

总结摘要