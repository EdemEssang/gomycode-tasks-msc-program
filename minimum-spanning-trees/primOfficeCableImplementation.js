// ==================== MIN-HEAP (PRIORITY QUEUE) ====================

/**
 * Min-Heap implementation for Prim's Algorithm
 * Time Complexity: O(log n) for insert and extractMin
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    // Insert edge into heap - O(log n)
    insert(edge) {
        this.heap.push(edge);
        this.bubbleUp(this.heap.length - 1);
    }
    
    bubbleUp(index) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.heap[parent].weight <= this.heap[index].weight) break;
            
            [this.heap[parent], this.heap[index]] = 
            [this.heap[index], this.heap[parent]];
            index = parent;
        }
    }
    
    // Extract minimum weight edge - O(log n)
    extractMin() {
        if (this.heap.length === 0) return null;
        
        const min = this.heap[0];
        const last = this.heap.pop();
        
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.sinkDown(0);
        }
        
        return min;
    }
    
    sinkDown(index) {
        while (true) {
            let smallest = index;
            const left = 2 * index + 1;
            const right = 2 * index + 2;
            
            if (left < this.heap.length && 
                this.heap[left].weight < this.heap[smallest].weight) {
                smallest = left;
            }
            if (right < this.heap.length && 
                this.heap[right].weight < this.heap[smallest].weight) {
                smallest = right;
            }
            
            if (smallest === index) break;
            
            [this.heap[index], this.heap[smallest]] = 
            [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
    
    size() {
        return this.heap.length;
    }
}

// ==================== PRIM'S ALGORITHM ====================

/**
 * Prim's Algorithm for Minimum Spanning Tree
 * Time Complexity: O(E log V) with binary heap
 * Space Complexity: O(V + E)
 */
class PrimMST {
    constructor(vertices, edges) {
        this.vertices = [...vertices];
        this.edges = edges;
        this.adjacencyList = this.buildAdjacencyList();
        this.mst = [];
        this.totalCost = 0;
    }
    
    /**
     * Build adjacency list from edges for efficient neighbor lookup
     */
    buildAdjacencyList() {
        const adjList = {};
        
        // Initialize empty adjacency list for each vertex
        for (const vertex of this.vertices) {
            adjList[vertex] = [];
        }
        
        // Add edges (undirected graph)
        for (const edge of this.edges) {
            adjList[edge.from].push({ to: edge.to, weight: edge.weight });
            adjList[edge.to].push({ to: edge.from, weight: edge.weight });
        }
        
        return adjList;
    }
    
    /**
     * Compute MST using Prim's Algorithm
     * @param {string} startVertex - Optional starting vertex (defaults to first vertex)
     */
    computeMST(startVertex = null) {
        // Choose starting vertex
        const start = startVertex || this.vertices[0];
        
        if (!this.vertices.includes(start)) {
            console.log(`❌ Vertex ${start} not found!`);
            return null;
        }
        
        console.log(`\n🎯 Starting Prim's Algorithm from computer: ${start}`);
        console.log("-".repeat(50));
        
        const visited = new Set();
        const minHeap = new MinHeap();
        
        // Start from the chosen vertex
        visited.add(start);
        console.log(`\n📍 Step 0: Mark ${start} as visited`);
        
        // Add all edges from start vertex to heap
        for (const edge of this.adjacencyList[start]) {
            minHeap.insert({
                from: start,
                to: edge.to,
                weight: edge.weight
            });
        }
        
        console.log(`   Added ${this.adjacencyList[start].length} edge(s) from ${start} to heap`);
        
        let step = 1;
        
        // Continue until we have V-1 edges or heap is empty
        while (!minHeap.isEmpty() && this.mst.length < this.vertices.length - 1) {
            // Get the cheapest edge from heap
            const cheapestEdge = minHeap.extractMin();
            
            console.log(`\n📍 Step ${step}: Considering edge ${cheapestEdge.from} --${cheapestEdge.weight}--> ${cheapestEdge.to}`);
            
            // Skip if destination already visited (would create cycle)
            if (visited.has(cheapestEdge.to)) {
                console.log(`   ❌ REJECTED: ${cheapestEdge.to} already visited (would create cycle)`);
                step++;
                continue;
            }
            
            // Add this edge to MST
            this.mst.push(cheapestEdge);
            this.totalCost += cheapestEdge.weight;
            visited.add(cheapestEdge.to);
            
            console.log(`   ✅ ACCEPTED: Added to MST (Total cost now: ${this.totalCost})`);
            console.log(`   📊 Visited computers: ${Array.from(visited).join(', ')}`);
            
            // Add all edges from the newly visited vertex
            let addedCount = 0;
            for (const edge of this.adjacencyList[cheapestEdge.to]) {
                if (!visited.has(edge.to)) {
                    minHeap.insert({
                        from: cheapestEdge.to,
                        to: edge.to,
                        weight: edge.weight
                    });
                    addedCount++;
                }
            }
            console.log(`   ➕ Added ${addedCount} new edge(s) from ${cheapestEdge.to} to heap (heap size: ${minHeap.size()})`);
            
            step++;
        }
        
        // Check if we found a spanning tree
        const isSpanningTree = this.mst.length === this.vertices.length - 1;
        
        return {
            mstEdges: this.mst,
            totalCost: this.totalCost,
            isSpanningTree: isSpanningTree,
            visitedCount: visited.size
        };
    }
    
