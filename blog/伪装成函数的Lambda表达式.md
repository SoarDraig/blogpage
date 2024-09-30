---
slug: Lambda
title: 伪装成函数的Lambda表达式
tags: [C++, Programming]
date: 2024-04-28
keywords: [C++, Advanced Programming, Lambda]
summary: "Lambda 表达式是 C++11 引入的一种内嵌的匿名函数，其功能类似于一个在函数体内定义的特殊函数，主要用于处理局部逻辑和数据封装。它的作用范围仅限于定义它的函数块，能够捕获外部变量并进行操作。"
draft: false
---
Lambda 表达式是 C++11 引入的一种 内嵌 的 匿名函数，其功能类似于一个在函数体内定义的特殊函数，主要用于处理局部逻辑和数据封装。它的作用范围仅限于定义它的函数块，能够捕获外部变量并进行操作。
<!--truncate-->
---


# C++ Lambda 表达式

Lambda 表达式是C++11引入的一种**内嵌**的**匿名函数**。
## 核心与理解
我个人的理解是，可以在函数体内，写的一种特殊的函数。它的作用域只有它自己的函数块，其可以捕获外部变量，如果捕获方式是引用，就和平常指针一样，“拥有这些变量”。如果捕获方式是值，就通过副本保存下来这个值。也就是，Lambda是一个可以认为独立于原函数的一个匿名函数。
！**可以认为在实际使用中，Lambda表达式，可以通过传参，保存此时的“状态”，并且持久化这个状态（如果是引用捕获，会存在被修改的可能，如果是值传递，则永久保持这个状态），进行数据封装，同时用于处理一些逻辑。这也是我对“***闭包***”这个概念的理解。**
如果不容易理解，可以先去看后面的语法，在回来看这块内容。

```cpp
//大家无需看懂这个表达式，毕竟语法还没开始学习。这儿就理解一下，
int main()
{
    int x = 10;
    // Lambda 表达式捕获 x
    auto lambda = [x]() mutable
    {
        x += 5; // 修改内部变量 x
        std::cout << "x = " << x << std::endl;
    };
    lambda(); // 输出 x = 15 部x = 10 + 5;
    x = x + 20; // 这里修改的是外部;
    lambda(); // 输出 x = 20  内部第二次调用 x = 15 + 5;

    return 0;
}
```
引用：
```cpp
//大家无需看懂这个表达式，毕竟语法还没开始学习。这儿就理解一下，
int main() {
    int x = 10;

    // Lambda 表达式引用捕获 x 
    auto lambda = [&x]() {
        x += 5;  // 修改外部变量 x，如同指针，这里的x是外部的
        std::cout << "x = " << x << std::endl;
    };

    lambda(); // 输出 x = 15 , x = 10 + 5;
    x = x + 20;  // 这里修改的是外部; x = 15 + 20 = 30;
    lambda(); // 输出 x = 40  内部第二次调用 x = 35 + 5;

    return 0;
}
```
如果能理解这个核心思想，Lambda就差不多完全掌握了，高级特性对于熟练编程的人来说，难的不是如何用，而是为什么用，为什么要去用。
好，以下便是基础学习部分。
## 基础知识
### 知识点：语法
#### 完整语法

```cpp
[capture list] (params list) mutable(optional) constexpr(optional)(C++17) exception attribute -> return type { function body };
//绝大多数使用为：[捕捉]（形参）->int {函数体}
```

- capture list：捕获外部变量列表，**不能省略**；（可认为是“**传入值**”）；
- params list：**形参列表**，**可以省略**（但是后面必须紧跟函数体）；
- mutable指示符： 可选，将lambda表达式标记为`mutable`后，函数体就可以**修改传值方式捕获的变量**；
- constexpr：可选，C++17，可以指定lambda表达式是一个**常量函数**；
- exception：异常设定， 可选，指定lambda表达式**可以抛出的异常**；
- attribute：可选，指定lambda表达式的**特性**；
- return type：**返回类型**
- function body：**函数体**
#### 简化语法

在实际使用中，Lambda 表达式的语法可以简化为以下几种形式：

1. **指定返回类型**：
   ```cpp
   [capture list] (params list) -> return type { function body };
   
   std::transform(vi.begin(), vi.end(), vi.begin(), 
        [](int i) -> int { 
            if (i < 0) 
                return -i;
            else 
                return i;
        }
    );
   ```

2. **省略返回类型**：
   ```cpp
   [capture list] (params list) { function body };
	
	std::transform(vi.begin(), vi.end(), vi.begin(), 
        [](int i) { 
            return i < 0 ? -i : i; 
        }
    );
   ```

3. **省略参数列表和返回类型**：
   ```cpp
   [capture list] { function body };
   
   auto printMessage = [a] { 
        std::cout << "Value of a is: " << a << std::endl; 
    };
   ```

