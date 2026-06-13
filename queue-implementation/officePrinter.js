/**
 * Queue Implementation using Array
 * Supports FIFO (First-In-First-Out) operations
 */
class Queue {
    constructor() {
        this.items = [];
        this.front = 0;
        this.rear = 0;
    }
    
    /**
     * Add an element to the rear of the queue
     * Time Complexity: O(1)
     */
    enqueue(element) {
        this.items[this.rear] = element;
        this.rear++;
        return true;
    }
    
    /**
     * Remove and return the front element of the queue
     * Time Complexity: O(1)
     */
    dequeue() {
        if (this.isEmpty()) return null;
        
        const element = this.items[this.front];
        delete this.items[this.front];
        this.front++;
        
        // Reset pointers if queue becomes empty
        if (this.front === this.rear) {
            this.front = 0;
            this.rear = 0;
            this.items = [];
        }
        
        return element;
    }
    
    /**
     * Return the front element without removing it
     * Time Complexity: O(1)
     */
    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.front];
    }
    
    /**
     * Check if the queue is empty
     * Time Complexity: O(1)
     */
    isEmpty() {
        return this.front === this.rear;
    }
    
    /**
     * Get the size of the queue
     * Time Complexity: O(1)
     */
    size() {
        return this.rear - this.front;
    }
    
    /**
     * Clear all elements from the queue
     */
    clear() {
        this.items = [];
        this.front = 0;
        this.rear = 0;
    }
    
    /**
     * Get all elements in the queue (for display)
     */
    getAll() {
        return this.items.slice(this.front, this.rear);
    }
    
    /**
     * Display the queue contents
     */
    display() {
        if (this.isEmpty()) {
            console.log("Queue is empty");
            return;
        }
        
        const elements = this.getAll();
        console.log(`Queue (front → rear):`);
        elements.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.name} (${item.pages} pages)`);
        });
        console.log(`Total jobs: ${this.size()}`);
    }
}

/**
 * Print Job Class
 * Represents a single print job
 */
class PrintJob {
    constructor(name, pages) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 6);
        this.name = name;
        this.pages = pages;
        this.timestamp = new Date();
        this.status = 'pending';
    }
    
    getInfo() {
        return `Job: ${this.name} | Pages: ${this.pages} | Status: ${this.status} | Time: ${this.timestamp.toLocaleTimeString()}`;
    }
}

/**
 * Printer Queue System
 * Manages print jobs using a Queue
 */
class PrinterQueue {
    constructor(printerName = "Office Printer") {
        this.printerName = printerName;
        this.queue = new Queue();
        this.totalJobsProcessed = 0;
        this.totalPagesPrinted = 0;
        this.isPrinting = false;
    }
    
    /**
     * Add a new print job to the queue
     * @param {string} jobName - Name/description of the job
     * @param {number} pages - Number of pages to print
     */
    addJob(jobName, pages) {
        // Validate input
        if (!jobName || typeof jobName !== 'string') {
            console.error("❌ Invalid job name");
            return false;
        }
        
        if (!pages || pages <= 0 || typeof pages !== 'number') {
            console.error("❌ Invalid page count (must be positive number)");
            return false;
        }
        
        const job = new PrintJob(jobName, pages);
        this.queue.enqueue(job);
        
        console.log(`📄 [ADDED] ${job.getInfo()}`);
        console.log(`   Queue size: ${this.queue.size()} jobs waiting\n`);
        
        return true;
    }
    
    /**
     * Process the next job in the queue
     * @returns {Object} Processed job information
     */
    processNextJob() {
        if (this.queue.isEmpty()) {
            console.log("✅ No jobs in queue. Printer is idle.\n");
            return null;
        }
        
        this.isPrinting = true;
        const job = this.queue.dequeue();
        
        if (!job) return null;
        
        // Simulate printing time (1 second per 10 pages)
        const estimatedTime = (job.pages / 10) * 1000;
        
        console.log(`🖨️  [PROCESSING] ${job.name} (${job.pages} pages)`);
        console.log(`   Estimated time: ${(estimatedTime / 1000).toFixed(1)} seconds`);
        
        // Simulate printing delay
        const startTime = Date.now();
        
        // For demo purposes, we'll use setTimeout to simulate printing
        // In a real system, this would be synchronous or use callbacks
        const result = {
            job: job,
            startTime: new Date(),
            pagesPrinted: job.pages,
            success: true
        };
        
        // Update statistics
        this.totalJobsProcessed++;
        this.totalPagesPrinted += job.pages;
        job.status = 'completed';
        
        console.log(` [COMPLETED] ${job.name} - ${job.pages} pages printed`);
        console.log(`   Time taken: ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
        console.log(`   Remaining jobs: ${this.queue.size()}\n`);
        
        this.isPrinting = false;
        
        return result;
    }
    
    /**
     * Process all jobs in the queue
     * @param {boolean} simulateDelay - Whether to simulate printing delay
     */
    async processAllJobs(simulateDelay = false) {
        if (this.queue.isEmpty()) {
            console.log(" No jobs to process. Queue is empty.\n");
            return;
        }
        
        console.log(`\n Starting to process ${this.queue.size()} jobs...\n`);
        console.log("=".repeat(50));
        
        let processedCount = 0;
        
        while (!this.queue.isEmpty()) {
            const result = this.processNextJob();
            if (result && simulateDelay) {
                // Wait for simulated printing time
                await this.sleep(result.job.pages * 50); // 50ms per page
            }
            processedCount++;
        }
        
        console.log("=".repeat(50));
        console.log(` All jobs processed! (${processedCount} jobs completed)\n`);
        
        this.showStatistics();
    }
    
    /**
     * Helper function for sleep/delay
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Peek at the next job without removing it
     */
    peekNextJob() {
        const nextJob = this.queue.peek();
        
        if (nextJob) {
            console.log(`👀 Next job in queue: ${nextJob.name} (${nextJob.pages} pages)`);
            return nextJob;
        } else {
            console.log("No jobs waiting");
            return null;
        }
    }
    
    /**
     * Show current queue status
     */
    showQueueStatus() {
        console.log("\n" + "=".repeat(50));
        console.log(`📋 ${this.printerName} - Queue Status`);
        console.log("=".repeat(50));
        
        if (this.queue.isEmpty()) {
            console.log("Queue is empty - Printer is idle");
        } else {
            console.log(`Jobs waiting: ${this.queue.size()}`);
            console.log(`Current queue order (FIFO):`);
            this.queue.display();
        }
        
        console.log(`\n Statistics:`);
        console.log(`   Total jobs processed: ${this.totalJobsProcessed}`);
        console.log(`   Total pages printed: ${this.totalPagesPrinted}`);
        console.log(`   Printer status: ${this.isPrinting ? 'Printing' : 'Idle'}`);
        console.log("=".repeat(50) + "\n");
    }
    
    /**
     * Show detailed statistics
     */
    showStatistics() {
        console.log("\n PRINTER STATISTICS");
        console.log("=".repeat(40));
        console.log(`Printer: ${this.printerName}`);
        console.log(`Total jobs processed: ${this.totalJobsProcessed}`);
        console.log(`Total pages printed: ${this.totalPagesPrinted}`);
        console.log(`Average job size: ${this.totalJobsProcessed > 0 ? (this.totalPagesPrinted / this.totalJobsProcessed).toFixed(1) : 0} pages`);
        console.log("=".repeat(40) + "\n");
    }
    
    /**
     * Cancel all pending jobs
     */
    cancelAllJobs() {
        const cancelledCount = this.queue.size();
        this.queue.clear();
        console.log(` Cancelled ${cancelledCount} pending jobs\n`);
    }
}

