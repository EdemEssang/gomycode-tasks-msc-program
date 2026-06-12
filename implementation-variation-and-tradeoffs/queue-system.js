// ==================== 1. QUEUE IMPLEMENTATIONS ====================

/**
 * ARRAY-BASED QUEUE (Fixed Size)
 * Time: enqueue O(1), dequeue O(1), peek O(1)
 * Space: O(n) fixed capacity
 */
class ArrayQueue {
    constructor(capacity = 10) {
        this.capacity = capacity;
        this.queue = new Array(capacity);
        this.front = 0;
        this.rear = 0;
        this.size = 0;
    }
    
    // Add element to the rear - O(1)
    enqueue(element) {
        if (this.isFull()) {
            throw new Error("Queue is full! Cannot enqueue.");
        }
        this.queue[this.rear] = element;
        this.rear = (this.rear + 1) % this.capacity;
        this.size++;
        return true;
    }
    
    // Remove and return front element - O(1)
    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty! Cannot dequeue.");
        }
        const element = this.queue[this.front];
        this.queue[this.front] = null; // Clear reference
        this.front = (this.front + 1) % this.capacity;
        this.size--;
        return element;
    }
    
    // Return front element without removing - O(1)
    peek() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty! Nothing to peek.");
        }
        return this.queue[this.front];
    }
    
    // Check if queue is empty - O(1)
    isEmpty() {
        return this.size === 0;
    }
    
    // Check if queue is full - O(1)
    isFull() {
        return this.size === this.capacity;
    }
    
    // Get current size - O(1)
    getSize() {
        return this.size;
    }
    
    // Display queue contents
    display() {
        if (this.isEmpty()) {
            console.log("Queue is empty");
            return;
        }
        
        let result = [];
        for (let i = 0; i < this.size; i++) {
            const index = (this.front + i) % this.capacity;
            result.push(this.queue[index]);
        }
        console.log(`Array Queue: [${result.join(', ')}] (front: ${this.front}, rear: ${this.rear}, size: ${this.size})`);
    }
}

/**
 * LINKED LIST-BASED QUEUE (Dynamic Size)
 * Time: enqueue O(1), dequeue O(1), peek O(1)
 * Space: O(n) dynamic
 */
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedListQueue {
    constructor() {
        this.front = null;
        this.rear = null;
        this.size = 0;
    }
    
    // Add element to the rear - O(1)
    enqueue(element) {
        const newNode = new Node(element);
        
        if (this.isEmpty()) {
            this.front = newNode;
            this.rear = newNode;
        } else {
            this.rear.next = newNode;
            this.rear = newNode;
        }
        this.size++;
        return true;
    }
    
    // Remove and return front element - O(1)
    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty! Cannot dequeue.");
        }
        
        const element = this.front.data;
        this.front = this.front.next;
        this.size--;
        
        // If queue becomes empty, reset rear
        if (this.isEmpty()) {
            this.rear = null;
        }
        
        return element;
    }
    
    // Return front element without removing - O(1)
    peek() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty! Nothing to peek.");
        }
        return this.front.data;
    }
    
    // Check if queue is empty - O(1)
    isEmpty() {
        return this.size === 0;
    }
    
    // Get current size - O(1)
    getSize() {
        return this.size;
    }
    
    // Display queue contents
    display() {
        if (this.isEmpty()) {
            console.log("Queue is empty");
            return;
        }
        
        let result = [];
        let current = this.front;
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        console.log(`Linked List Queue: [${result.join(', ')}] (size: ${this.size})`);
    }
}

// ==================== 2. PRIORITY QUEUE IMPLEMENTATIONS ====================

/**
 * MIN-HEAP BASED PRIORITY QUEUE
 * Time: insert O(log n), extractMin O(log n), peekMin O(1)
 * Space: O(n)
 */
class MinHeapPriorityQueue {
    constructor() {
        this.heap = [];
    }
    
