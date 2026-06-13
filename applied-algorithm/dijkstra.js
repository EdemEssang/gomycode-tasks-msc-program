javascript
/**
 * Dijkstra's Algorithm - Finds shortest paths from start vertex to all other vertices
 * 
 * @param {Object} graph - Weighted graph represented as adjacency list
 * @param {string} start - Starting vertex
 * @returns {Object} - Shortest distances from start to all vertices
 */

function dijkstra(graph, start) {
    // Validate inputs
    if (!graph || typeof graph !== 'object') {
        throw new Error('Invalid graph: Graph must be an object');
    }
    
    if (!graph[start]) {
        throw new Error(`Start vertex '${start}' not found in graph`);
    }
    
    // Step 1: Initialize distances
    const distances = {};
    const visited = new Set();
    const previous = {}; // For path reconstruction (optional)
    
    // Set initial distances to Infinity for all vertices
    for (const vertex in graph) {
        distances[vertex] = Infinity;
        previous[vertex] = null;
    }
    
    // Distance to start vertex is 0
    distances[start] = 0;
    
    // Step 2: Priority queue implementation using array
    // We'll use a simple array and find min each time (simpler for understanding)
    const unvisited = new Set(Object.keys(graph));
    
    while (unvisited.size > 0) {
        // Find vertex with minimum distance among unvisited
        let current = null;
        let minDistance = Infinity;
        
        for (const vertex of unvisited) {
            if (distances[vertex] < minDistance) {
                minDistance = distances[vertex];
                current = vertex;
            }
        }
        
        // If no reachable vertices left, break
        if (current === null || distances[current] === Infinity) {
            break;
        }
        
        // Remove current from unvisited
        unvisited.delete(current);
        
        // Step 3: Update distances to neighbors
        const neighbors = graph[current];
        if (neighbors) {
            for (const neighbor in neighbors) {
                if (unvisited.has(neighbor)) {
                    const weight = neighbors[neighbor];
                    const newDistance = distances[current] + weight;
                    
                    // If found a shorter path, update distance
                    if (newDistance < distances[neighbor]) {
                        distances[neighbor] = newDistance;
                        previous[neighbor] = current;
                    }
                }
            }
        }
    }
    
    return distances;
}

// Example usage:
// ==================== TESTING ====================

// Test graph from instructions
const graph = {
    'A': { 'B': 4, 'C': 2 },
    'B': { 'A': 4, 'C': 5, 'D': 10 },
    'C': { 'A': 2, 'B': 5, 'D': 3 },
    'D': { 'B': 10, 'C': 3 }
};
const startVertex = 'A';
const shortestDistances = dijkstra(graph, startVertex);
console.log(shortestDistances); // Expected output: { A: 0, B: 4, C: 2, D: 5 }  
