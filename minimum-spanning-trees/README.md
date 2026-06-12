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