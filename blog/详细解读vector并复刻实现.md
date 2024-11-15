---
slug: VectorP
title: 详细解读vector并复刻实现
tags: [C++, Programming]
date: 2024-11-20
keywords: [C++, Advanced Programming, Vector]
summary: "本文详细解读了C++中的vector容器，包括定义、特点、底层实现、扩容机制、迭代器失效问题、以及实现一个简单的vector容器。"
draft: true
---
Vector容器是表示可以改变大小的数组的序列容器。本文详细解读了C++中的vector容器，包括定义、特点、底层实现、扩容机制、迭代器失效问题、以及实现一个简单的vector容器。
<!--truncate-->
# 详细解读vector并复刻实现
## 1. 基本定义
:::info 定义
*Vectors are sequence containers representing arrays that can change in size*  
Vector容器是表示可以**改变大小**的数组的序列容器。
:::
> 实际上很多人都接触过它，它有一个别名:动态数组。

## 2. 核心功能与剖析
先看官方功能图例：
![vector](https://cdn.soardraig.top/img/vector/baseFun.png)  
接下来我们就来逐一解读这些功能的核心实现。

### 2.1. 构造与析构
这是最基础的功能，那我们直接看代码：