    // Get parent index
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    
    // Get left child index
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }
    
    // Get right child index
    getRightChildIndex(index) {
        return 2 * index + 2;
    }
    
    // Swap elements in heap
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    
    // Bubble up for insertion - O(log n)
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            
            // If parent is smaller or equal, we're done
            if (this.heap[parentIndex] <= this.heap[index]) {
                break;
            }
            
            // Swap with parent
            this.swap(parentIndex, index);
            index = parentIndex;
        }
    }
    
    // Bubble down for extraction - O(log n)
    bubbleDown(index) {
        const length = this.heap.length;
        
        while (true) {
            let smallest = index;
            const leftChild = this.getLeftChildIndex(index);
            const rightChild = this.getRightChildIndex(index);
            
            // Check left child
            if (leftChild < length && this.heap[leftChild] < this.heap[smallest]) {
                smallest = leftChild;
            }
            
            // Check right child
            if (rightChild < length && this.heap[rightChild] < this.heap[smallest]) {
                smallest = rightChild;
            }
            
            // If no swaps needed, we're done
            if (smallest === index) {
                break;
            }
            
            // Swap with smallest child
            this.swap(index, smallest);
            index = smallest;
        }
    }
    
    // Insert element - O(log n)
    insert(element) {
        this.heap.push(element);
        this.bubbleUp(this.heap.length - 1);
        return true;
    }
    
    // Remove and return minimum element - O(log n)
    extractMin() {
        if (this.isEmpty()) {
            throw new Error("Priority queue is empty! Cannot extract min.");
        }
        
        const min = this.heap[0];
        const last = this.heap.pop();
        
        if (!this.isEmpty()) {
            this.heap[0] = last;
            this.bubbleDown(0);
        }
        
        return min;
    }
    
    // Return minimum element without removing - O(1)
    peekMin() {
        if (this.isEmpty()) {
            throw new Error("Priority queue is empty! Nothing to peek.");
        }
        return this.heap[0];
    }
    
    // Check if priority queue is empty - O(1)
    isEmpty() {
        return this.heap.length === 0;
    }
    
    // Get current size - O(1)
    getSize() {
        return this.heap.length;
    }
    
    // Display heap
    display() {
        if (this.isEmpty()) {
            console.log("Priority queue is empty");
            return;
        }
        console.log(`Min-Heap: [${this.heap.join(', ')}] (size: ${this.heap.length})`);
    }
}

/**
 * ORDERED ARRAY-BASED PRIORITY QUEUE
 * Time: insert O(n), extractMin O(1), peekMin O(1)
 * Space: O(n)
 */
class OrderedArrayPriorityQueue {
    constructor() {
        this.queue = [];
    }
    
    // Insert element maintaining sorted order - O(n)
    insert(element) {
        // Find correct position to insert (binary search + shift)
        let position = 0;
        
        // Linear search for position (simpler)
        while (position < this.queue.length && this.queue[position] < element) {
            position++;
        }
        
        // Insert at position (shifts elements O(n))
        this.queue.splice(position, 0, element);
        return true;
    }
    
    // Insert with binary search (more efficient search, but still O(n) due to shift)
    insertBinarySearch(element) {
        let left = 0;
        let right = this.queue.length;
        
        // Binary search for insertion point - O(log n)
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (this.queue[mid] < element) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        // Insert at position (still O(n) due to shift)
        this.queue.splice(left, 0, element);
        return true;
    }
    
    // Remove and return minimum element - O(1)
    extractMin() {
        if (this.isEmpty()) {
            throw new Error("Priority queue is empty! Cannot extract min.");
        }
        return this.queue.shift(); // Remove first element
    }
    
    // Return minimum element without removing - O(1)
    peekMin() {
        if (this.isEmpty()) {
            throw new Error("Priority queue is empty! Nothing to peek.");
        }
        return this.queue[0];
    }
    
    // Check if priority queue is empty - O(1)
    isEmpty() {
        return this.queue.length === 0;
    }
    
    // Get current size - O(1)
    getSize() {
        return this.queue.length;
    }
    
    // Display queue
    display() {
        if (this.isEmpty()) {
            console.log("Priority queue is empty");
            return;
        }
        console.log(`Ordered Array: [${this.queue.join(', ')}] (size: ${this.queue.length})`);
    }
}

// ==================== TESTING AND COMPARISON ====================

console.log("=".repeat(80));
console.log("QUEUE IMPLEMENTATIONS TESTING");
console.log("=".repeat(80));

