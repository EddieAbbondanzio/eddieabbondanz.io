---
title: "Greedy Meshing for Vertex Colored Voxels In Unity"
date: 2018-03-25
type: post
thumbnail: "/post/voxel/greedy-mesh/images/hero.png"
category: "Development"
---

**TL;DR** Full algorithm is at the bottom. Classes for `Block`, `Chunk`, and `MeshData` are defined below the intro.

This article goes over how to implement a greedy meshing algorithm for generating optimized meshes for vertex-colored voxels in Unity. The algorithm is derived from [Robert O'Leary](https://github.com/roboleary/GreedyMesh), with a few alterations made.

The setup has been simplified, and assumes the world is only comprised of a single chunk that holds all the blocks. With a few tweaks it wouldn't be hard to add support for multiple chunks, but since there are several different solutions to achieve this, I've left it up to the reader.

I prefer colored blocks over typed blocks. As such each block in my implementation holds 4 bytes of data for the color (red, green, blue, and alpha). A block is considered "solid" if the alpha value is maxed out.

```csharp
// Block.cs
public struct Block {
    public byte R { get; }
    public byte G { get; }
    public byte B { get; }
    public byte A { get; }

    public Block(byte r, byte g, byte b, byte a = byte.MaxValue) {
        R = r;
        G = g;
        B = b;
        A = a;
    }

    public bool IsSolid() => A == byte.MaxValue;
    public Color32 GetColor() => new Color32(R, G, B, A);
}
```

Blocks are held within a chunk. For performance reasons the chunk utilizes a flattened 3d array, but helper methods `ContainsIndex()` and `FlattenIndex()` are provided.

```csharp
// Chunk.cs
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Chunk {
    public static readonly Vector3Int Dimensions = new Vector3Int(32, 128, 32);

    public Vector3Int Position { get; }

    private Block[] blocks { get; }

    public Chunk(Vector3Int position) {
        Position = position;
        blocks = new Block[Dimensions.x * Dimensions.y * Dimensions.z];
    }

    public void SetBlock(Vector3Int index, Block block) {
        if (!ContainsIndex(index)) {
            throw new IndexOutOfRangeException($"Chunk does not contain index: {index}");
        }

        blocks[FlattenIndex(index)] = block;
    }

    public Block GetBlock(Vector3Int index) {
        if (!ContainsIndex(index)) {
            return Block.Air();
        }

        return blocks[FlattenIndex(index)];
    }

    private bool ContainsIndex(Vector3Int index) =>
        index.x >= 0 && index.x < Dimensions.x &&
        index.y >= 0 && index.y < Dimensions.y &&
        index.z >= 0 && index.z < Dimensions.z;

    private int FlattenIndex(Vector3Int index) =>
        (index.z * Dimensions.x * Dimensions.y) +
        (index.y * Dimensions.x) +
        index.x;
}
```

A `MeshData` class has been created to ease passing vertices, triangles, and colors around.

```csharp
// MeshData.cs
using System.Collections.Generic;
using UnityEngine;

public class MeshData {
    public Vector3[] Vertices { get; }
    public int[] Triangles { get; }
    public Color32[] Colors { get; }

    public MeshData(Vector3[] vertices, int[] triangles, Color32[] colors) {
        Vertices = vertices;
        Triangles = triangles;
        Colors = colors;
    }
}
```

And lastly, a helper class for building meshes.

```csharp
// MeshBuilder.cs
using System;
using System.Collections.Generic;
using UnityEngine;

public class MeshBuilder {
    private readonly List<Vector3> vertices;
    private readonly List<int> triangles;
    private readonly List<Color32> colors;

    public MeshBuilder() {
        vertices = new List<Vector3>();
        triangles = new List<int>();
        colors = new List<Color32>();
    }

    public void AddSquareFace(Vector3[] vertices, Color32 color, bool isBackFace) {
        if (vertices.Length != 4) {
            throw new ArgumentException("A square face requires 4 vertices");
        }

        // Add the 4 vertices, and color for each vertex.
        for (int i = 0; i < vertices.Length; i++) {
            this.vertices.Add(vertices[i]);
            colors.Add(color);
        }

        if (!isBackFace) {
            triangles.Add(this.vertices.Count - 4);
            triangles.Add(this.vertices.Count - 3);
            triangles.Add(this.vertices.Count - 2);

            triangles.Add(this.vertices.Count - 4);
            triangles.Add(this.vertices.Count - 2);
            triangles.Add(this.vertices.Count - 1);
        } else {
            triangles.Add(this.vertices.Count - 2);
            triangles.Add(this.vertices.Count - 3);
            triangles.Add(this.vertices.Count - 4);

            triangles.Add(this.vertices.Count - 1);
            triangles.Add(this.vertices.Count - 2);
            triangles.Add(this.vertices.Count - 4);
        }
    }

    public MeshData ToMeshData() {
        MeshData data = new MeshData(
            vertices.ToArray(),
            triangles.ToArray(),
            colors.ToArray()
        );

        vertices.Clear();
        triangles.Clear();
        colors.Clear();

        return data;
    }
}
```

Let's go ahead and define a `GenerateMesh()` method on our `Chunk`.

```csharp
// Chunk.cs

public class Chunk {
    public MeshData GenerateMesh() {

    }
}
```

Within `GenerateMesh()` well want to add a loop that runs through all 6 faces of the blocks. We'll also want to know if the current face is a "back" face.

```c#
    // Iterate over each face of the blocks.
    for (int face = 0; face < 6; face++) {
        bool isBackFace = face > 2;
    }
```

To simplify things, we'll break down the problem into building slices of the mesh on 1 plane
at a time. Lets add some work variables for tracking which two axes we are working on. We will work
on the planes YZ, ZX, XY. Each plane will be visited twice, once to do the front faces, then
again to do the back faces.

```c#
    int direction, workAxis1, workAxis2;

    for (int face = 0; face < 6; face++) {
        bool isBackFace = face > 2;
        direction = face % 3;
        workAxis1 = (direction + 1) % 3;
        workAxis2 = (direction + 2) % 3;
    }
```

We still need a few more work variables. Go ahead and add the following above the for loop.

```c#
    MeshBuilder builder = new MeshBuilder();

    bool[,] merged;

    Vector3Int startPos, currPos, quadSize, m, n, offsetPos;
    Vector3[] vertices;

    Block startBlock;
```

Now add an inner for loop as seen below. This will work it's way through the chunk 1 layer at a time.

```c#
    for (int face = 0; face < 6; face++) {
        bool isBackFace = face > 2;
        direction = face % 3;
        workAxis1 = (direction + 1) % 3;
        workAxis2 = (direction + 2) % 3;

        startPos = new Vector3Int();
        currPos = new Vector3Int();

        // Iterate over the chunk layer by layer.
        for (startPos[direction] = 0; startPos[direction] < Dimensions[direction]; startPos[direction]++) {

        }
    }
```

We'll want to prep our bool array now. Since we want to be able to handle non cubic chunks we can't initialize it until we know which axis we are slicing. The next step is to begin building the mesh slices.

Start by getting the block at the current position and check to ensure that it
hasn't already been merged, is not an air block, and can be seen by the player. A block is considered visible to the player if the adjacent block to it is air. This will be checked via `IsBlockFaceVisible()`

```c#
    public bool IsBlockFaceVisible(Vector3Int blockPosition, int axis, bool backFace) {
        blockPosition[axis] += backFace ? -1 : 1;
        return !GetBlock(blockPosition).IsSolid();
    }
```

```c#
    // Iterate over the chunk layer by layer.
    for (startPos[direction] = 0; startPos[direction] < Dimensions[direction]; startPos[direction]++) {
        merged = new bool[Dimensions[workAxis1], Dimensions[workAxis2]];

        // Build the slices of the mesh.
        for (startPos[workAxis1] = 0; startPos[workAxis1] < Dimensions[workAxis1]; startPos[workAxis1]++) {
            for (startPos[workAxis2] = 0; startPos[workAxis2] < Dimensions[workAxis2]; startPos[workAxis2]++) {
                startBlock = GetBlock(startPos);

                // If this block has already been merged, is air, or not visible skip it.
                if (merged[startPos[workAxis1], startPos[workAxis2]] || !startBlock.IsSolid() || !IsBlockFaceVisible(startPos, direction, isBackFace)) {
                    continue;
                }
            }
        }
    }
```

Reset the quad size variable (q) back to zero. This tracks how big the current face
we are creating will be.

```c#
    //Reset the work var
    quadSize = new Vector3Int();
```

Now we want to figure out how wide this face of the mesh will be. This for loop continuously
compares the next neighbor to see if it is a match to the current one.

```c#
    // Figure out the width, then save it
    for (currPos = startPos, currPos[workAxis2]++; currPos[workAxis2] < Dimensions[workAxis2] && CompareStep(startPos, currPos, direction, isBackFace) && !merged[currPos[workAxis1], currPos[workAxis2]]; currPos[workAxis2]++) { }
    quadSize[workAxis2] = currPos[workAxis2] - startPos[workAxis2];
```

For completeness here is `CompareStep()`

```c#
public bool CompareStep(Vector3Int a, Vector3Int b, int direction, bool backFace) {
    Block blockA = GetBlock(a);
    Block blockB = GetBlock(b);

    return blockA == blockB && blockB.IsSolid() && IsBlockFaceVisible(b, direction, backFace);
}
```

Now we want to repeat the same process for the height of the face.

```c#
    // Figure out the height, then save it
    for (currPos = startPos, currPos[workAxis1]++; currPos[workAxis1] < Dimensions[workAxis1] && CompareStep(startPos, currPos, direction, isBackFace) && !merged[currPos[workAxis1], currPos[workAxis2]]; currPos[workAxis1]++) {
        for (currPos[workAxis2] = startPos[workAxis2]; currPos[workAxis2] < Dimensions[workAxis2] && CompareStep(startPos, currPos, direction, isBackFace) && !merged[currPos[workAxis1], currPos[workAxis2]]; currPos[workAxis2]++) { }

        // If we didn't reach the end then its not a good add.
        if (currPos[workAxis2] - startPos[workAxis2] < quadSize[workAxis2]) {
            break;
        } else {
            currPos[workAxis2] = startPos[workAxis2];
        }
    }
    quadSize[workAxis1] = currPos[workAxis1] - startPos[workAxis1];
```

Once we have figured out the height and width of the face, we can go ahead and add it to our mesh.

```c#
    // Now we add the quad to the mesh
    m = new Vector3Int();
    m[workAxis1] = quadSize[workAxis1];

    n = new Vector3Int();
    n[workAxis2] = quadSize[workAxis2];

    // We need to add a slight offset when working with front faces.
    offsetPos = startPos;
    offsetPos[direction] += isBackFace ? 0 : 1;

    //Draw the face to the mesh
    vertices = new Vector3[] {
        offsetPos,
        offsetPos + m,
        offsetPos + m + n,
        offsetPos + n
    };

    builder.AddSquareFace(vertices, startBlock.GetColor(), isBackFace);
```

And lastly we need to mark all the blocks we visited as merged.

```c#
    // Mark it merged
    for (int f = 0; f < quadSize[workAxis1]; f++) {
        for (int g = 0; g < quadSize[workAxis2]; g++) {
            merged[startPos[workAxis1] + f, startPos[workAxis2] + g] = true;
        }
    }
```

Here's the full algorithm for those who like to see the big picture.

```c#
    public MeshData GenerateMesh() {
        MeshBuilder builder = new MeshBuilder();
        bool[,] merged;

        Vector3Int startPos, currPos, quadSize, m, n, offsetPos;
        Vector3[] vertices;

        Block startBlock;
        int direction, workAxis1, workAxis2;

        // Iterate over each face of the blocks.
        for (int face = 0; face < 6; face++) {
            bool isBackFace = face > 2;
            direction = face % 3;
            workAxis1 = (direction + 1) % 3;
            workAxis2 = (direction + 2) % 3;

            startPos = new Vector3Int();
            currPos = new Vector3Int();

            // Iterate over the chunk layer by layer.
            for (startPos[direction] = 0; startPos[direction] < Dimensions[direction]; startPos[direction]++) {
                merged = new bool[Dimensions[workAxis1], Dimensions[workAxis2]];

                // Build the slices of the mesh.
                for (startPos[workAxis1] = 0; startPos[workAxis1] < Dimensions[workAxis1]; startPos[workAxis1]++) {
                    for (startPos[workAxis2] = 0; startPos[workAxis2] < Dimensions[workAxis2]; startPos[workAxis2]++) {
                        startBlock = GetBlock(startPos);

                        // If this block has already been merged, is air, or not visible skip it.
                        if (merged[startPos[workAxis1], startPos[workAxis2]] || !startBlock.IsSolid() || !IsBlockFaceVisible(startPos, direction, isBackFace)) {
                            continue;
                        }

                        // Reset the work var
                        quadSize = new Vector3Int();

                        // Figure out the width, then save it
                        for (currPos = startPos, currPos[workAxis2]++; currPos[workAxis2] < Dimensions[workAxis2] && CompareStep(startPos, currPos, direction, isBackFace) && !merged[currPos[workAxis1], currPos[workAxis2]]; currPos[workAxis2]++) { }
                        quadSize[workAxis2] = currPos[workAxis2] - startPos[workAxis2];

                        // Figure out the height, then save it
                        for (currPos = startPos, currPos[workAxis1]++; currPos[workAxis1] < Dimensions[workAxis1] && CompareStep(startPos, currPos, direction, isBackFace) && !merged[currPos[workAxis1], currPos[workAxis2]]; currPos[workAxis1]++) {
                            for (currPos[workAxis2] = startPos[workAxis2]; currPos[workAxis2] < Dimensions[workAxis2] && CompareStep(startPos, currPos, direction, isBackFace) && !merged[currPos[workAxis1], currPos[workAxis2]]; currPos[workAxis2]++) { }

                            // If we didn't reach the end then its not a good add.
                            if (currPos[workAxis2] - startPos[workAxis2] < quadSize[workAxis2]) {
                                break;
                            } else {
                                currPos[workAxis2] = startPos[workAxis2];
                            }
                        }
                        quadSize[workAxis1] = currPos[workAxis1] - startPos[workAxis1];

                        // Now we add the quad to the mesh
                        m = new Vector3Int();
                        m[workAxis1] = quadSize[workAxis1];

                        n = new Vector3Int();
                        n[workAxis2] = quadSize[workAxis2];

                        // We need to add a slight offset when working with front faces.
                        offsetPos = startPos;
                        offsetPos[direction] += isBackFace ? 0 : 1;

                        //Draw the face to the mesh
                        vertices = new Vector3[] {
                            offsetPos,
                            offsetPos + m,
                            offsetPos + m + n,
                            offsetPos + n
                        };

                        builder.AddSquareFace(vertices, startBlock.GetColor(), isBackFace);

                        // Mark it merged
                        for (int f = 0; f < quadSize[workAxis1]; f++) {
                            for (int g = 0; g < quadSize[workAxis2]; g++) {
                                merged[startPos[workAxis1] + f, startPos[workAxis2] + g] = true;
                            }
                        }
                    }
                }
            }
        }

        return builder.ToMeshData();
    }
```

And last but not least, if we want to render our mesh we generated we'll need to pass the data to a MeshFilter. For extra bonus points we could implement an extension method to make it even cleaner.

```c#
using UnityEngine;

public static class MeshFilterExts {
    public static void ApplyMeshData(this MeshFilter meshFilter, MeshData meshData) {
        meshFilter.mesh.Clear();
        meshFilter.mesh.vertices = meshData.Vertices;
        meshFilter.mesh.triangles = meshData.Triangles;

        //Color mesh and calculate normals
        meshFilter.mesh.colors32 = meshData.Colors;
        meshFilter.mesh.RecalculateNormals();
    }
}
```

Then to render our mesh we would use it like so.

```c#
    MeshData mesh = chunk.GenerateMesh();

    MeshFilter meshFilter = GetComponent<MeshFilter>();
    meshFilter.ApplyMeshData(mesh);
```
