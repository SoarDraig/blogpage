---
slug: C++Learn1
title: C++高级特性——左值、右值，移动语义，完美转发，RVO。
tags:
  - C++
  - Programming
date: 2024-04-18
keywords:
  - C++
  - Advanced Programming
draft: false
hide_table_of_contents: false
---
本文章总结了C++中的左值与右值、左右值引用、移动语义、完美转发以及返回值优化（RVO）的概念和应用。
<!--truncate-->
---
# 前言

过去在学校上了高级程序语言设计（C），面向对象程序设计以及数据结构与算法分析，学到了C++的基础，但随着使用的深入（如，Unity&&Unreal底层逻辑），等等，对C++提出了更多的挑战，尝试学习的时候才发现原来C++还有那么多表面上看不到的功能，高级特性也几乎没接触过、果然~~学校的课程还是邋遢~~ ；
**当然，这仅仅是学习记录，这些知识已经是几个月前学的了，欢迎交流**
# 内容
## 左值与右值
- **左值**：持久存在，即当前语句结束后依然存在。
- **右值**：表达式结束后不再存在。
左值应当容易理解，给出一个**右值**的例子。

```cpp
int main() {
    int x = 10;         // x是左值
    int y = x + 5;      // x + 5 是右值
    int *p = &(x + 5);  // 不能取右值的地址
    cout << y << endl;  // 输出15
    return 0;
}
```

## 纯右值和将亡值
- **纯右值**：表达式产生的中间值，不能取地址。
- **将亡值**：将要被转移的右值。

**一般，我们不必刻意区分一个右值到底是纯右值还是将亡值，甚至不需要去关注它。**

```cpp
auto c = std::move(a); // c是将亡值
auto d = static_cast<A&&>(a); // d是将亡值
```

## 左右值引用
### std::move
使用`std::move`函数强制把左值转换为右值。

```cpp
int main() {
    int a = 4;
    // int &&b = a; // 报错；左值不允许赋给右值引用。
    int &&b = std::move(a);
    cout << b << endl;
    cout << &b << endl;
    cout << a << endl;
    cout << &a << endl;
}
```

`&&`是右值引用符号，只能是右值，而`a`是左值，可以使用`std::move()`将左值转为右值进行赋值。右值引用后指向的右值，会跟随引用持久存在，即将一个临时变量持久化。

```cpp
class A {
public:
    int a;
};

A getTemp() {
    return A();
}

int main() {
    int a = 10;
    int& refA = a;     // 左值引用
    // int& ref2 = 2;  // 编译错误
    int&& ref1 = 1;    // 右值引用
    int b = 5;
    // int&& refB = b; // 编译错误，不能将一个左值复制给一个右值引用
    A&& refIns = getTemp(); // 函数返回值是右值
    
    return 0;
}
```

在上面的代码中，`getTemp`函数的返回值本应当销毁，但由于有右值引用指向它，因此不会立即销毁。

### 常量左值引用
常量左值引用可以绑定非常量左值、常量左值和右值，并延长右值的生命期，但只能读取，不能修改。

```cpp
const A& a = getTemp(); // 不会报错
```
 
## 移动语义（转移语义）
正如名，移动某个语句，让其有新“含义”（指针）；
移动语义即移动某个模块的所有权。若某个函数实现了自我移动构造函数：

```cpp
class A {
public:
    int size_;
    int* data_;

    A(const A &a) {
        size_ = a.size_;
        data_ = new int[size_];
        cout << "copy " << endl;
    }

    A(A &&a) noexcept {
        this->data_ = a.data_;
        a.data_ = nullptr;
        cout << "move " << endl;
    }
};
```

```cpp
A c = std::move(a);
```