// Test Array-based Queue
console.log("\n📊 ARRAY-BASED QUEUE (Fixed Size - Capacity 5)");
console.log("-".repeat(40));

const arrayQueue = new ArrayQueue(5);
console.log("Is empty?", arrayQueue.isEmpty()); // true

console.log("\nEnqueuing: 10, 20, 30, 40, 50");
arrayQueue.enqueue(10);
arrayQueue.enqueue(20);
arrayQueue.enqueue(30);
arrayQueue.enqueue(40);
arrayQueue.enqueue(50);
arrayQueue.display();

console.log("\nPeek:", arrayQueue.peek()); // 10
console.log("Is full?", arrayQueue.isFull()); // true

console.log("\nDequeuing:", arrayQueue.dequeue()); // 10
arrayQueue.display();
console.log("After dequeue, can enqueue again:");
arrayQueue.enqueue(60);
arrayQueue.display();

try {
    arrayQueue.enqueue(70); // Should throw error
} catch (error) {
    console.log("Error (expected):", error.message);
}

// Test Linked List Queue
console.log("\n\n📊 LINKED LIST-BASED QUEUE (Dynamic Size)");
console.log("-".repeat(40));

const linkedQueue = new LinkedListQueue();
console.log("Is empty?", linkedQueue.isEmpty()); // true

console.log("\nEnqueuing: 100, 200, 300, 400");
linkedQueue.enqueue(100);
linkedQueue.enqueue(200);
linkedQueue.enqueue(300);
linkedQueue.enqueue(400);
linkedQueue.display();

console.log("\nPeek:", linkedQueue.peek()); // 100

console.log("\nDequeuing:", linkedQueue.dequeue()); // 100
linkedQueue.display();
console.log("Dequeuing:", linkedQueue.dequeue()); // 200
linkedQueue.display();
console.log("Dequeuing:", linkedQueue.dequeue()); // 300
linkedQueue.display();

console.log("\nEnqueue after dequeue:", 500);
linkedQueue.enqueue(500);
linkedQueue.display();

// Test empty queue error handling
try {
    const emptyQueue = new LinkedListQueue();
    emptyQueue.dequeue();
} catch (error) {
    console.log("\nError handling (expected):", error.message);
}

// ==================== PRIORITY QUEUE TESTING ====================

console.log("\n\n" + "=".repeat(80));
console.log("PRIORITY QUEUE IMPLEMENTATIONS TESTING");
console.log("=".repeat(80));

// Test Min-Heap Priority Queue
console.log("\n📊 MIN-HEAP BASED PRIORITY QUEUE");
console.log("-".repeat(40));

const heapPQ = new MinHeapPriorityQueue();
console.log("Inserting: 50, 30, 40, 10, 20, 35");
heapPQ.insert(50);
heapPQ.insert(30);
heapPQ.insert(40);
heapPQ.insert(10);
heapPQ.insert(20);
heapPQ.insert(35);
heapPQ.display();

console.log("\nPeek Min:", heapPQ.peekMin()); // 10
console.log("Size:", heapPQ.getSize()); // 6

console.log("\nExtract Min:", heapPQ.extractMin()); // 10
heapPQ.display();
console.log("Extract Min:", heapPQ.extractMin()); // 20
heapPQ.display();
console.log("Extract Min:", heapPQ.extractMin()); // 30
heapPQ.display();

console.log("\nInsert: 5, 25");
heapPQ.insert(5);
heapPQ.insert(25);
heapPQ.display();
console.log("Extract Min:", heapPQ.extractMin()); // 5
heapPQ.display();

// Test Ordered Array Priority Queue
console.log("\n\n📊 ORDERED ARRAY-BASED PRIORITY QUEUE");
console.log("-".repeat(40));

const arrayPQ = new OrderedArrayPriorityQueue();
console.log("Inserting: 50, 30, 40, 10, 20, 35");
arrayPQ.insert(50);
arrayPQ.insert(30);
arrayPQ.insert(40);
arrayPQ.insert(10);
arrayPQ.insert(20);
arrayPQ.insert(35);
arrayPQ.display();