    /**
     * Display MST results in a formatted way
     */
    displayResult() {
        console.log("\n" + "=".repeat(60));
        console.log("MINIMUM SPANNING TREE (MST) USING PRIM'S ALGORITHM");
        console.log("=".repeat(60));
        
        if (this.mst.length === 0) {
            console.log("❌ No MST found. Graph may be disconnected.");
            return;
        }
        
        console.log("\n📡 SELECTED CABLE CONNECTIONS:");
        console.log("-".repeat(40));
        
        this.mst.forEach((edge, index) => {
            console.log(`  ${index + 1}. Computer ${edge.from} <--${edge.weight}m--> Computer ${edge.to}`);
        });
        
        console.log("\n💰 NETWORK STATISTICS:");
        console.log("-".repeat(40));
        console.log(`  Total Computers: ${this.vertices.length}`);
        console.log(`  Total Cables: ${this.mst.length}`);
        console.log(`  Total Cable Length: ${this.totalCost} meters`);
        
        if (this.mst.length === this.vertices.length - 1) {
            console.log(`\n✅ Valid Minimum Spanning Tree: ${this.mst.length} = V-1 edges`);
        } else {
            console.log(`\n⚠️  Warning: Only ${this.mst.length} of ${this.vertices.length - 1} edges found`);
            console.log(`   Graph may be disconnected!`);
        }
    }
    
    /**
     * Visualize the network topology
     */
    visualizeNetwork() {
        console.log("\n🌐 NETWORK TOPOLOGY:");
        console.log("-".repeat(40));
        
        // Build tree structure from MST
        const tree = {};
        for (const vertex of this.vertices) {
            tree[vertex] = [];
        }
        
        for (const edge of this.mst) {
            tree[edge.from].push({ to: edge.to, weight: edge.weight });
            tree[edge.to].push({ to: edge.from, weight: edge.weight });
        }
        
        // Display connections
        for (const [vertex, neighbors] of Object.entries(tree)) {
            if (neighbors.length > 0) {
                const connections = neighbors.map(n => `${n.to}(${n.weight}m)`).join(', ');
                console.log(`  ${vertex} → [${connections}]`);
            } else if (this.vertices.length === 1) {
                console.log(`  ${vertex} → [isolated]`);
            }
        }
        
        // Calculate network diameter (longest shortest path)
        if (this.mst.length > 0) {
            const diameter = this.calculateDiameter(tree);
            console.log(`\n📏 Network Diameter: ${diameter} meters (longest cable path)`);
        }
    }
    
