---
sidebar_position: 1
---
# Spine动画控制
Spine通过骨骼系统（骨架）来驱动 2D 图形，实现流畅的动画效果，适合角色动画的制作。其拥有很多优点，例如
- **骨骼动画**：通过骨骼进行运动，减少动画工作量，提升复用率。
- **动画混合**：可以在不同动画之间进行平滑过渡，如走路和跑步的动画混合。
- **动态换装**：使用同一骨骼可以为角色更换不同的外观或装备，对不不同人物，仅仅需要更换贴图。
- **高效的资源管理**：减少了传统逐帧动画对图像资源的需求，降低了内存占用。
## 前置
Spine官方提供了专门的 Unity 插件 [spine-unity](https://zh.esotericsoftware.com/spine-unity-download#spine-unity)！切记**版本正确**。
导入Unity Packa即可。
## 使用
### 动画控制
Spine与UnityAnimator一样，具备**层级**，即拥有多个轨道。
#### 设置动画：
``` csharp
// 设置第0层播放名为"Idle"的动画，循环播放
_skeletonAnimation.AnimationState.SetAnimation(0, "Idle", true);
```
参数分别为，轨道层级，动画名，是否循环。
> 注意，此代码，动画将从头开始播放

#### 添加动画
``` csharp
// 在当前动画结束后0.1秒后，设置第0层播放名为"Run"的动画，循环播放。
_skeletonAnimation.AnimationState.AddAnimation(0, "Run", true, 0.1f);
```
参数分别为，轨道层级，动画名，是否循环，延迟。
> 可以理解为动画轨道中，添加一个动画。注意，会等待当前动画结束。

#### 动画置空
```csharp
//第0层将会使用0.5秒过渡到空状态。
_skeletonAnimation.AnimationState.SetEmptyAnimation(0, 0.5f);
//所有层级0.5秒后全部置空
_skeletonAnimation.AnimationState.SetEmptyAnimations(0.5f);
```
前者参数为，轨道层级，过渡时间。
#### 置空过渡
一些动画例如"Attack"，往往会在其他层，对下层动画进行覆盖。动画结束后不加处理将会导致人物动画迅速变化。所以往往会加一个空白动画用于过渡。
``` csharp
//在第一层，0.1秒后，执行0.5秒的空白过渡。即0.1秒后开始向空白过渡，0.6秒后动画为空白。
_skeletonAnimation.AnimationState.AddEmptyAnimation(1, 0.5f, 0.1f);
```
参数分别为，轨道层级，过渡时间，延迟。

#### 清除动画
```csharp
//清除第1层的动画
_skeletonAnimation.AnimationState.ClearTrack(1);
//清除所有动画
_skeletonAnimation.AnimationState.ClearTracks();
```

### 事件系统
Spine提供了强大的事件系统，可以在动画播放的特定时刻触发自定义事件。以下是两种主要事件类型的区别：
- **完成事件（Complete Event）**: 在动画结束时触发，可用于执行后续操作，如播放下一个动画。
- **帧事件（Frame Event）**: 在动画特定帧触发，适合执行如发声、特效等即时效果。

```csharp
_skeletonAnimation.AnimationState.Complete //动画结束后执行
_skeletonAnimation.AnimationState.Event //动画帧具有事件时触发
```
前者有一个参数，TrackEntry，会传出触发事件的动画的信息。
后者，还会传出对应事件的信息。
例如：
```csharp
_skeletonAnimation.AnimationState.Complete += OnAnimationComplete;
private void OnAnimationComplete(TrackEntry entry)
    {
        if (entry.Animation.Name == "Wink")
        {
            Invoke("PlayWink", Random.Range(1.0f, 5.0f));
        }
    }
    
_skeletonAnimation.AnimationState.Event += AnimationState_Event;
private void AnimationState_Event(TrackEntry trackEntry, Spine.Event e)
    {
        if (e.Data.Name == "OnAttack") 
        {
            _player.Fire();
        }
    }
```
## 更多学习资源
- [Spine 官方文档](https://esotericsoftware.com/spine-documentation)
- [Spine 学习视频](https://www.youtube.com/results?search_query=spine+animation)
## 小结
包含Spine动画控制的基础知识，包括如何设置动画、添加动画、以及事件系统的使用。
