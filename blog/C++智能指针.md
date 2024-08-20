---
slug: C++AdPtr
title: C++高级特性——智能指针
tags: [C++, Programming]
date: 2024-08-05
keywords: [C++, Advanced Programming]
draft: false
hide_table_of_contents: false
summary: 这是我博客文章的摘要内容，只显示在文章列表中。
---

本篇文章深入探讨 C++ 中的智能指针，介绍 std::unique_ptr、std::shared_ptr 和 std::weak_ptr 三种常见的智能指针类型，分别讨论它们的特点、使用场景以及常见的内存管理问题。通过代码示例和个人理解，解释了智能指针如何利用 RAII 技术解决手动内存管理中的困扰，如循环引用、悬空指针等问题，最终帮助开发者更高效地管理内存。
<!--truncate-->
---
# 前言
`C++`的内存管理始终是一个难题，尤其是引入指针后，共享独享与垃圾回收异常困难。
例如下列代码中，三个指针实际上指向同一个`MyClass`实例，将`ptr`释放后会出现严重的内存问题，此时的`ptr`被置为`nullptr`，而`ptr`1和`ptr2`成为悬空指针。

```cpp
class MyClass
{
public:
    MyClass() { std::cout << "MyClass Constructor\n"; }
    ~MyClass() { std::cout << "MyClass Destructor\n"; }
};

int main()
{
    MyClass *ptr = new MyClass(); // 创建一个原始指针
    MyClass *ptr2 = ptr;          // 复制原始指针
    MyClass *ptr3 = ptr;          // 复制原始指针

    delete ptr; // 释放原始指针
}
```
因而为了方便的解决内存管理，将指针的使用与**RAII**技术结合，智能指针诞生了。

> RAII的核心思想是通过对象的生命周期来管理资源，确保资源在对象创建时分配，在对象销毁时释放。关于该原则，后续会有相关博客文章，敬请期待！ 


# 核心
目前可用的智能指针共有3种，分别是

 - `std::unique_ptr`
 - `std::shared_ptr`
 - `std::weak_ptr`
 
## std::unique_ptr（独享指针）
`std::unique_ptr`是独占所有权的智能指针，**同一时间内只有一个指针可以拥有所指对象的所有权**。**它在对象生命周期结束时自动释放资源**。可以认为，独享指针和它绑定的对象，是**强绑定**的，谁都不能离开谁。
用一个示例快速带大家理解

```cpp
class MyClass
{
public:
    MyClass() { std::cout << "MyClass Constructor\n"; }
    ~MyClass() { std::cout << "MyClass Destructor\n"; }
};

void test()
{
    std::unique_ptr<MyClass> ptr1 = std::make_unique<MyClass>(); // 创建一个unique_ptr
 	// std::unique_ptr<MyClass> ptr2 = ptr1; // 错误，unique_ptr不能复制
 	// ptr1离开作用域，被释放
}

int main()
{
	test();
	return 0;
}
```
其达成的效果很明显：
 - **独占所有权**：确保对象不会被多个指针共享。 
 - **自动内存释放**：对象生命周期结束时自动释放内存。
## std::shared_ptr（共享指针）
`std::shared_ptr` 是一种共享式智能指针，允许多个指针共享同一个对象。当**最后一个** `std::shared_ptr` 被销毁时，所管理的对象才会被销毁。

> `实例对象会有一个对应的**控制块**，里面有**引用计数器**，记录有几个共享指针指向它，当计数器**归零**，即自动触发垃圾回收。

```cpp
class MyClass {
public:
    MyClass() { std::cout << "MyClass Constructor\n"; }
    ~MyClass() { std::cout << "MyClass Destructor\n"; }
};

int main() {
    std::shared_ptr<MyClass> ptr1 = std::make_shared<MyClass>();//智能指针ptr1指向该类，引用计数器+1;
    {
        std::shared_ptr<MyClass> ptr2 = ptr1;//智能指针ptr2指向该类，引用计数器+1;
        std::cout << "Reference count: " << ptr1.use_count() << std::endl;
    }
    // ptr2超出作用域，引用计数-1;
    std::cout << "Reference count: " << ptr1.use_count() << std::endl;
    return 0;// ptr1超出作用域，引用计数-1，归零，垃圾回收;
}
```
其作用也比较显然：
 - **共享所有权**：允许多个指针共享同一个对象。 
 - **智能垃圾回收**：自动管理引用计数，在引用计数为零时释放资源。
 
但这儿有一个严重的**问题**
看下列代码：

```cpp
class B;