在`std::move`时，会进行浅拷贝，释放当前指针指向目标，然后指向新目标。移动构造函数与拷贝构造函数的区别是，**拷贝构造的参数是`const A&`**，是**常量左值引用**，而**移动构造的参数是`A&&`**，是**右值引用**，临时对象**优先进入移动构造函数而不是拷贝构造函数**。而移动构造函数与拷贝构造不同，它并不是重新分配一块新的空间，将要拷贝的对象复制过来，而是“偷”了过来，**将自己的指针指向别人的资源，然后将别人的指针修改为`nullptr`。**
**这样做，效率高于拷贝函数。**
```cpp
class MiniString {
public:
    char* m_data;

    // 拷贝构造函数
    MiniString(const MiniString &str) {
        CCtor++;
        m_data = new char[strlen(str.m_data) + 1];
        strcpy(m_data, str.m_data);
    }

    // 移动构造函数
    MiniString(MiniString &&str) noexcept : m_data(str.m_data) {
        MCtor++;
        str.m_data = nullptr;
    }

    // 拷贝赋值函数
    MiniString& operator=(const MiniString &str) {
        CAsgn++;
        if (this == &str) // 避免自我赋值
            return *this;

        delete[] m_data;
        m_data = new char[strlen(str.m_data) + 1];
        strcpy(m_data, str.m_data);
        return *this;
    }

    // 移动赋值函数
    MiniString& operator=(MiniString &&str) noexcept {
        MAsgn++;
        if (this == &str) // 避免自我赋值
            return *this;

        delete[] m_data;
        m_data = str.m_data;
        str.m_data = nullptr; // 不再指向之前的资源了
        return *this;
    }
};
int main()
{
    vector<MiniString> vecStr;
    vecStr.reserve(1000);   //先分配好1000个空间，调用的次数可能远大于1000
    for (int i = 0; i < 1000; i++) {
        vecStr.push_back(MiniString("hello"));
    }
    cout << MiniString::CCtor << endl;
}
```
**有兴趣的可以测试一下，将会触发1000次移动构造。**
这段代码通过构建一个临时的MiniString("hello")，直接把这一个赋给崔颖的vecStr。
当类中同时包含拷贝构造函数和移动构造函数时，如果使用临时对象初始化当前类的对象，编译器会**优先调用移动构造函数**来完成此操作。只有当类中**没有**合适的移动构造函数时，编译器才会退而求其次，**调用拷贝构造函数**。

## 完美转发
完美转发指可以写一个接受任意实参的函数模板，并转发到其它函数，目标函数会收到与转发函数完全相同的实参，转发函数实参是左值那目标函数实参也是左值，转发函数实参是右值那目标函数实参也是右值。这个功能是使用`std::forward() `进行实现。

```cpp
void PrintV(int &t) {
    cout << "lvalue" << endl;
}

void PrintV(int &&t) {
    cout << "rvalue" << endl;
}

template <typename T>
void Test(T &&t) {
    PrintV(t);                  // 左值引用
    PrintV(std::forward<T>(t)); // 保持原有
    PrintV(std::move(t));       // 右值引用
}

int main() {
    Test(1);                     // lvalue rvalue rvalue
    int a = 1;
    Test(a);                     // lvalue lvalue rvalue
    Test(std::forward<int>(a));  // lvalue rvalue rvalue
    Test(std::forward<int&>(a)); // lvalue lvalue rvalue
    Test(std::forward<int&&>(a));// lvalue rvalue rvalue
    return 0;
}
```

解释：
- `PrintV(t);`：无论`t`是什么，这里直接对`t`操作，所以是左值引用。
- `PrintV(std::forward<T>(t));`：保持原有类型。
- `PrintV(std::move(t));`：强制转换为右值。

## 返回值优化（RVO）
返回值优化（RVO）是一种编译器优化技术，用于消除不必要的临时对象创建和销毁，从而提高性能：

```cpp
std::vector<int> return_vector(void) {
    std::vector<int> tmp{1, 2, 3, 4, 5};
    return tmp; // 触发RVO，避免拷贝
}

int main() {
    std::vector<int> rval_ref = return_vector();
    return 0;
}
```

在没有RVO优化的情况下，`return tmp;`会触发拷贝构造函数，但有了RVO，编译器可以直接在调用点构造返回值对象，避免多余的拷贝和析构。