// ==================== TESTING THE SOLUTION ====================

console.log("=".repeat(60));
console.log("🖨️  OFFICE PRINTER QUEUE SIMULATION");
console.log("=".repeat(60));

// Create printer queue system
const printer = new PrinterQueue("Main Office Printer");

console.log("\n📝 Adding print jobs...\n");

// Add multiple print jobs
printer.addJob("Quarterly Report", 25);
printer.addJob("Marketing Brochure", 15);
printer.addJob("Invoice #1234", 3);
printer.addJob("Employee Handbook", 50);
printer.addJob("Meeting Agenda", 5);
printer.addJob("Annual Summary", 30);

// Show queue status
printer.showQueueStatus();

// Peek at next job without processing
console.log("🔍 Peeking at next job:");
printer.peekNextJob();

// Process jobs one by one
console.log("\n" + "=".repeat(60));
console.log(" PROCESSING JOBS ONE BY ONE");
console.log("=".repeat(60) + "\n");

printer.processNextJob(); // Quarterly Report
printer.processNextJob(); // Marketing Brochure
printer.processNextJob(); // Invoice #1234

// Show updated queue status
printer.showQueueStatus();

// Process remaining jobs
console.log(" PROCESSING REMAINING JOBS");
console.log("=".repeat(60) + "\n");