    /**
     * Calculate network diameter (longest shortest path in tree)
     */
    calculateDiameter(tree) {
        // Simple BFS to find farthest node
        const bfs = (start) => {
            const distances = {};
            const queue = [{ node: start, dist: 0 }];
            const visited = new Set();
            
            for (const v of this.vertices) distances[v] = Infinity;
            distances[start] = 0;
            
            while (queue.length > 0) {
                const { node, dist } = queue.shift();
                if (visited.has(node)) continue;
                visited.add(node);
                
                for (const neighbor of tree[node]) {
                    if (!visited.has(neighbor.to)) {
                        const newDist = dist + neighbor.weight;
                        if (newDist < distances[neighbor.to]) {
                            distances[neighbor.to] = newDist;
                            queue.push({ node: neighbor.to, dist: newDist });
                        }
                    }
                }
            }
            
            let farthest = start;
            let maxDist = 0;
            for (const [node, dist] of Object.entries(distances)) {
                if (dist < Infinity && dist > maxDist) {
                    maxDist = dist;
                    farthest = node;
                }
            }
            
            return { farthest, maxDist };
        };
        
        const { farthest } = bfs(this.vertices[0]);
        const { maxDist } = bfs(farthest);
        return maxDist;
    }
    
    /**
     * Compare with different starting vertices
     */
    compareStartingVertices() {
        console.log("\n" + "=".repeat(60));
        console.log("COMPARING DIFFERENT STARTING VERTICES");
        console.log("=".repeat(60));
        
        const results = [];
        
        for (const vertex of this.vertices.slice(0, 3)) { // Test first 3 vertices
            const prim = new PrimMST(this.vertices, this.edges);
            const result = prim.computeMST(vertex);
            results.push({ start: vertex, totalCost: result.totalCost, edges: result.mstEdges.length });
        }
        
        console.log("\n📊 Results:");
        results.forEach(r => {
            console.log(`  Starting from ${r.start}: Total cost = ${r.totalCost}, Edges = ${r.edges}`);
        });
        
        const allSame = results.every(r => r.totalCost === results[0].totalCost);
        console.log(`\n✅ All starting vertices produce the same MST cost: ${allSame ? 'YES' : 'NO'}`);
    }
}

// ==================== OFFICE NETWORK DESIGNER ====================

class OfficeNetworkDesigner {
    constructor() {
        this.computers = new Set();
        this.cables = [];
    }
    
    /**
     * Add a computer to the office
     */
    addComputer(name) {
        name = name.toUpperCase().trim();
        if (this.computers.has(name)) {
            console.log(`⚠️  Computer ${name} already exists!`);
            return false;
        }
        this.computers.add(name);
        console.log(`✅ Added computer: ${name}`);
        this.displayStatus();
        return true;
    }
    
    /**
     * Add a cable connection between two computers
     */
    addCable(from, to, weight) {
        from = from.toUpperCase().trim();
        to = to.toUpperCase().trim();
        weight = parseFloat(weight);
        
        if (!this.computers.has(from)) {
            console.log(`❌ Computer ${from} doesn't exist! Add it first.`);
            return false;
        }
        if (!this.computers.has(to)) {
            console.log(`❌ Computer ${to} doesn't exist! Add it first.`);
            return false;
        }
        if (weight <= 0) {
            console.log(`❌ Cable length must be positive!`);
            return false;
        }
        
        // Check for duplicate cable
        const exists = this.cables.some(c => 
            (c.from === from && c.to === to) || 
            (c.from === to && c.to === from)
        );
        
        if (exists) {
            console.log(`⚠️  Cable between ${from} and ${to} already exists!`);
            return false;
        }
        
        this.cables.push({ from, to, weight });
        console.log(`✅ Added cable: ${from} <--${weight}m--> ${to}`);
        this.displayStatus();
        return true;
    }
    
