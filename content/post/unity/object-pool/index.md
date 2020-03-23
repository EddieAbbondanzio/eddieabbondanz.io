---
title: "Object Pooling in Unity"
date: 2018-03-30T10:06:59-04:00
draft: false
type: post
category: "Unity"
---

## GameObject.Instantiate() is Expensive

Creating new gameobjects during runtime can be a costly operation. Multiple this action by 10 or more times in a single frame and you'll notice a slight hiccup in FPS. One option to counter this is by taking advantage of object pooling. Object pooling is when a collection of inactive gameobjects is kept on standby. When the game needs a new object it can call upon the pool to retrieve an already instantiated instance. Then when finished, the object can be returned back to the pool for later use.

To prepare my project for some of the new features coming up I decided to finally implement a better system for handling object pools. This implementation doesn't use a data structure to maintain references of the objects in the pools. Instead it uses the sibling index of Unity's transforms to keep all of the in use objects at the top, and object sitting in standby at the bottom. Now we only need an integer that tracks the index of the next free object.

To get started we'll need a way to differentiate between our objects. Create a new enum and add some values to represent the prefabs you wish to pool. I've added the PrefabType cube since in this tutorial we'll be building a cube object pool.

```c#
/// <summary>
/// Unique identifier to quickly differentiate
/// between our different prefabs
/// </summary>
public enum PrefabType {
	Cube
}
```

Next we'll add a component that can be attached to our prefabs to allow for us to always have an easy way to return each object to their pool.

```c#
public class PrefabInstance : MonoBehaviour {
    #region Properties
    /// <summary>
    /// What type of object it is.
    /// </summary>
    public PrefabType Type;

    /// <summary>
    /// The pool that owns this object
    /// </summary>
    public PrefabPool Pool;
    #endregion

    #region Publics
    /// <summary>
    /// Return the object back to it's pool.
    /// </summary>
    public void ReturnToPool() {
        if(Pool != null) {
            Pool.ReturnInstance(this.gameObject);
        }
        else {
            Debug.LogError("PrefabInstance: Pool reference was never set!");
        }
    }
    #endregion
}
```

While an error may seem harsh, we don't want pool objects floating around in purgatory. Now lets move on to the prefab pool class.

```c#
[ExecuteInEditMode]
public class PrefabPool : MonoBehaviour {
    #region Properties
    /// <summary>
    /// The prefab to use for instantiating. This must
    /// have PrefabInstance.cs attached to it!
    /// </summary>
    public GameObject Prefab;

    /// <summary>
    /// The type of objects this pool contains
    /// </summary>
    public PrefabType Type;

    /// <summary>
    /// The target size of the pool.
    /// </summary>
    public int Size;

    /// <summary>
    /// How many objects we can adjust the pool by each frame
    /// </summary>
    public int MaxChangesPerTick;
    #endregion

    #region Members
    /// <summary>
    /// The next free object child index.
    /// </summary>
    private int  currentInstance;

    /// <summary>
    /// If the pool is currently going through a size adjustment.
    /// </summary>
    private bool updatingSize;
    #endregion
}
```

First thing the pool will need to handle is settng up it's local variables. While it comes down to personal preference I prefer to initialize variables that pertain to the local object within Awake(), and those that rely on other objects in Start(). This prevents the need of knowing the execution order of the Monobehaviours.

```c#
//PrefabPool.cs
/// <summary>
/// Sets the pool up.
/// </summary>
private void Awake() {
    updatingSize = false;
    currentInstance = 0;
}
```

Now lets add a way for the pool to adjust it's size as needed. This way when the pool runs out of objects it won't start returning null instances during gameplay.

```c#
//PrefabPool.cs
/// <summary>
/// Adjusts pool size during play.
/// </summary>
private void Update() {
    //If the pool is not being modified, and should be do so.
    if (!updatingSize && transform.childCount != Size && currentInstance < Size) {
        StartCoroutine(UpdatePoolCoroutine());
    }
}
```

Add an OnValidate() method to the class. This is called by Unity anytime a value on the monobehaviour script is modified. By validating our field values it helps prevent any absurd run time errors that could occur.

```c#
//PrefabPool.cs
/// <summary>
/// Called when an editor field is modified.
/// </summary>
    private void OnValidate() {
        //Ensure pool is greater than or equal to 1.
        if (Size < 1) {
            Size = 1;
        }

        //Ensure the max change isn't invalid.
        if(MaxChangesPerTick < 1) {
            MaxChangesPerTick = 1;
        }

        //Lastly check that the prefab has the PrefabInstace
        //script attached to it.
        if(Prefab != null) {
            if (Prefab.GetComponent<PrefabInstance>() == null) {
                Prefab = null;
                Debug.LogError("PrefabPool: Prefab reference must have the PrefabInstance attached!");
            }
        }
    }
```

