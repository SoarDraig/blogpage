---
slug: UnityGridSystem
title: Unity网格系统构建，类塔科夫背包，建造系统
tags:
  - Unity
date: 2024-09-24
keywords: [Unity, Game-Engine, Grid, 背包, 建造系统]
summary: "对于游戏创作而言，背包是一个极其常用的功能，正好最近在考虑制作类塔科夫背包，就想着使用泛型去做一个**万能**的背包；"
draft: false
---
对于游戏创作而言，背包是一个极其常用的功能，正好最近在考虑制作类塔科夫背包，就想着使用泛型去做一个**万能**的背包；
<!--truncate-->

## 前言

对于游戏创作而言，背包是一个极其常用的功能，正好最近在考虑制作类塔科夫背包，就想着使用泛型去做一个**万能**的背包；

## 分析

### 基础分析

在正式制作前，先想一想，地图算不算背包，例如Unity的Tile Map，再例如**植物大战僵尸**中的地图。  
某种程度上，他们确实是属于背包，例如豌豆射手就可以看做背包里的一个物品，这个物品本身**是一个GameObject**，这样顺下来，基础的思路就有了。

我们要做的是一个大的二维数组，每个数组可以容纳一个GameObject，他可以是一个图片，一个建筑，一个实例化的物体；

### 功能分析

我们要做一下的功能：

- **网格容量系统**：类似塔科夫（Tarkov）和生化危机（Resident Evil），通过二维网格管理背包中的物品位置和大小。
- **负重系统**：可选加入负重指标，类似绝地求生（PUBG）中的背包容量管理，限制玩家携带物品的总重量。
- **堆叠机制**：支持物品堆叠，采用最大堆叠容量和当前容量的逻辑，灵活处理物品的数量管理。
- **预览功能**：物品的预览和实际形态分离，允许为同一物品设置不同的模型以提高显示和渲染效率。
- **实例化物品**：支持在背包中放置独立的实例化物品，每个物品都有独立的逻辑和行为。
- **通用性和扩展性**：系统采用了双层泛型封装，底层框架可以用作塔防、即时战略或模拟经营类游戏的核心物品管理系统。

大致就这些内容，那我们需要做什么东西呢？
- 一个**二维泛型**数组，保存存储的物品类；
- 物品类中包含GameObject，还需要重量，最大堆叠量，幽灵(预览放置)；
- GameObject有**独立**的行为，为独立的物品；

这样分析下来，我决定制作四层：
- **物品类**：包含物品的数量，大小，最大堆叠量，物品实例等物品**信息**；
- **背包物品类**：**封装物品类**，提供对应接口，例如是否可以继续堆叠，避免直接修改物品类；
- **背包类**：同于**存储**背包物品类，同时提供对应接口，例如背包内有什么，放置地点是否为空，是否可以堆叠；
- **背包控制器**：**实际操作**类，负责实际操作，将某个背包物品类放入背包，多背包维护，物品移动等功能；


## 底层框架构建
```cs
// 泛型，满足扩展需求;
public class GridXY<TGridObject>
{
	// 定义基本信息大小
	private int width;  
	private int height;  
	private float cellSize;  
	private Vector3 originPosition;  
	private TGridObject[,] gridArray;
	
	// 背包内容管理器，提供物品查询支持
	private Dictionary<string, int> Bag;

	public GridXY(******)
	{
		// 初始化背包
	}

	// 提供基础操作
	public int GetWidth() 
	{  
	    return width;  
	}  
	public int GetHeight() 
	{  
	    return height;  
	}
	//.......
	
	// 提供底层核心操作
	// 设置物品
	public void SetGridObject(int x, int y, TGridObject value) 
	{  
	    if (x >= 0 && y >= 0 && x < width && y < height) 
	    {  
	        gridArray[x, y] = value;
	    }
    }
    // 获取物品
    public TGridObject GetGridObject(int x, int y) 
    {  
	    if (x >= 0 && y >= 0 && x < width && y < height) 
	    {  
	        return gridArray[x, y];  
	    } 
	    else 
	    {  
	        return default(TGridObject);  
	    }
    }
    // 取出物品
    public int OutObjectCount(String name, int number)  
	{  
	    if (Bag.ContainsKey(name))  
	    {        
		    int tem = Bag[name];  
	        if (tem > number)  
	        {            
		        Bag[name] -= number;  
	            return number;  
	        }        
		    Bag.Remove(name);  
	        return tem;  
	    }    
	    return 0;  
	}
	// 放入物品
	public void InObjectCount(String name, int number)  
	{  
	    if (Bag.ContainsKey(name))  
	    {        
		    Bag[name] += number;  
	        Debug.LogWarning(name + "还有" + Bag[name]);  
	        return;  
	    }    
	    Bag.Add(name, number);  
	}
	
}
```

## 物品泛型的实现

>具体物品的实现，也可认为是其他物品想进入背包的父类；