    /**
     * Compute and display optimal network using Prim's Algorithm
     */
    designOptimalNetwork(startComputer = null) {
        if (this.computers.size === 0) {
            console.log("\n❌ No computers added! Please add computers first.");
            return null;
        }
        
        if (this.cables.length < this.computers.size - 1) {
            console.log(`\n⚠️  Warning: Need at least ${this.computers.size - 1} cables to connect all computers.`);
            console.log(`   Currently have ${this.cables.length} cables.`);
        }
        
        console.log("\n" + "=".repeat(60));
        console.log("🏢 OFFICE NETWORK OPTIMIZATION (PRIM'S ALGORITHM)");
        console.log("=".repeat(60));
        
        console.log("\n📊 Input Data:");
        console.log(`  Computers: ${Array.from(this.computers).join(', ')}`);
        console.log(`  Possible Cables: ${this.cables.length}`);
        
        // Run Prim's Algorithm
        const prim = new PrimMST(Array.from(this.computers), this.cables);
        const start = startComputer ? startComputer.toUpperCase() : Array.from(this.computers)[0];
        const result = prim.computeMST(start);
        
        if (result && result.isSpanningTree) {
            prim.displayResult();
            prim.visualizeNetwork();
            
            // Optionally show comparison
            if (this.computers.size <= 10) {
                prim.compareStartingVertices();
            }
        } else if (result && !result.isSpanningTree) {
            console.log("\n❌ Cannot connect all computers! The network is disconnected.");
            console.log(`   Only ${result.visitedCount} of ${this.computers.size} computers connected.`);
            console.log("   Add more cable connections to enable full connectivity.");
        }
        
        return result;
    }
    
    /**
     * Display current network status
     */
    displayStatus() {
        console.log(`\n📋 Current Status: ${this.computers.size} computers, ${this.cables.length} cables`);
        if (this.computers.size > 0 && this.computers.size <= 10) {
            console.log(`   Computers: ${Array.from(this.computers).join(', ')}`);
        }
    }
    
    /**
     * Show all possible cable connections
     */
    showConnections() {
        if (this.cables.length === 0) {
            console.log("\n📋 No cables added yet.");
            return;
        }
        
        console.log("\n📋 AVAILABLE CABLE CONNECTIONS:");
        console.log("-".repeat(40));
        const sorted = [...this.cables].sort((a, b) => a.weight - b.weight);
        sorted.forEach((cable, i) => {
            console.log(`  ${i + 1}. ${cable.from} <--${cable.weight}m--> ${cable.to}`);
        });
    }
    
    /**
     * Remove all data
     */
    reset() {
        this.computers.clear();
        this.cables = [];
        console.log("🔄 All data cleared!");
        this.displayStatus();
    }
    
    /**
     * Load sample office layout
     */
    loadSampleLayout() {
        this.reset();
        
        // Add computers
        const computers = ['A', 'B', 'C', 'D', 'E', 'F'];
        for (const comp of computers) {
            this.addComputer(comp);
        }
        
        // Add cables with costs
        const cables = [
            { from: 'A', to: 'B', weight: 4 },
            { from: 'A', to: 'C', weight: 3 },
            { from: 'B', to: 'C', weight: 2 },
            { from: 'B', to: 'D', weight: 5 },
            { from: 'C', to: 'D', weight: 6 },
            { from: 'C', to: 'E', weight: 4 },
            { from: 'D', to: 'E', weight: 3 },
            { from: 'D', to: 'F', weight: 7 },
            { from: 'E', to: 'F', weight: 5 }
        ];
        
        for (const cable of cables) {
            this.addCable(cable.from, cable.to, cable.weight);
        }
        
        console.log("\n📚 Sample office layout loaded!");
        this.showConnections();
    }
}

// ==================== INTERACTIVE CLI ====================

