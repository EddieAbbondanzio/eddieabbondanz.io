---
title: "Greedy Meshing for Voxels"
date: 2018-03-25T10:06:59-04:00
draft: false
type: post
categories: ["Voxel"]
---

What is Greedy Meshing?
---

Anyone who has spent some time working with voxels will have heard of the term 'Greedy Meshing' at some point. If your new
to the concept check out this [article](https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/) written by Mikola Lysenko.
It's probably the most popular (and if not best) article out there regarding voxel mesh generation.

However if your like me, your probably looking for a simpler explanation and perhaps some source code to really get the
ball rolling, and improve your understanding. Hopefully this post will be able to help. This post assumes you already have
a fairly good understanding of the typical voxel setup comprised of a world divided by cubic chunks of blocks.

I'm not going to fully cover my implementation 100% so it's up to you to fill in the few missing details. This setup is
built for Unity and derives work from Alex Stv's voxel tutorial. The algorithm itself is based off the work of [Robert O'Leary](https://github.com/roboleary/GreedyMesh)
who derived his work from the author of the article posted above.

To start well need a way to track if we're building a render mesh, or collision mesh. The only difference between the two
is in the block compare step a render mesh will test for color equivalency.

```c#
    //Basic enum to keep track of the two types of meshes
    public enum MeshType : byte {
        Render = 0,
        Collision = 1
    }

    //Builds the optimized greedy mesh of a chunk
    public MeshData GreedyMesh(MeshType type){
        MeshData mesh = new Mesh(RenderKey);
        
        return mesh;
    }
```

Within the GreedyMesh function well want to add a loop that runs through all 6 faces. We'll also want
to know if the current face is a back face.

```c#
    for(int s = 0; s < 6; s++){
        bool back = s > 2;
    }
```

To simplify things, we'll break down the problem into building slices of the mesh on 1 plane
at a time. Lets add some work variables for tracking which two axes we are working on. We will work
on the planes YZ, ZX, XY. Each plane will be visited twice, once to do the front faces, then
again to do the back faces.

```c#
    int d, i, j;
    for(int s = 0; s < 6; s++){
        bool back = s > 2;
        d = s % 3;
        i = (d + 1) % 3;
        j = (d + 2) % 3;
    }
```

We still need a few more work variables. Go ahead and add the following above the for loop. Vect3Int is simply
an integer version of Unity's Vector3. Anything can be used to substitute these even a simple int array of
size 3 will suffice.

```c#
    //This tracks if we merged the blocks in the slice.
    bool[,] merged;
    
    Vect3Int a, b, q, m, n, o;
    Vector3[] verts;
    
    Block startBlock;
```

Now add an inner for loop as seen below. This will work it's way through the chunk 1 layer at a time
in the direction (d).

```c#

    for(int s = 0; s < 6; s++){
        bool back = s > 2;
        d = s % 3;
        i = (d + 1) % 3;
        j = (d + 2) % 3;
        
        a = new Vect3Int();
        b = new Vect3Int();
        
        //d is the axis we are slicing on.
        for (a[d] = 0; a[d] < Size[d]; a[d]++) {

        
        }
    }
```

We'll want to prep our bool array now. The variable Size is a Vect3Int of the dimensions of
the chunk we are building. Since we want to be able to handle non cubic chunks we can't 
initialize it until we know which axis we are slicing. The next step is to begin building the 
mesh slices.

Start by getting the block at the current position and check to ensure that it
hasn't already been merged, is solid, and can be seen by the player.

```c#
        //d is the axis we are slicing on.
        for (a[d] = 0; a[d] < Size[d]; a[d]++) {
            merged = new bool[Size[i], Size[j]];

            //Now we build the slices
            for (a[i] = 0; a[i] < Size[i]; a[i]++) {
                for (a[j] = 0; a[j] < Size[j]; a[j]++) {     
                    startBlock = GetBlock(a);
                
                    //If this block has already been merged, is air, or not visible skip it.
                    if (merged[a[i], a[j]] || !startBlock.IsSolid || !IsBlockFaceVisible(a, d, back)) {
                        continue;
                    }
                }
            }
        }
```

The GetBlock() and IsBlockFaceVisible() functions will vary based off your implementation but should follow the
signatures of:

```c# 
    public Block GetBlock(Vect3Int pos){
        //If out of bounds return air, else return the block at pos.
    }
    
    public bool IsBlockFaceVisible(Vect3Int pos, int a, bool back) {
        pos[a] += back ? -1 : 1;
        return !GetBlock(pos).IsSolid;
    }
```

You'll also want to add a CompareStep() function that tests two blocks for equivalency. Mine is
implemented as:
```c#
    public bool CompareStep(Vect3Int a, Vect3Int b, int d, bool back, MeshType type) {
        Block blockA = GetBlock(a);
        Block blockB = GetBlock(b);

        if(type == MeshType.Render) {
            return blockA == blockB && !blockB.IsAir && IsBlockFaceVisible(b, d, back);
        }
        else {
            return !blockB.IsAir && IsBlockFaceVisible(b, d, back);
        }
    }
```

Reset the quad size variable (q) back to zero. This tracks how big the current face
we are creating will be.

```c#
    //Reset the work var
    q = new Vect3Int();

```

Now we want to figure out how wide this face of the mesh will be. This for loop continuously 
compares the next neighbor to see if it is a match to the current one.

```c#
    //Figure out the width, then save it
    for (b = a, b[j]++; b[j] < Size[j] && CompareStep(a, b, d, back, type) && !merged[b[i], b[j]]; b[j]++) { }
    q[j] = b[j] - a[j];
```

Now we want to repeat the same process for the height of the face.
```c#
    //Figure out the height, then save it
    for (b = a, b[i]++; b[i] < Size[i] && CompareStep(a, b, d, back, type) && !merged[b[i], b[j]]; b[i]++) {
        for (b[j] = a[j]; b[j] < Size[j] && CompareStep(a, b, d, back, type) && !merged[b[i], b[j]]; b[j]++) { }

        //If we didn't reach the end then its not a good add.
        if (b[j] - a[j] < q[j]) {
            break;
        }
        else {
            b[j] = a[j];
        }
    }
    q[i] = b[i] - a[i];
```

Once we have figured out the height and width of the face, we can go ahead and add it to our mesh.

```c#
    //Now we add the quad to the mesh
    m = new Vect3Int();
    m[i] = q[i];

    n = new Vect3Int();
    n[j] = q[j];

    //We need to add a slight offset when working with front faces.
    o = a;
    o[d] += back ? 0 : 1;

    //Draw the face to the mesh
    verts = new Vector3[] { o, o + m, o + m + n, o + n };
    mesh.AddColoredFace(verts, startBlock.Color, back);

```

And lastly we need to mark all the blocks we visited as merged.


```c# 
    //Mark it merged
    for (int f = 0; f < q[i]; f++) {
        for (int g = 0; g < q[j]; g++) {
            merged[a[i] + f, a[j] + g] = true;
        }
    }

  ```
    
Here's the full algorithm for those who like to see the big picture.
```c#
    //Builds the optimized greedy mesh of a chunk
    public MeshData GreedyMesh(MeshType type){
        MeshData mesh = new Mesh(RenderKey);
        
        //This tracks if we merged the blocks in the slice.
        bool[,] merged;

        Vect3Int a, b, q, m, n, o;
        Vector3[] verts;

        Block startBlock;
        int d, i, j;
        
        for(int s = 0; s < 6; s++){
            bool back = s > 2;
            d = s % 3;
            i = (d + 1) % 3;
            j = (d + 2) % 3;
            
            a = new Vect3Int();
            b = new Vect3Int();

            //This is the axis we will slice on
            for (a[d] = 0; a[d] < Size[d]; a[d]++) {
                merged = new bool[Size[i], Size[j]];

                //These are dem slices we're building
                for (a[i] = 0; a[i] < Size[i]; a[i]++) {
                    for (a[j] = 0; a[j] < Size[j]; a[j]++) {
                        startBlock = GetBlock(a);

                        //If this block has already been merged, is air, or not visible skip it.
                        if (merged[a[i], a[j]] || !startBlock.IsSolid || !IsBlockFaceVisible(a, d, back)) {
                            continue;
                        }

                        //Reset the work var
                        q = new Vect3Int();

                        //Figure out the width, then save it
                        for (b = a, b[j]++; b[j] < Size[j] && CompareStep(a, b, d, back, type) && !merged[b[i], b[j]]; b[j]++) { }
                        q[j] = b[j] - a[j];

                        //Figure out the height, then save it
                        for (b = a, b[i]++; b[i] < Size[i] && CompareStep(a, b, d, back, type) && !merged[b[i], b[j]]; b[i]++) {
                            for (b[j] = a[j]; b[j] < Size[j] && CompareStep(a, b, d, back, type) && !merged[b[i], b[j]]; b[j]++) { }

                            //If we didn't reach the end then its not a good add.
                            if (b[j] - a[j] < q[j]) {
                                break;
                            }
                            else {
                                b[j] = a[j];
                            }
                        }
                        q[i] = b[i] - a[i];

                        //Now we add the quad to the mesh
                        m = new Vect3Int();
                        m[i] = q[i];

                        n = new Vect3Int();
                        n[j] = q[j];

                        //We need to add a slight offset when working with front faces.
                        o = a;
                        o[d] += back ? 0 : 1;

                        //Draw the face to the mesh
                        verts = new Vector3[] { o, o + m, o + m + n, o + n };
                        mesh.AddColoredFace(verts, startBlock.Color, back);

                        //Mark it merged
                        for (int f = 0; f < q[i]; f++) {
                            for (int g = 0; g < q[j]; g++) {
                                merged[a[i] + f, a[j] + g] = true;
                            }
                        }
                    }
                }
            }
        }
            
        return mesh;
    }
```
    