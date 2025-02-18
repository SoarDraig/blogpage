---
slug: AstarPath
title: Astar算法Unity实战设计
tags: [Unity]
date: 2025-2-11
keywords: [Unity,Astar]
summary: "它实现了 A* 算法,核心思想是通过构建一个可导航的网格（Grid）,让角色或物体能够计算出从起始点到目标点的最佳路径。"
draft: true
---
它实现了 A* 算法,核心思想是通过构建一个可导航的网格（Grid）,让角色或物体能够计算出从起始点到目标点的最佳路径。
<!--truncate-->

### **思路**

1. **GridGraph 类**：
   - 负责管理网格中的节点，提供方法来获取某个位置的节点，获取邻居节点，以及计算两个节点之间的距离。
   - `GridGraph` 还会维护一个 **障碍物检测** 系统，判断某个位置是否被障碍物占用。

2. **AStarPathfinding 类**：
   - 负责核心的 A* 寻路逻辑。
   - 调用 `GridGraph` 提供的方法来获取节点、邻居、计算距离，并实现 A* 算法的路径搜索。

### **代码实现**

#### **1. Node.cs**

`Node` 代表一个网格节点，保存节点的位置、成本等信息。

```csharp
public class Node
{
    public Vector3 position;  // 节点位置
    public int gCost;         // 从起点到当前节点的代价
    public int hCost;         // 从当前节点到目标节点的估算代价
    public int fCost => gCost + hCost;  // 总代价 fCost = gCost + hCost
    public Node parent;       // 父节点，用于路径回溯

    public Node(Vector3 position)
    {
        this.position = position;
        this.gCost = 0;
        this.hCost = 0;
        this.parent = null;
    }
}
```

#### **2. GridGraph.cs**

`GridGraph` 负责管理网格数据结构，包括节点创建、邻居节点查找、以及障碍物检测等。

```csharp
using System.Collections.Generic;
using UnityEngine;

public class GridGraph : MonoBehaviour
{
    public float nodeSize = 1f;  // 节点的大小（假设是正方形）
    public LayerMask obstacleLayer;  // 用于检测障碍物的层

    private List<Node> allNodes = new List<Node>();  // 存储所有的节点

    // 获取某个位置的节点
    public Node GetNodeFromWorldPosition(Vector3 position)
    {
        // 假设所有节点都按照网格排列，我们通过位置来计算相应的节点
        float x = Mathf.Floor(position.x / nodeSize);
        float z = Mathf.Floor(position.z / nodeSize);
        Vector3 nodePosition = new Vector3(x * nodeSize, position.y, z * nodeSize);
        return allNodes.Find(n => n.position == nodePosition);
    }

    // 获取某个节点的邻居
    public List<Node> GetNeighbors(Node node)
    {
        List<Node> neighbors = new List<Node>();
        Vector3[] directions = { Vector3.forward, Vector3.back, Vector3.left, Vector3.right };
        foreach (var direction in directions)
        {
            Vector3 neighborPosition = node.position + direction * nodeSize;
            if (IsWalkable(neighborPosition))  // 检查邻居是否可通行
            {
                neighbors.Add(new Node(neighborPosition));
            }
        }
        return neighbors;
    }

    // 计算两个节点之间的距离（假设使用曼哈顿距离）
    public int GetDistance(Node a, Node b)
    {
        return Mathf.Abs((int)(a.position.x - b.position.x)) + Mathf.Abs((int)(a.position.z - b.position.z));
    }

    // 检查某个位置是否可通行
    public bool IsWalkable(Vector3 position)
    {
        // 使用碰撞检测来判断该位置是否有障碍物
        Collider[] colliders = Physics.OverlapSphere(position, nodeSize / 2, obstacleLayer);
        return colliders.Length == 0;  // 如果没有碰撞物体，表示可通行
    }
}
```

#### **3. AStarPathfinding.cs**

`AStarPathfinding` 负责实现 A* 算法的路径搜索，核心逻辑都在这个类中实现。它会调用 `GridGraph` 提供的方法来获取节点信息、邻居、距离等。