function interactiveCLI() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    const designer = new OfficeNetworkDesigner();
    
    console.log("\n" + "=".repeat(60));
    console.log("🏢 OFFICE NETWORK CABLE OPTIMIZER");
    console.log("=".repeat(60));
    console.log("\nUsing PRIM'S ALGORITHM to find Minimum Spanning Tree");
    console.log("Prim's Algorithm: Start from a computer, always pick the cheapest");
    console.log("available cable to connect a new computer.");
    
    function showHelp() {
        console.log("\n📖 COMMANDS:");
        console.log("  add comp <name>           - Add a computer");
        console.log("  add cable <A> <B> <len>   - Add cable between computers");
        console.log("  design [start]            - Compute optimal network (MST)");
        console.log("  show                      - Show all possible cables");
        console.log("  sample                    - Load sample office layout");
        console.log("  status                    - Show current network");
        console.log("  reset                     - Clear all data");
        console.log("  help                      - Show this help");
        console.log("  exit                      - Exit program");
    }
    
    showHelp();
    
    rl.setPrompt('\n> ');
    rl.prompt();
    
    rl.on('line', (input) => {
        const parts = input.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        
        switch(command) {
            case 'add':
                if (parts[1] === 'comp' && parts[2]) {
                    designer.addComputer(parts[2]);
                } else if (parts[1] === 'cable' && parts[2] && parts[3] && parts[4]) {
                    designer.addCable(parts[2], parts[3], parts[4]);
                } else {
                    console.log("❌ Usage: add comp <name> OR add cable <A> <B> <length>");
                }
                break;
                
            case 'design':
                const start = parts[1] || null;
                designer.designOptimalNetwork(start);
                break;
                
            case 'show':
                designer.showConnections();
                break;
                
            case 'sample':
                designer.loadSampleLayout();
                break;
                
            case 'status':
                designer.displayStatus();
                break;
                
            case 'reset':
                designer.reset();
                break;
                
            case 'help':
                showHelp();
                break;
                
            case 'exit':
            case 'quit':
                console.log("\n👋 Goodbye! Network optimized successfully!");
                rl.close();
                return;
                
            default:
                console.log(`❌ Unknown command: '${command}'. Type 'help' for commands.`);
        }
        
        rl.prompt();
    });
}

// ==================== RUN DEMONSTRATION ====================

function runDemo() {
    console.log("\n" + "=".repeat(60));
    console.log("DEMONSTRATION: PRIM'S ALGORITHM FOR NETWORK OPTIMIZATION");
    console.log("=".repeat(60));
    
    const designer = new OfficeNetworkDesigner();
    
    // Load sample layout
    designer.loadSampleLayout();
    
    // Design optimal network starting from computer A
    console.log("\n🎯 Running Prim's Algorithm starting from Computer A...");
    const result = designer.designOptimalNetwork('A');
    
    // Show step-by-step explanation
    console.log("\n" + "=".repeat(60));
    console.log("ALGORITHM EXPLANATION - PRIM'S ALGORITHM");
    console.log("=".repeat(60));
    
    console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PRIM'S ALGORITHM - STEP BY STEP                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Choose a starting computer (any computer)                              │
│  2. Mark starting computer as "visited"                                    │
│  3. Add all cables from visited computers to a priority queue (min-heap)   │
│  4. While not all computers are visited:                                   │
│     - Pick the cheapest cable from the priority queue                      │
│     - If the other end is not visited:                                     │
│       → Add cable to MST                                                   │
│       → Mark the new computer as visited                                   │
│       → Add all cables from this new computer to priority queue            │
│     - Else: Skip cable (would create cycle)                                │
│  5. Stop when all computers are connected (V-1 cables)                     │
│                                                                              │
│  Time Complexity: O(E log V) with binary heap                              │
│  Space Complexity: O(V + E)                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
`);
    
    console.log("\n✅ Demonstration complete!");
    console.log("\n💡 Tip: Run the interactive CLI for custom network design:");
    console.log("   node office-network-prim.js --interactive");
}

// Check if running interactively or as demo
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.includes('--interactive') || args.includes('-i')) {
        interactiveCLI();
    } else {
        runDemo();
        console.log("\n📝 To run interactive mode: node office-network-prim.js --interactive");
    }
}

// Export for use in other modules
module.exports = {
    MinHeap,
    PrimMST,
    OfficeNetworkDesigner
};