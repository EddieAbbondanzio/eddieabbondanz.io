---
title: "No Mans Blocks - 4/20/18"
date: 2018-04-20
type: post
category: "Development"
---

## Playing Around at the Bit Level

This weeks adventure has been exploring object serialization. Initially I was using the serializable attribute to convert my objects into byte arrays but for some objects such as the voxel chunks this is far from ideal. Since I don't want to handle serialization with 2 different methods I've decided to bite the bullet and roll my own set up.

To help prepare for this task I've created a BitManipulator class that allows for individual bits to be written to in a byte array. This was done to allow for writing bools as single bits vew an entire byte. The BitManipulator will be used by the ByteBuffer to help pack data as tight as possible for network traversal.

To limit the use of the bit manipulator it only allows for writing between 1 to 8 bits at a time. Any more than that would be unreasonable since it would be no different than writing bytes. Also by setting the upper limit to 8 it only requires us to handle 2 cases. The first when modifying only 1 byte, and the second where two (adjacent) bytes are being modified.

Reading bits is fairly simple.

```c#
public static byte ReadBits(byte[] bytes, int bitIndex, int bitCount) {
    //Ensure valid use of the method.
    if (bitCount < 1 || bitCount > 8) {
        throw new ArgumentException("Bit count should be within the range of 1 to 8!");
    }

    //Figure out byte index, and where to start in the byte
    int byteIndex = bitIndex / 8;
    int bitOffset = bitIndex % 8;

    //Reading from 1 byte
    if (bitCount + bitOffset <= 8) {
        //Build the mask
        byte mask = (byte)(((1 << bitCount) - 1) << bitOffset);

        //Get the bits and shift them to proper location.
        return (byte)((bytes[byteIndex] & mask) >> bitOffset);
    }
    //Reading from 2 bytes
    else {
        //Gets the two bytes combined
        short value = SerializeUtils.GetShort(bytes, byteIndex);

        //Then we can pull out the data we want.
        short mask = (short)(((1 << bitCount) - 1) << bitOffset);
        return (byte)((value & mask) >> bitOffset);
    }
}
```

Writing bits is only a little more challenging.

```c#
public static void WriteBits(byte[] bytes, int bitIndex, int bitCount, byte value) {
    //Ensure valid use of the method.
    if (bitCount < 1 || bitCount > 8) {
        throw new ArgumentException("Bit count should be within the range of 1 to 8!");
    }

    //Divide it by 8, and find bit offset.
    int byteIndex = bitIndex / 8;
    int bitOffset = bitIndex % 8;

    //Writing into 1 byte case
    if (bitCount + bitOffset <= 8) {
        //shift to account for offset
        value <<= bitOffset;

        //Build the mask
        byte mask = (byte)(((1 << bitCount) - 1) << bitOffset);

        bytes[byteIndex] &= (byte)~mask;
        bytes[byteIndex] |= value;
    }
    //Writing into 2 bytes case
    else {
        //Build a short
        short splitVal = (short)(value << bitOffset);
        short mask = (short)(((1 << bitCount) - 1) << bitOffset);

        //Wipe the bits
        bytes[byteIndex] &= (byte)~mask;
        bytes[byteIndex] |= (byte)splitVal;

        //Write the bits
        bytes[byteIndex + 1] &= (byte)~(mask >> 8);
        bytes[byteIndex + 1] |= (byte)(splitVal >> 8);
    }
}
```

I played around with using a short pointer for writing bits but it didn't seem worth it to require the unsafe compile flag for a single method. It was still a fun task though. I've also learned about the joys of Unit Testing and have started using it for validating all my serialization methods. Once details are a little more concrete regarding the ByteBuffer set up I'll provide a detailed write up on it.