```cs
public class PlacedObjectTypeSO : ScriptableObject
{
	public string nameString;  
	
	// 分别为背包外实例，背包内实例，预览放置实例;
	// 解决部分模型过于精细或背包过大造成的卡顿;
	public Transform usePrefab;  
	public Transform prefab;  
	public Transform visual;  
	public int width;  
	public int height;  

	public int number;  
	public int maxNumber;  
	  
	public int ID;
	
	//物品的放置位置相关
	public List<Vector2Int> GetGridPositionList(Vector2Int offset, Dir dir){};
	public Vector2Int GetRotationOffset(Dir dir){};
}


public class PlacedObject_Done : MonoBehaviour
{
	// 部分信息
	private Vector2Int origin;  
	private PlacedObjectTypeSO.Dir dir;  

	// 堆叠相关信息
	private bool canStack; // 疑似冗余信息
	private int number = 1;  
	private int maxNumber = 1;
	
	// 创建物品
	public static PlacedObject_Done Create()
	{
		Transform placedObjectTransform = Instantiate(*****){};
		PlacedObject_Done placedObject = placedObjectTransform.GetCom<>();
		// 从SO文件创建
		placedObject.Setup(placedObjectTypeSO, origin, dir);
		
		return placedObject;
	}
	
	// 信息初始化
	private void Setup(****)  
	{  
	
	    this.placedObjectTypeSO = placedObjectTypeSO;  
	    this.origin = origin;  
	    this.dir = dir;  
	  
	    // 堆叠内容  
	    this.number = placedObjectTypeSO.number;  
	    this.maxNumber = placedObjectTypeSO.maxNumber;  
	  
	    if (maxNumber != number)  
	    {        
		    canStack = true;  
	    }
	}
	
	// 物品的核心信息
	// 根据选择判断占地信息;
	public List<Vector2Int> GetGridPositionList() 
	{  
	    return placedObjectTypeSO.GetGridPositionList(origin, dir);  
	}

	// 物品的特定操作
	// 堆叠，且返回剩余值
	public int Stack(int number)  
	{  
	    this.number += number;  
	    Debug.Log(this.number);  
	    if (this.number > maxNumber)  
	    {        
		    int temp = this.number - maxNumber;  
	        this.number = maxNumber;  
	        return temp;  
	    }    
		    return 0;  
	}
	// 设置数值等
	public int GetNumber()  
	{  
	    return number;  
	}  
	public void SetNumber(int number)  
	{  
	    this.number = number;  
	}
}
```




## 核心控制层实现
>用于控制`Grid`底层网格的系统，提供通用操作；
>共有两部分，
```cs

public class GridSystemXY : MonoBehaviour
{
	// 具体放置的类型，如不习惯，可以解耦独立。
	public class GridObject
	{
		private GridXY<GridObject> grid;  
		private int x;  
		private int y;  
		public PlacedObject_Done placedObject;  

		// 物品构建时，物品持有当前所在背包的引用;
		public GridObject(GridXY<GridObject> grid, int x, int y) 
		{  
		    this.grid = grid;  
		    this.x = x;  
		    this.y = y;  
		    placedObject = null;  
		}
		// 提供配套的操作
		public void SetPlacedObject(PlacedObject_Done placedObject) 
		{  
		    this.placedObject = placedObject;  
		}
		public bool CanBuild(PlacedObjectTypeSO placedObjectTypeSO){};
		public bool CanStack(PlacedObjectTypeSO placedObjectTypeSO){};
		public int Stack(){};
		
	}

	public static GridSystemXY Instance { get; private set; }

	// 背包管理器，应对多个背包;
	public Dictionary<int, GridXY<GridSystemXY.GridObject>> gridDictionary;
	
	// 当前操作的背包
	private GridXY<GridObject> grid;
	
	// 当前操作的物品
	private PlacedObjectTypeSO.Dir dir; 
	private PlacedObjectTypeSO placedObjectTypeSO;

	// 移动位置时的逻辑。  
	private bool isSwitchingMode = false;  
	private List<Vector2Int> tempGridPositionList = null;
	
	// 备份数据  
	private int number;

	// 初始化
	private void Awake() 
	{  
	    Instance = this;  
	  
	    gridDictionary = new Dictionary<int, GridXY<GridSystemXY.GridObject>>();  
	    int gridWidth = 3;  
	    int gridHeight = 4;  
	    float cellSize = 10f;  
	    AddGrid(1, grid);  
	    AddGrid(2, grid);  
	  
	    placedObjectTypeSO = null;  
	}

	// 部分系统
	// 放置系统
	private void Build()
	{
		foreach(var ID in gridDictionary)
		{
			//获取鼠标位置，查看是否可以放置
		}
		if (canBuild)
		{
			// 堆叠放置
			if(canStack)
			{
				int tem = targetGridObject.Stack(number);
				if(tem > 0)
				{
					//未完全放置，仅更新当前数量
					return;
				}
			}
			
			// 放置
			{
				// 指定位置创建物品
				placedObject = PlacedObject_Done.Create(****);
			}
			
			// 松开;
			DeselectObjectType();
		}
	}

}


```