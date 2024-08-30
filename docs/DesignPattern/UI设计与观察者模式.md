# UI设计与观察者模式
#### 示例

```C++
public class Subject
{
    private List<IObserver> observers = new List<IObserver>();

    public void Notify()
    {
        foreach (var observer in observers)
        {
            observer.Update();
        }
    }
}

public interface IObserver
{
    void Update();
}

public class ConcreteObserver : IObserver
{
    public void Update()
    {
        // Update logic
    }
}
```