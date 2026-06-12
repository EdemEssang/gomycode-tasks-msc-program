// ==================== DISJOINT SET (UNION-FIND) ====================

/**
 * Disjoint Set data structure for cycle detection in Kruskal's Algorithm
 * Time Complexity: O(α(n)) amortized (almost constant)
 */
class DisjointSet {
    constructor(vertices) {
        this.parent = {};
        this.rank = {};
        this.size = {};
        
        // Initialize each vertex as its own set
        for (const vertex of vertices) {
            this.parent[vertex] = vertex;
            this.rank[vertex] = 0;
            this.size[vertex] = 1;
        }
    }
    
    /**
     * Find the root of a vertex with path compression
     * Time: O(α(n))
     */
    find(vertex) {
        if (this.parent[vertex] !== vertex) {
            this.parent[vertex] = this.find(this.parent[vertex]); // Path compression
        }
        return this.parent[vertex];
    }
    
    /**
     * Union two vertices by rank (optimized)
     * Returns true if union was performed, false if already connected
     * Time: O(α(n))
     */
    union(vertex1, vertex2) {
        const root1 = this.find(vertex1);
        const root2 = this.find(vertex2);
        
        // If already in same set, union would create a cycle
        if (root1 === root2) return false;
        
        // Union by rank (attach smaller tree under larger tree)
        if (this.rank[root1] < this.rank[root2]) {
            this.parent[root1] = root2;
            this.size[root2] += this.size[root1];
        } else if (this.rank[root1] > this.rank[root2]) {
            this.parent[root2] = root1;
            this.size[root1] += this.size[root2];
        } else {
            // Equal rank: attach root2 under root1 and increase rank
            this.parent[root2] = root1;
            this.rank[root1]++;
            this.size[root1] += this.size[root2];
        }
        
        return true;
    }
    
    /**
     * Check if two vertices are already connected
     */
    isConnected(vertex1, vertex2) {
        return this.find(vertex1) === this.find(vertex2);
    }
    
    /**
     * Get number of distinct components
     */
    getComponentCount() {
        const roots = new Set();
        for (const vertex of Object.keys(this.parent)) {
            roots.add(this.find(vertex));
        }
        return roots.size;
    }
}

// ==================== KRUSKAL'S ALGORITHM ====================

/**
 * Kruskal's Algorithm for Minimum Spanning Tree
 * Time Complexity: O(E log E) due to sorting
 * Space Complexity: O(V + E)
 */
class KruskalMST {
    constructor(vertices, edges) {
        this.vertices = [...vertices]; // Copy vertices
        this.edges = [...edges];       // Copy edges
        this.mst = [];
        this.totalCost = 0;
    }
    
    /**
     * Compute Minimum Spanning Tree using Kruskal's Algorithm
     */
    computeMST() {
        // Step 1: Sort all edges by weight (ascending)
        const sortedEdges = [...this.edges].sort((a, b) => a.weight - b.weight);
        
        // Step 2: Initialize Disjoint Set
        const ds = new DisjointSet(this.vertices);
        
        // Step 3: Process edges in order
        console.log("\n🔍 Processing Edges in Order:");
        console.log("-".repeat(50));
        
        for (const edge of sortedEdges) {
            console.log(`\n  Considering: ${edge.from} --${edge.weight}--> ${edge.to}`);
            
            // Check if adding this edge creates a cycle
            if (ds.union(edge.from, edge.to)) {
                // No cycle - add edge to MST
                this.mst.push(edge);
                this.totalCost += edge.weight;
                console.log(`  ✅ ACCEPTED: Added to MST (Total cost now: ${this.totalCost})`);
                
                // Early termination: We have V-1 edges
                if (this.mst.length === this.vertices.length - 1) {
                    console.log(`\n  🎯 Reached V-1 edges! Stopping early.`);
                    break;
                }
            } else {
                // Creates cycle - skip this edge
                console.log(`  ❌ REJECTED: Would create a cycle`);
            }
        }
        
        return {
            mstEdges: this.mst,
            totalCost: this.totalCost,
            isSpanningTree: this.mst.length === this.vertices.length - 1
        };
    }
    