### 知识点：捕获外部变量

Lambda 表达式可以通过捕获外部变量来访问其周围的上下文。捕获方式有以下几种：

1. **值捕获**：
   ```cpp
   int a = 123;
   auto f = [a] { 
       std::cout << a << std::endl; 
   };
   f(); // 输出：123
   a = 321;
   f(); // 输出：123
   ```

2. **引用捕获**：
   ```cpp
   int a = 123;
   auto f = [&a] { 
       std::cout << a << std::endl; 
   }; 
   a = 321;
   f(); // 输出：321
   ```

3. **隐式捕获**：
   - **值捕获**：
     ```cpp
     int a = 123, b = 321;                     
     auto df = [=] { 
         std::cout << a << b << std::endl; 
     }; 
     ```
   - **引用捕获**：
     ```cpp
     int a = 123, b = 321;                     
     auto rf = [&] { 
         std::cout << a << b << std::endl; 
     }; 
     ```

### 知识点：参数列表
Lambda表达式的参数定义和C++函数方法存在一些不同。
主要为：

- 参数列表中不能有默认参数。

```cpp
auto lambda = [](int a, int b = 10) { // 错误：Lambda 表达式中不允许默认参数
    std::cout << "a = " << a << ", b = " << b << std::endl;
};
```

- ~~不支持可变类型参数。~~ （C++14引入，C++17扩展，现在已经允许，见后文）

```cpp
auto lambda = [](auto... args) { // 错误：Lambda 表达式不支持可变参数
    (std::cout << ... << args) << std::endl;
};
```

- 所有参数必须有参数名。

```cpp
auto lambda = [](int a, int) { // 错误：Lambda 表达式中的参数必须有名称
    std::cout << "a = " << a << std::endl;
};
```

### 知识点：返回类型

- **单一返回语句**：Lambda 表达式只有一个`return`语句时，可以自动推断：
  ```cpp
  std::transform(vi.begin(), vi.end(), vi.begin(), 
      [](int i) { 
          return i < 0 ? -i : i; 
      }
  );
  ```

- **多语句**：当 Lambda 表达式包含多个`return`语句时，必须显式指定返回类型：
  ```cpp
  std::transform(vi.begin(), vi.end(), vi.begin(), 
      [](int i) -> int { 
          if (i < 0) 
              return -i;
          else 
              return i;
      }
  );
  ```

### `知识点：mutable` 关键字

允许函数对传入的**值**进行修改，如果不进行`mutable`修饰，那么无法修改传入的**值**，引用不受限制；
- **使用示例**：
  ```cpp
  int x = 10;
  auto f = [x]() mutable { 
      x++;  // 修改的是捕获的副本，不是外部变量 x
      std::cout << x << std::endl; 
  }; 
  f(); // 输出：11
  std::cout << x << std::endl; // 输出：10
  ```
## 新特性
### 泛型lambda表达式
在 C++14 中，Lambda 表达式得到了增强，支持泛型编程。泛型 Lambda 表达式允许使用 auto 关键字来表示参数类型，这样可以在调用时根据传入参数的类型自动推断。这种功能类似于模板函数，可以提高代码的灵活性和复用性。

```cpp
// 泛型 Lambda 表达式示例
auto add = [](auto x, auto y) { return x + y; };

int main() {
    int intResult = add(2, 3);           // 5
    double doubleResult = add(2.5, 3.5); // 6.0
    std::string strResult = add(std::string("Hello, "), std::string("world!")); // Hello, world!

    std::cout << "intResult: " << intResult << std::endl;
    std::cout << "doubleResult: " << doubleResult << std::endl;
    std::cout << "strResult: " << strResult << std::endl;

    return 0;
}
```
### Lambda 捕捉表达式
C++14 引入了 Lambda 捕捉表达式，允许 Lambda 表达式捕捉任意类型的表达式结果。捕捉表达式可以按复制或引用方式捕捉作用域内的变量，甚至可以捕捉右值。这使得 Lambda 表达式更加灵活，特别是在处理复杂对象和右值引用时。

```cpp

int main() {
    // 捕捉外部变量并进行初始化
    int x = 4;
    auto y = [&r = x, x = x + 1] { r += 2; return x * x; }();
    std::cout << "x: " << x << ", y: " << y << std::endl; // 输出：x: 6, y: 25

    // 直接用字面值初始化捕捉变量
    auto z = [str = "string"] { return str; }();
    std::cout << "z: " << z << std::endl; // 输出：z: string

    // 捕捉不能复制的对象
    auto myPi = std::make_unique<double>(3.1415);
    auto circle_area = [pi = std::move(myPi)](double r) { return *pi * r * r; };
    std::cout << "Circle area with radius 1: " << circle_area(1.0) << std::endl; // 输出：3.1415

    return 0;
}
```
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