The Coroutine for adjusting pool size is the trickiest part of the pool. It may seem redundant but I've implemented it in this way for clarity. If you prefer you could find the delta size via Mathf.ABS() then checking if objects should be added, or removed and perform the operation delta times.

```c#
//PrefabPool.cs
/// <summary>
/// Handles adjusting the pool size when needed.
/// </summary>
private IEnumerator UpdatePoolCoroutine() {
    //Gets us out of OnValidate()
    yield return null;

    //The pool is below target size. Add some
    if (transform.childCount < Size) {
        for (int i = 0; i < Size - transform.childCount + 1; i++) {
            AddInstance();

            //If we've done too much take a break.
            if(i != 0 && i % MaxChangesPerTick == 0) {
                yield return null;
            }
        }
    }
    //The pool is above target size. Remove some
    else if (transform.childCount > Size) {
        for (int i = 0; i < transform.childCount - Size; i++) {
            RemoveInstance();

            //If we've done too much take a break.
            if (i != 0 && i % MaxChangesPerTick == 0) {
                yield return null;
            }
        }
    }

    updatingSize = false;
}
```

You'll want to adjust MaxChangesPerTick based on how complex your prefab object is. For larger complex objects reduce the number closer to one, but for simple objects such as the cube primitive MaxChangesPerTick could be fairly high.

Since adding or removing an instance could require some additional work that could clutter the Coroutine we'll move them to their own specialized methods.

```c#
//PrefabPool.cs
/// <summary>
/// Adds a new instances to the bottom of the pool.
/// </summary>
private void AddInstance() {
    GameObject newInstance = GameObject.InstantiatePrefab(Prefab, this.transform) as GameObject;

    newInstance.SetActive(false);
}

/// <summary>
/// Removes the lastmost instance from the pool.
/// </summary>
private void RemoveInstance() {
    GameObject lastInstance = transform.GetChild(currentInstance).gameObject;

    //Since this can run in the Editor we can't call the regular Destroy()
    DestroyImmediate(lastInstance);
}
```

Finally we'll need a way to return and retrieve objects from the pool. I've added a few overloads for getting objects from the pool as examples of what can be done.

```c#
//PrefabPool.cs
/// <summary>
/// Returns an instance from the pool. If the
/// pool is of fixed type, it may return null.
/// </summary>
public GameObject GetPooledInstance() {
    return GetInstance();
}

/// <summary>
/// Returns an instance from the pool at the
/// desired location. If the pool is fixed,
/// and it may return null.
/// </summary>
public GameObject GetPooledInstance(Vector3 pos) {
    GameObject instance = GetInstance();
    instance.transform.position = pos;

    return instance;
}

/// <summary>
/// Returns an instance from the pool at the desired location.
/// If the pool is fixed, it may return null. The prefab is also
/// set to static.
/// </summary>
public GameObject GetPooledInstance(Vector3 pos, bool isStatic) {
    GameObject instance = GetInstance();
    instance.transform.position = pos;
    instance.isStatic = isStatic;

    return instance;
}

/// <summary>
/// Get an instance from the pool. If the pool has none
/// to give out, create one.
/// </summary>
/// <returns></returns>
private GameObject GetInstance() {
    if (currentInstance == transform.childCount) {
        AddInstance();
    }

    GameObject instance = transform.GetChild(currentInstance).gameObject;
    instance.SetActive(true);

    PrefabInstance prefabInstance = instance.GetComponent<PrefabInstance>();
    if (prefabInstance != null) {
        prefabInstance.Pool = this;
    }

    currentInstance++;
    return instance;
}
```

And to wrap things up let's add the return object method.

```c#
//PrefabPool.cs
/// <summary>
/// Return an instance back to the pool.
/// </summary>
public void ReturnInstance(GameObject obj) {
    if (obj == null) {
        return;
    }

    PrefabInstance instance = obj.GetComponent<PrefabInstance>();

    //Ensure it has a prefab pool component.
    if(instance == null) {
        return;
    }

    if (instance.Type == Type && instance.Pool == this) {
        obj.SetActive(false);
        currentInstance--;

        obj.isStatic = false;
        obj.transform.SetSiblingIndex(currentInstance);
        obj.transform.position = Vector3.zero;
    }
}
```

You'll notice that Unity doesn't like to add all the objects right away in Editor Mode. While the pool may not appear to be at it's correct size you can trigger updates in the Editor by clicking objects in the Hierarchy tab. This pool could use some expanding upon, but is atleast a good base to build off of.
