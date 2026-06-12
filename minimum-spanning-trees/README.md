# Network Cable Optimization

### What You're Aiming For
Description: 

You're tasked with designing an efficient cable layout to connect several computers in an office. Each connection between computers has a cost based on the cable length. Your goal is to compute the Minimum Spanning Tree (MST) using Kruskal’s or Prim’s Algorithm, ensuring all computers are connected with the least total cost and no loops.


# Instructions

Instructions:

1. Represent the computers as vertices and the possible cable connections with edges and weights.
2. Implement a function to construct the MST using either Prim’s or Kruskal’s algorithm.
3. Output:
  - List of selected connections (edges).
  - Total cost of the network.
4. Bonus: Allow user input to add nodes and weights dynamically.

Hint:

- Use an adjacency list or a simple list of edges.
- or Kruskal’s, you'll need to implement a Disjoint Set (Union-Find).
- For Prim’s, use a min-heap (priority queue) to pick the next cheapest edge.
- Always check for cycles (in Kruskal) and for visited nodes (in Prim).

========================================================================================================================================================================================================

How to Run office cable implementation using kruskal algorithm
1. Demo Mode already added values
in terminal
`node kruskalOfficenetwork.js`
2. Interactive Mode (Build your own network):
in terminal
`node kruskalOfficenetwork.js --interactive`
Sample Interactive Session:
text
> add comp A
✅ Added computer: A

> add comp B
✅ Added computer: B

> add comp C
✅ Added computer: C

> add cable A B 4
✅ Added cable: A <--4m--> B

> add cable A C 3
✅ Added cable: A <--3m--> C

> add cable B C 2
✅ Added cable: B <--2m--> C

> design

🔍 Processing Edges in Order:
--------------------------------------------------

  Considering: B --2--> C
  ✅ ACCEPTED: Added to MST (Total cost now: 2)

  Considering: A --3--> C
  ✅ ACCEPTED: Added to MST (Total cost now: 5)

  Considering: A --4--> B
  ❌ REJECTED: Would create a cycle

============================================================
MINIMUM SPANNING TREE (MST) RESULT
============================================================

📡 SELECTED CABLE CONNECTIONS:
----------------------------------------
  1. Computer B <--2m--> Computer C
  2. Computer A <--3m--> Computer C

 NETWORK STATISTICS:
----------------------------------------
  Total Computers: 3
  Total Cables: 2
  Total Cable Length: 5 meters



# Key Features Implemented:

✅ Kruskal's Algorithm
Sorts edges by weight

Uses Disjoint Set (Union-Find) for cycle detection

O(E log E) time complexity

✅ Disjoint Set with Optimizations
Path compression for find operations

Union by rank for balanced trees

Component tracking

✅ Complete Output
List of selected connections

Total cost of the network

Network topology visualization

Cost savings calculation

✅ Bonus: Dynamic User Input
Add computers dynamically

Add cables with costs

Load sample layout

Reset functionality

Interactive CLI

✅ Edge Cases Handled
Disconnected graphs (detects when MST not possible)

Duplicate cables prevention

Input validation

Early termination when V-1 edges reached

The implementation efficiently finds the optimal cable layout to connect all computers with minimum total cable length using Kruskal's Algorithm!


========================================================================================================================================================================================================
====================================================================================================

How to Run  office cable implementation using prim algorithm
1. Demo Mode :
bash
`node primOfficeCableImplementation.js`
2. Interactive Mode (Build your own network):
bash
`node primOfficeCableImplementation.js --interactive`

Sample Interactive Session:
text
> add comp A
✅ Added computer: A

> add comp B
✅ Added computer: B

> add comp C
✅ Added computer: C

> add cable A B 4
✅ Added cable: A <--4m--> B

> add cable A C 3
✅ Added cable: A <--3m--> C

> add cable B C 2
✅ Added cable: B <--2m--> C

> design A

🎯 Starting Prim's Algorithm from computer: A

📍 Step 0: Mark A as visited
   Added 2 edge(s) from A to heap

📍 Step 1: Considering edge A --3--> C
   ✅ ACCEPTED: Added to MST (Total cost now: 3)
   📊 Visited computers: A, C
   ➕ Added 2 new edge(s) from C to heap (heap size: 3)

📍 Step 2: Considering edge B --2--> C
   ✅ ACCEPTED: Added to MST (Total cost now: 5)
   📊 Visited computers: A, C, B
   ➕ Added 1 new edge(s) from B to heap (heap size: 2)

📍 Step 3: Considering edge A --4--> B
   ❌ REJECTED: B already visited (would create cycle)

============================================================
MINIMUM SPANNING TREE (MST) USING PRIM'S ALGORITHM
============================================================

📡 SELECTED CABLE CONNECTIONS:
----------------------------------------
  1. Computer A <--3m--> Computer C
  2. Computer B <--2m--> Computer C

💰 NETWORK STATISTICS:
----------------------------------------
  Total Computers: 3
  Total Cables: 2
  Total Cable Length: 5 meters

✅ Valid Minimum Spanning Tree: 2 = V-1 edges
Key Features Implemented:
✅ Prim's Algorithm
Uses Min-Heap (Priority Queue) for efficient edge selection

Grows MST from a starting vertex

O(E log V) time complexity

✅ Min-Heap Implementation
Custom heap with bubbleUp and sinkDown

O(log n) insert and extractMin operations

Efficient priority queue for edge selection

✅ Complete Output
Step-by-step execution trace

List of selected connections

Total cost of the network

Network topology visualization

Network diameter calculation

✅ Bonus: Dynamic User Input
Add computers dynamically

Add cables with costs

Choose starting vertex for Prim's

Load sample layout

Show all possible connections

Reset functionality

Interactive CLI with help system

✅ Advanced Features
Compare results from different starting vertices

Network diameter calculation (longest shortest path)

Disconnected graph detection

Input validation

Cycle prevention using visited set

The implementation efficiently finds the optimal cable layout using Prim's Algorithm with a binary min-heap, ensuring all computers are connected with minimum total cable length!