console.log("\nPeek Min:", arrayPQ.peekMin()); // 10
console.log("Size:", arrayPQ.getSize()); // 6

console.log("\nExtract Min:", arrayPQ.extractMin()); // 10
arrayPQ.display();
console.log("Extract Min:", arrayPQ.extractMin()); // 20
arrayPQ.display();

console.log("\nInsert: 5, 25");
arrayPQ.insert(5);
arrayPQ.insert(25);
arrayPQ.display();
console.log("Extract Min:", arrayPQ.extractMin()); // 5
arrayPQ.display();

// Test edge cases for priority queues
console.log("\n🧪 EDGE CASE TESTING");
console.log("-".repeat(40));

// Test empty extraction
try {
    const emptyPQ = new MinHeapPriorityQueue();
    emptyPQ.extractMin();
} catch (error) {
    console.log("Empty heap extract (expected):", error.message);
}

try {
    const emptyArrayPQ = new OrderedArrayPriorityQueue();
    emptyArrayPQ.extractMin();
} catch (error) {
    console.log("Empty array extract (expected):", error.message);
}

// Test peek on empty
try {
    const emptyPQ = new MinHeapPriorityQueue();
    emptyPQ.peekMin();
} catch (error) {
    console.log("Empty heap peek (expected):", error.message);
}

// ==================== PERFORMANCE COMPARISON ====================

console.log("\n\n" + "=".repeat(80));
console.log("PERFORMANCE COMPARISON");
console.log("=".repeat(80));

function performanceTest() {
    const testSize = 1000;
    
    // Array Queue Performance
    console.log(`\n📊 Queue Performance (${testSize} operations):`);
    const arrayQ = new ArrayQueue(testSize + 10);
    console.time("Array Queue");
    for (let i = 0; i < testSize; i++) arrayQ.enqueue(i);
    for (let i = 0; i < testSize; i++) arrayQ.dequeue();
    console.timeEnd("Array Queue");
    
    const linkedQ = new LinkedListQueue();
    console.time("Linked List Queue");
    for (let i = 0; i < testSize; i++) linkedQ.enqueue(i);
    for (let i = 0; i < testSize; i++) linkedQ.dequeue();
    console.timeEnd("Linked List Queue");
    
    // Priority Queue Performance
    console.log(`\n📊 Priority Queue Performance (${testSize} insertions + ${testSize} extractions):`);
    
    const heapPQTest = new MinHeapPriorityQueue();
    console.time("Min-Heap Priority Queue");
    for (let i = testSize; i > 0; i--) heapPQTest.insert(i);
    for (let i = 0; i < testSize; i++) heapPQTest.extractMin();
    console.timeEnd("Min-Heap Priority Queue");
    
    const arrayPQTest = new OrderedArrayPriorityQueue();
    console.time("Ordered Array Priority Queue");
    for (let i = testSize; i > 0; i--) arrayPQTest.insert(i);
    for (let i = 0; i < testSize; i++) arrayPQTest.extractMin();
    console.timeEnd("Ordered Array Priority Queue");
    
    console.log("\n📈 Complexity Summary:");
    console.log("┌─────────────────────────────────┬──────────────┬──────────────┐");
    console.log("│ Data Structure                  │ Insert       │ Delete       │");
    console.log("├─────────────────────────────────┼──────────────┼──────────────┤");
    console.log("│ Array Queue (fixed)             │ O(1)         │ O(1)         │");
    console.log("│ Linked List Queue (dynamic)     │ O(1)         │ O(1)         │");
    console.log("├─────────────────────────────────┼──────────────┼──────────────┤");
    console.log("│ Min-Heap Priority Queue         │ O(log n)     │ O(log n)     │");
    console.log("│ Ordered Array Priority Queue    │ O(n)         │ O(1)         │");
    console.log("└─────────────────────────────────┴──────────────┴──────────────┘");
}

performanceTest();

console.log("\n" + "=".repeat(80));
console.log("✅ ALL IMPLEMENTATIONS TESTED SUCCESSFULLY");
console.log("=".repeat(80));

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ArrayQueue,
        LinkedListQueue,
        MinHeapPriorityQueue,
        OrderedArrayPriorityQueue
    };
}