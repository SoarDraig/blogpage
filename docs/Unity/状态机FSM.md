---
sidebar_position: 2
---
# 状态机FSM
## 前言
状态机是很奇妙的东西，在做简单的小项目几乎用不上它。但一旦项目复杂想做的功能多了，就必须使用规范的状态机。不然各个状态切换会极其困难。
与其在一个类数百行代码管理数个状态，不如**一个状态一个类**，这样今后添加修改会方便的多。
我学习了一种常见的状态机写法：
- 每一个状态具有一个独立的`state`类，其规定这个状态特有的行为；
- 有一个或多个`statemachine`类管理`state`的切换；  

**它遵循“状态模式”以及“策略模式”，符合单一职责原则与接口隔离原则。**
## 内容

### 1. 定义状态接口
首先，定义一个状态接口，每个状态都需要实现这个接口。

```csharp
public interface IState
{
    void Enter();
    void Execute();
    void Exit();
}
```
- `Enter()`：当进入这个状态时执行的逻辑。
- `Execute()`：在这个状态下每一帧执行的逻辑。
- `Exit()`：当离开这个状态时执行的逻辑。
### 2. 实现具体的状态
接下来，实现具体的状态类，举例如下：

```csharp
public class IdleState : IState
{
    public void Enter()
    {
        Debug.Log("Entering Idle State"); 
        animator.Play("Idle"); // 播放Idle动画;
    }

    public void Execute()
    {
        Debug.Log("Executing Idle State");
        //例如输入不为0，则进入特定状态;
    }

    public void Exit()
    {
        Debug.Log("Exiting Idle State");
    }
}

public class MoveState : IState
{
    public void Enter()
    {
        Debug.Log("Entering Move State");
        animator.Play("Move"); // 播放移动动画
        //监听其他行为，例如按下`shift`,那么切换到跑步状态。
    }

    public void Execute()
    {
	    Move();
	    //进入移动动画
        Debug.Log("Executing Move State");
    }

    public void Exit()
    {
        Debug.Log("Exiting Move State");
        //取消特定的监听。
    }

	private void Move()
	{
		//实现移动
	}
}
```

**事实上，我通常会添加一个`movement`状态，关于移动的细分状态继承于它，毕竟移动状态会有大量的相同逻辑，例如将移动输入映射到动画控制器。**
### 3. 创建状态机管理器
然后，创建一个状态机管理器，用于切换状态和执行当前状态的逻辑。

```csharp
public class StateMachine
{
    private IState currentState;
	// 提供状态切换的接口;
    public void ChangeState(IState newState)
    {
        if (currentState != null)
        {
            currentState.Exit();
        }

        currentState = newState;
        currentState.Enter();
    }

    public void Update()
    {
        if (currentState != null)
        {
            currentState.Execute();
        }
    }
}
```

### 4. 在Unity中使用
在你的游戏对象中使用这个状态机。你可以在`Update`方法中调用状态机的`Update`方法，以执行当前状态的逻辑。

```csharp
public class PlayerController : MonoBehaviour
{
    private StateMachine stateMachine;

    void Start()
    {
        stateMachine = new StateMachine();
        stateMachine.ChangeState(new IdleState()); // 初始状态为Idle
    }

    void Update()
    {
        stateMachine.Update();
    }
}
```

### 5. 优点及缺点
- **可扩展性**：添加新的状态非常方便，不会影响现有的状态逻辑。
- **可维护性**：状态之间是解耦的，代码容易调试和维护。
- **模块化**：状态的职责是独立的，代码结构更加清晰。
---
- **文件数量多**：每个状态都有一个单独的类，会导致项目中文件数量增多，结构变得复杂。
- **初期架构复杂**：状态机的初期搭建比较困难。