printer.processNextJob(); // Employee Handbook
printer.processNextJob(); // Meeting Agenda
printer.processNextJob(); // Annual Summary

// Final status
printer.showQueueStatus();
printer.showStatistics();

// ==================== ADDITIONAL TEST SCENARIOS ====================

console.log("\n" + "=".repeat(60));
console.log(" ADDITIONAL TEST SCENARIOS");
console.log("=".repeat(60));

// Test scenario: Adding jobs after processing
console.log("\nAdding more jobs after processing...");
printer.addJob("Urgent Client Email", 2);
printer.addJob("Project Proposal", 20);
printer.showQueueStatus();

// Process the new jobs
console.log("\n Processing new jobs...");
printer.processNextJob(); // Urgent Client Email
printer.processNextJob(); // Project Proposal

// Test: Try to peek when queue is empty
console.log("\n🔍 Testing empty queue behavior:");
printer.peekNextJob();

// Test: Cancel all jobs (if any left)
printer.cancelAllJobs();
printer.showQueueStatus();

// ==================== DEMO WITH ASYNC PROCESSING ====================

console.log("\n" + "=".repeat(60));
console.log("⚡ DEMO: ASYNCHRONOUS BATCH PROCESSING");
console.log("=".repeat(60));

async function demoAsyncProcessing() {
    const demoPrinter = new PrinterQueue("Demo Printer");
    
    console.log("\nAdding batch jobs...");
    demoPrinter.addJob("Document A", 10);
    demoPrinter.addJob("Document B", 20);
    demoPrinter.addJob("Document C", 15);
    
    console.log("\n Starting batch processing with simulated delays...\n");
    await demoPrinter.processAllJobs(true);
}

// Uncomment to run async demo (will introduce delays)
// demoAsyncProcessing();

// ==================== VISUAL REPRESENTATION ====================

console.log("\n" + "=".repeat(60));
console.log(" QUEUE OPERATIONS SUMMARY");
console.log("=".repeat(60));

console.log(`
┌─────────────────────────────────────────────────────────────┐
│                    QUEUE OPERATIONS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  enqueue(job)  → Add job to REAR of queue                   │
│  dequeue()     → Remove job from FRONT of queue             │
│  peek()        → View FRONT job without removal             │
│  isEmpty()     → Check if queue has any jobs                │
│  size()        → Get number of pending jobs                 │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    PRINTER QUEUE SIMULATION                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FIFO Order: First job added = First job printed           │
│                                                              │
│  Queue visualization:                                       │
│                                                              │
│    Front                                    Rear           │
│      ↓                                        ↓             │
│    ┌──────┬──────┬──────┬──────┬──────┐                    │
│    │ Job1 │ Job2 │ Job3 │ Job4 │ Job5 │                    │
│    └──────┴──────┴──────┴──────┴──────┘                    │
│                                                              │
│    Print jobs process from left to right                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
`);

console.log("✅ Printer Queue Simulation Complete!");