class A
{
public:
    std::shared_ptr<B> ptrB;
    ~A() { std::cout << "A Destructor\n"; }
};

class B
{
public:
    std::shared_ptr<A> ptrA;
    ~B() { std::cout << "B Destructor\n"; }
};

void createCycle()
{
    std::shared_ptr<A> a = std::make_shared<A>();
    std::shared_ptr<B> b = std::make_shared<B>();
    a->ptrB = b;
    b->ptrA = a; // 循环引用
}

int main()
{
    createCycle();
    // A和B的析构函数不会被调用，造成内存泄漏
    return 0;
}

```
这个代码中，在运行`createCycle`后，A和B的计数器都为2，分别来源于自己和对方，`createCycle`结束后，发现无法析构，陷入了类似**死锁**的情况。这个情况我们成为**循环引用**。为了解决这个问题，`std::weak_ptr `出现。
## std::weak_ptr （弱共享指针）
`std::weak_ptr `是一种基于共享指针的弱共享指针，简单来说，就是它可以得到其观察的共享指针的内容，但不会增加其计数器，或者说，访问`std::weak_ptr`本质是在访问其指向的`std::shared_ptr`。
简单举个例子

```cpp
class MyClass {
public:
    MyClass() { std::cout << "MyClass Constructor\n"; }
    ~MyClass() { std::cout << "MyClass Destructor\n"; }
};

int main() {
    std::shared_ptr<MyClass> sharedPtr = std::make_shared<MyClass>();
    std::weak_ptr<MyClass> weakPtr(sharedPtr);  // 从shared_ptr创建weak_ptr

    std::cout << "sharedPtr use_count: " << sharedPtr.use_count() << std::endl; // 输出引用计数 1;
    if (auto tempSharedPtr = weakPtr.lock()) {
        // 通过lock获得临时shared_ptr
        std::cout << "Object is still alive.\n";
    } else {
        std::cout << "Object has been destroyed.\n";
    }
    return 0;
}
```
可以通过`std::weak_ptr`获取到其作用的共享指针并尝试输出，如果不存在则输出`nullptr`；
其作用为
 - **避免循环引用**：不增加引用计数，避免循环引用。 
 - **安全访问**：允许安全访问被管理的对象。
 
怎么解决的呢，请看代码：

```cpp

class B;

class A
{
public:
    std::weak_ptr<B> ptrB;
    ~A() { std::cout << "A Destructor\n"; }
};

class B
{
public:
    std::weak_ptr<A> ptrA; // 使用weak_ptr避免循环引用
    ~B() { std::cout << "B Destructor\n"; }
};

void createCycle()
{
    std::shared_ptr<A> a = std::make_shared<A>();
    std::shared_ptr<B> b = std::make_shared<B>();
    a->ptrB = b;
    b->ptrA = a; // 不会造成循环引用
}

int main()
{
    createCycle();
    // A和B的析构函数会被调用，内存正确释放
    return 0;
}
```
当我们尝试析构a，b的时候，我们可以正常析构，因为计数器为1，可以析构。这个时候，`std::weak_ptr`实际上被置空。这样就解决了循环引用的问题。

# 个人理解
到这儿文章的主要内容基本结束，我来分享一下我对智能指针的理解。
**智能指针本质是将指针封装成栈对象，结合控制块，结合栈内存自动回收，对原指针进行封装。当然，也可以说它通过 RAII 技术有效解决了手动管理内存带来的各种问题。**
对于指针，最初的学习来源于C语言老师，他说定义一个变量a，&a便是它的地址。可以理解成 a 是一个房子，而 &a便是它的地址。然后指针是用来指向某个地址，**从而访问其指向的变量**。
这个说法我很喜欢，很容易理解，但是有一个问题：为什么指针和变量要分离。在生活中，有太多指针的例子了，导航，路牌，门牌号等等都算指针，但路牌**不是因为他是路牌而有意义，而是路牌上的内容有意义**。**路牌此时应该和其具体路线紧密联系**。为什么要把指针和变量**分开**去看，他们应该是一块的，或者说，脱离了具体内容的指针毫无意义，实际内容必须需要指针来给大家一个接口，尽管可能在高级编程语言这一层我们无法访问局部变量，但是从底层去看，这个局部变量的指针的确存在。
总之，我认为智能指针才应该算是真正意义的指针，**脱离内容的指针毫无意义**，**指针就应该和其内容共享生命周期**。当然，如果这个指针是为了检测它有没有内容，就例如`std::weak_ptr`，不可避免的出现`nullptr`的情况，出现“空”内容，但其能反映出有和无，不就是一种内容吗？