```csharp
using System.Collections.Generic;
using UnityEngine;

public class AStarPathfinding : MonoBehaviour
{
    public GridGraph gridGraph;  // 网格图对象，负责获取节点和障碍物信息
    public Transform startTransform;
    public Transform targetTransform;

    // A* 寻路主方法
    public List<Node> FindPath(Vector3 startPosition, Vector3 targetPosition)
    {
        Node startNode = gridGraph.GetNodeFromWorldPosition(startPosition);
        Node targetNode = gridGraph.GetNodeFromWorldPosition(targetPosition);

        List<Node> openList = new List<Node>();   // 待处理节点
        HashSet<Node> closedList = new HashSet<Node>(); // 已处理节点

        openList.Add(startNode);

        while (openList.Count > 0)
        {
            // 从 openList 中选出 fCost 最小的节点
            Node currentNode = openList[0];
            foreach (var node in openList)
            {
                if (node.fCost < currentNode.fCost || (node.fCost == currentNode.fCost && node.hCost < currentNode.hCost))
                {
                    currentNode = node;
                }
            }

            openList.Remove(currentNode);
            closedList.Add(currentNode);

            // 如果到达目标节点，返回路径
            if (currentNode.position == targetNode.position)
            {
                return RetracePath(startNode, targetNode);
            }

            // 遍历邻居节点
            foreach (var neighbor in gridGraph.GetNeighbors(currentNode))
            {
                if (closedList.Contains(neighbor)) continue;  // 如果已处理过，跳过

                int newGCost = currentNode.gCost + gridGraph.GetDistance(currentNode, neighbor);
                if (newGCost < neighbor.gCost || !openList.Contains(neighbor))
                {
                    neighbor.gCost = newGCost;
                    neighbor.hCost = gridGraph.GetDistance(neighbor, targetNode);
                    neighbor.parent = currentNode;

                    if (!openList.Contains(neighbor))
                    {
                        openList.Add(neighbor);
                    }
                }
            }
        }

        return null; // 如果没有找到路径
    }

    // 回溯路径
    private List<Node> RetracePath(Node startNode, Node endNode)
    {
        List<Node> path = new List<Node>();
        Node currentNode = endNode;
        while (currentNode != startNode)
        {
            path.Add(currentNode);
            currentNode = currentNode.parent;
        }
        path.Reverse();  // 将路径从起点到目标顺序
        return path;
    }

    // 启动时的示例，实际应用中可以移除
    void Start()
    {
        Vector3 startPosition = startTransform.position;
        Vector3 targetPosition = targetTransform.position;

        List<Node> path = FindPath(startPosition, targetPosition);

        // 打印路径
        if (path != null)
        {
            foreach (var node in path)
            {
                Debug.Log("Path: " + node.position);
            }
        }
        else
        {
            Debug.Log("No path found.");
        }
    }
}
```

### **解耦与融合的解释**

1. **GridGraph**：
   - `GridGraph` 管理网格中的节点，提供了获取节点、获取邻居节点、计算节点之间距离和障碍物检测等功能。
   - 该类的核心职责是管理网格数据，并提供接口供 `AStarPathfinding` 使用，获取所需的节点信息。

2. **AStarPathfinding**：
   - `AStarPathfinding` 负责实现 A* 算法的核心逻辑。它通过调用 `GridGraph` 提供的方法来获取节点、计算距离、判断障碍物等。
   - 在 A* 算法执行过程中，`AStarPathfinding` 维护了 `openList` 和 `closedList`，并且最终负责路径回溯（`RetracePath`）。

### **融合部分**

- **`GridGraph` 和 `AStarPathfinding` 的合作**：
   - `GridGraph` 提供对节点和障碍物的管理功能，`AStarPathfinding` 在执行寻路时依赖这些功能来实现路径搜索。
   - 在 `AStarPathfinding` 中，通过调用 `GridGraph.GetNodeFromWorldPosition` 和 `GridGraph.GetNeighbors`，获取必要的节点信息和其邻居节点，进而执行 A* 算法。
   - `AStarPathfinding` 仅关心如何从起点找到目标，并通过 `GridGraph` 提供的功能判断路径的可行性。

### **总结**

通过这种解耦和融合的方式，我们将 **网格管理** 和 **路径搜索** 分开到不同的类中，增强了代码的可维护性和扩展性。`GridGraph` 专注于网格数据和障碍物检测，而 `AStarPathfinding` 专注于 A* 算法的实现。两者通过