    /**
     * Display the MST results
     */
    displayResult() {
        console.log("\n" + "=".repeat(60));
        console.log("MINIMUM SPANNING TREE (MST) RESULT");
        console.log("=".repeat(60));
        
        if (!this.mst.length) {
            console.log("No MST found. Graph may be disconnected.");
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
        console.log(`  Cost Savings: ${this.calculateSavings()}%`);
        
        // Verify tree property
        console.log(`\n✅ Verification: ${this.mst.length === this.vertices.length - 1 ? 
            'Valid spanning tree (V-1 edges)' : 'Not a complete spanning tree'}`);
    }
    
    /**
     * Calculate cost savings compared to connecting all possible cables
     */
    calculateSavings() {
        const totalPossibleCost = this.edges.reduce((sum, e) => sum + e.weight, 0);
        if (totalPossibleCost === 0) return 0;
        return ((totalPossibleCost - this.totalCost) / totalPossibleCost * 100).toFixed(1);
    }
    
    /**
     * Get adjacency list from MST for visualization
     */
    getAdjacencyList() {
        const adjList = {};
        for (const vertex of this.vertices) {
            adjList[vertex] = [];
        }
        for (const edge of this.mst) {
            adjList[edge.from].push({ to: edge.to, weight: edge.weight });
            adjList[edge.to].push({ to: edge.from, weight: edge.weight });
        }
        return adjList;
    }
    
    /**
     * Visualize the MST structure
     */
    visualize() {
        const adjList = this.getAdjacencyList();
        
        console.log("\n🌐 NETWORK TOPOLOGY:");
        console.log("-".repeat(40));
        
        for (const [vertex, neighbors] of Object.entries(adjList)) {
            if (neighbors.length > 0) {
                const connections = neighbors.map(n => `${n.to}(${n.weight}m)`).join(', ');
                console.log(`  ${vertex} → [${connections}]`);
            } else if (this.vertices.length === 1) {
                console.log(`  ${vertex} → [isolated]`);
            }
        }
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
     * Compute and display the optimal network using Kruskal's Algorithm
     */
    designOptimalNetwork() {
        if (this.computers.size === 0) {
            console.log("\n❌ No computers added! Please add computers first.");
            return null;
        }
        
        if (this.cables.length < this.computers.size - 1) {
            console.log(`\n⚠️  Warning: Need at least ${this.computers.size - 1} cables to connect all computers.`);
            console.log(`   Currently have ${this.cables.length} cables.`);
        }
        
        console.log("\n" + "=".repeat(60));
        console.log("🏢 OFFICE NETWORK OPTIMIZATION");
        console.log("=".repeat(60));
        
        console.log("\n📊 Input Data:");
        console.log(`  Computers: ${Array.from(this.computers).join(', ')}`);
        console.log(`  Possible Cables: ${this.cables.length}`);
        
        // Run Kruskal's Algorithm
        const kruskal = new KruskalMST(Array.from(this.computers), this.cables);
        const result = kruskal.computeMST();
        
        if (result.isSpanningTree) {
            kruskal.displayResult();
            kruskal.visualize();
        } else {
            console.log("\n❌ Cannot connect all computers! The network is disconnected.");
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
        
        // Add cables (connections with costs)
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
    console.log("\nUsing KRUSKAL'S ALGORITHM to find Minimum Spanning Tree");
    
    function showHelp() {
        console.log("\n📖 COMMANDS:");
        console.log("  add comp <name>           - Add a computer");
        console.log("  add cable <A> <B> <len>   - Add cable between computers");
        console.log("  design                    - Compute optimal network (MST)");
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
            case 'compute':
                designer.designOptimalNetwork();
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
    console.log("DEMONSTRATION: OFFICE NETWORK CABLE OPTIMIZATION");
    console.log("=".repeat(60));
    
    const designer = new OfficeNetworkDesigner();
    
    // Load sample layout
    designer.loadSampleLayout();
    
    // Design optimal network
    const result = designer.designOptimalNetwork();
    
    // Show step-by-step explanation
    console.log("\n" + "=".repeat(60));
    console.log("ALGORITHM EXPLANATION");
    console.log("=".repeat(60));
    
    console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KRUSKAL'S ALGORITHM - STEP BY STEP                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Sort all cables by length (ascending order)                             │
│  2. Initialize: Each computer is its own component                          │
│  3. For each cable from shortest to longest:                                │
│     - If cable connects two different components:                           │
│       → Add to network (MST)                                               │
│       → Merge the two components                                            │
│     - Else: Skip cable (would create a cycle)                               │
│  4. Stop when all computers are connected (V-1 cables)                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
`);
    
    console.log("\n✅ Demonstration complete!");
    console.log("\n💡 Tip: Run the interactive CLI for custom network design:");
    console.log("   node office-network.js");
}

// Check if running interactively or as demo
if (require.main === module) {
    // Check if user wants interactive mode
    const args = process.argv.slice(2);
    if (args.includes('--interactive') || args.includes('-i')) {
        interactiveCLI();
    } else {
        runDemo();
        console.log("\n📝 To run interactive mode: node office-network.js --interactive");
    }
}

// Export for use in other modules
module.exports = {
    DisjointSet,
    KruskalMST,
    OfficeNetworkDesigner
};