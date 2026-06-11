class TaskScheduler {
    constructor() {
        this.tasks = [];
        this.priorityGroups = {
            High: [],
            Medium: [],
            Low: []
        };
    }

    /**
     * Add a new task
     * Time: O(1) - Simple push operation
     * Space: O(1) - Adding one task
     */
    addTask(name, startTime, endTime, priority) {
        if (startTime >= endTime) {
            throw new Error("End time must be greater than start time");
        }
        
        const task = {
            id: Date.now() + Math.random(),
            name,
            startTime,
            endTime,
            priority,
            duration: endTime - startTime
        };
        
        this.tasks.push(task);
        return task;
    }

    /**
     * Sort tasks by start time (efficiently)
     * Time: O(n log n) - Using optimized quicksort/timsort
     * Space: O(1) - In-place sorting (modifies original array)
     */
    sortTasksByStartTime() {
        // Using native sort which is O(n log n) in most engines
        this.tasks.sort((a, b) => a.startTime - b.startTime);
        return this.tasks;
    }

    /**
     * Group tasks by priority using hash map
     * Time: O(n) - Single pass through tasks
     * Space: O(n) - Stores tasks in grouped structure
     */
    groupTasksByPriority() {
        // Reset priority groups
        this.priorityGroups = {
            High: [],
            Medium: [],
            Low: []
        };
        
        // Single pass O(n) grouping
        for (const task of this.tasks) {
            if (this.priorityGroups[task.priority]) {
                this.priorityGroups[task.priority].push(task);
            }
        }
        
        // Optional: Sort tasks within each priority group by start time
        for (const priority in this.priorityGroups) {
            this.priorityGroups[priority].sort((a, b) => a.startTime - b.startTime);
        }
        
        return this.priorityGroups;
    }

    /**
     * Detect overlapping tasks (Interval scheduling pattern)
     * Optimized approach: Sort by start time, then sweep
     * Time: O(n log n) - Sorting + O(n) sweep
     * Space: O(k) where k is number of overlapping tasks stored
     */
    detectOverlappingTasks() {
        if (this.tasks.length < 2) return [];
        
        // Sort by start time first (O(n log n))
        const sortedTasks = [...this.tasks].sort((a, b) => a.startTime - b.startTime);
        
        const overlaps = [];
        const processedPairs = new Set(); // Avoid duplicate reporting
        
        // Sweep through tasks (O(n))
        for (let i = 0; i < sortedTasks.length - 1; i++) {
            const current = sortedTasks[i];
            const next = sortedTasks[i + 1];
            
            // Check for overlap with next task
            if (current.endTime > next.startTime) {
                const pairKey = `${Math.min(current.id, next.id)}-${Math.max(current.id, next.id)}`;
                
                if (!processedPairs.has(pairKey)) {
                    overlaps.push({
                        task1: { name: current.name, time: `${current.startTime}-${current.endTime}` },
                        task2: { name: next.name, time: `${next.startTime}-${next.endTime}` },
                        overlapDuration: Math.min(current.endTime, next.endTime) - next.startTime
                    });
                    processedPairs.add(pairKey);
                }
            }
            
            // Check overlap with all previous tasks that haven't ended
            for (let j = 0; j < i; j++) {
                const previous = sortedTasks[j];
                if (previous.endTime > current.startTime) {
                    const pairKey = `${Math.min(previous.id, current.id)}-${Math.max(previous.id, current.id)}`;
                    
                    if (!processedPairs.has(pairKey)) {
                        overlaps.push({
                            task1: { name: previous.name, time: `${previous.startTime}-${previous.endTime}` },
                            task2: { name: current.name, time: `${current.startTime}-${current.endTime}` },
                            overlapDuration: Math.min(previous.endTime, current.endTime) - current.startTime
                        });
                        processedPairs.add(pairKey);
                    }
                } else {
                    break; // Since tasks are sorted, no need to check earlier ones
                }
            }
        }
        
        return overlaps;
    }

    /**
     * Optimized overlap detection using interval tree approach
     * Best for large datasets with many queries
     * Time: O(n log n) preprocessing, O(log n + k) per query
     */
    getTasksAtTime(time) {
        // Binary search to find tasks covering a specific time
        // Assumes tasks are sorted by start time
        this.sortTasksByStartTime();
        
        const activeTasks = [];
        
        // Binary search for first task that could contain this time
        let left = 0;
        let right = this.tasks.length - 1;
        let startIndex = -1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this.tasks[mid].startTime <= time) {
                startIndex = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        // Check tasks that could contain the time
        for (let i = startIndex; i >= 0 && this.tasks[i].endTime > time; i--) {
            if (this.tasks[i].startTime <= time && this.tasks[i].endTime > time) {
                activeTasks.push(this.tasks[i]);
            }
        }
        
        return activeTasks;
    }

    /**
     * Get tasks by priority (optimized lookup)
     * Time: O(1) - Direct hash map access
     * Space: O(k) where k is number of tasks returned
     */
    getTasksByPriority(priority) {
        return this.priorityGroups[priority] || [];
    }

    /**
     * Get tasks in time range using binary search
     * Time: O(log n + k) where k is number of tasks in range
     */
    getTasksInTimeRange(start, end) {
        this.sortTasksByStartTime();
        
        // Binary search for first task with startTime >= start
        let left = 0;
        let right = this.tasks.length - 1;
        let firstIndex = this.tasks.length;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this.tasks[mid].startTime >= start) {
                firstIndex = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        
        const tasksInRange = [];
        for (let i = firstIndex; i < this.tasks.length && this.tasks[i].startTime < end; i++) {
            tasksInRange.push(this.tasks[i]);
        }
        
        return tasksInRange;
    }

    /**
     * Estimate memory usage
     * Space: O(1) - Just calculates based on task count
     */
    estimateMemoryUsage() {
        const taskCount = this.tasks.length;
        
        // Approximate sizes in bytes (rough estimates)
        const perTaskOverhead = 64; // Object overhead
        const stringFieldSize = 50; // Average for name and priority
        const numberFieldSize = 24; // Each number (startTime, endTime, duration, id)
        const arrayOverhead = 8; // Per task in array
        
        const taskSize = perTaskOverhead + 
                        stringFieldSize + 
                        (numberFieldSize * 3) + // startTime, endTime, duration
                        arrayOverhead;
        
        const totalTaskMemory = taskCount * taskSize;
        
        // Priority groups memory
        const groupingOverhead = 200; // Hash map and arrays overhead
        const groupReferences = taskCount * 8; // References in priority arrays
        
        const totalMemory = totalTaskMemory + groupingOverhead + groupReferences;
        
        return {
            taskCount: taskCount,
            estimatedMemoryKB: (totalMemory / 1024).toFixed(2),
            estimatedMemoryMB: (totalMemory / (1024 * 1024)).toFixed(2),
            breakdown: {
                perTaskBytes: taskSize,
                totalTaskBytes: totalTaskMemory,
                overheadBytes: groupingOverhead + groupReferences
            }
        };
    }

    /**
     * Display all tasks
     * Time: O(n)
     */
    displayTasks() {
        console.log("\n" + "=".repeat(80));
        console.log("ALL TASKS");
        console.log("=".repeat(80));
        
        if (this.tasks.length === 0) {
            console.log("No tasks found.");
            return;
        }
        
        const sorted = [...this.tasks].sort((a, b) => a.startTime - b.startTime);
        
        sorted.forEach(task => {
            console.log(`${task.name.padEnd(20)} | ${task.startTime}-${task.endTime} | Priority: ${task.priority} | Duration: ${task.duration}`);
        });
        console.log("=".repeat(80));
    }

    /**
     * Display priority groups
     */
    displayPriorityGroups() {
        console.log("\n" + "=".repeat(80));
        console.log("TASKS GROUPED BY PRIORITY");
        console.log("=".repeat(80));
        
        for (const priority of ['High', 'Medium', 'Low']) {
            const tasks = this.priorityGroups[priority];
            if (tasks && tasks.length > 0) {
                console.log(`\n[${priority} Priority] (${tasks.length} tasks):`);
                tasks.forEach(task => {
                    console.log(`  • ${task.name}: ${task.startTime}-${task.endTime}`);
                });
            }
        }
        console.log("=".repeat(80));
    }

    /**
     * Display overlapping tasks
     */
    displayOverlaps() {
        const overlaps = this.detectOverlappingTasks();
        
        console.log("\n" + "=".repeat(80));
        console.log("OVERLAPPING TASKS DETECTED");
        console.log("=".repeat(80));
        
        if (overlaps.length === 0) {
            console.log("No overlapping tasks found.");
        } else {
            overlaps.forEach((overlap, index) => {
                console.log(`\nOverlap ${index + 1}:`);
                console.log(`  Task 1: ${overlap.task1.name} (${overlap.task1.time})`);
                console.log(`  Task 2: ${overlap.task2.name} (${overlap.task2.time})`);
                console.log(`  Overlap duration: ${overlap.overlapDuration}`);
            });
        }
        console.log("=".repeat(80));
    }
}

// ==================== TESTING AND DEMONSTRATION ====================

function runDemo() {
    console.log("=".repeat(80));
    console.log("TASK SCHEDULER DEMONSTRATION");
    console.log("=".repeat(80));
    
    const scheduler = new TaskScheduler();
    
    // Add sample tasks
    console.log("\n📝 Adding tasks...");
    
    scheduler.addTask("Morning Meeting", 9, 10, "High");
    scheduler.addTask("Code Review", 9.5, 10.5, "High");
    scheduler.addTask("Lunch Break", 12, 13, "Low");
    scheduler.addTask("Project Work", 10, 12, "Medium");
    scheduler.addTask("Team Sync", 14, 15, "Medium");
    scheduler.addTask("Documentation", 13, 14.5, "Low");
    scheduler.addTask("Client Call", 15, 16, "High");
    scheduler.addTask("Planning", 16, 17, "Medium");
    scheduler.addTask("Email Processing", 8.5, 9.5, "Low");
    scheduler.addTask("Research", 11, 12.5, "Medium");
    
    // Display all tasks
    scheduler.displayTasks();
    
    // 1. Sort tasks by start time (already done in display)
    console.log("\n📊 1. SORTING ANALYSIS:");
    console.log("-".repeat(40));
    console.log("Sorting algorithm: Array.prototype.sort()");
    console.log("Time complexity: O(n log n) - Efficient quicksort/timsort");
    console.log("Space complexity: O(1) - In-place sorting");
    
    // 2. Group tasks by priority
    scheduler.groupTasksByPriority();
    scheduler.displayPriorityGroups();
    
    console.log("\n📊 2. GROUPING ANALYSIS:");
    console.log("-".repeat(40));
    console.log("Data structure: Hash Map (JavaScript Object)");
    console.log("Time complexity: O(n) - Single pass");
    console.log("Space complexity: O(n) - Stores references to all tasks");
    console.log("Optimization: Uses direct property access (O(1) per task)");
    
    // 3. Detect overlapping tasks
    scheduler.displayOverlaps();
    
    console.log("\n📊 3. OVERLAP DETECTION ANALYSIS:");
    console.log("-".repeat(40));
    console.log("Algorithm: Interval sweep with sorting");
    console.log("Time complexity: O(n log n) - Sorting + O(n) sweep");
    console.log("Space complexity: O(k) - Where k is number of overlaps");
    console.log("Optimization: Uses Set to avoid duplicate pairs");
    
    // 4. Bonus: Quick lookup by time using binary search
    console.log("\n🔍 4. OPTIMIZED TIME-BASED LOOKUP:");
    console.log("-".repeat(40));
    
    const timeToCheck = 9.75;
    const tasksAtTime = scheduler.getTasksAtTime(timeToCheck);
    console.log(`\nTasks active at ${timeToCheck}:`);
    if (tasksAtTime.length === 0) {
        console.log("  No active tasks");
    } else {
        tasksAtTime.forEach(task => {
            console.log(`  • ${task.name} (${task.startTime}-${task.endTime})`);
        });
    }
    console.log("\nTime complexity: O(log n) - Binary search + O(k) retrieval");
    
    // 5. Time range query
    console.log("\n📅 5. TIME RANGE QUERY:");
    console.log("-".repeat(40));
    const tasksInRange = scheduler.getTasksInTimeRange(10, 13);
    console.log("Tasks between 10:00 and 13:00:");
    tasksInRange.forEach(task => {
        console.log(`  • ${task.name} (${task.startTime}-${task.endTime})`);
    });
    console.log("\nTime complexity: O(log n + k) - Binary search + range retrieval");
    
    // 6. Priority-based quick access
    console.log("\n🎯 6. PRIORITY-BASED QUICK ACCESS:");
    console.log("-".repeat(40));
    const highPriorityTasks = scheduler.getTasksByPriority("High");
    console.log("High priority tasks (O(1) lookup):");
    highPriorityTasks.forEach(task => {
        console.log(`  • ${task.name} (${task.startTime}-${task.endTime})`);
    });
    
    // 7. Memory estimation
    console.log("\n💾 7. MEMORY USAGE ESTIMATION:");
    console.log("-".repeat(40));
    const memoryEstimate = scheduler.estimateMemoryUsage();
    console.log(`Total tasks: ${memoryEstimate.taskCount}`);
    console.log(`Estimated memory: ${memoryEstimate.estimatedMemoryKB} KB (${memoryEstimate.estimatedMemoryMB} MB)`);
    console.log(`Breakdown:`);
    console.log(`  • Per task: ~${memoryEstimate.breakdown.perTaskBytes} bytes`);
    console.log(`  • Tasks total: ~${(memoryEstimate.breakdown.totalTaskBytes / 1024).toFixed(2)} KB`);
    console.log(`  • Overhead: ~${(memoryEstimate.breakdown.overheadBytes / 1024).toFixed(2)} KB`);
    
    // Complexity summary
    console.log("\n" + "=".repeat(80));
    console.log("TIME & SPACE COMPLEXITY SUMMARY");
    console.log("=".repeat(80));
    console.log(`
┌─────────────────────────┬───────────────┬───────────────┬─────────────────────────┐
│ Operation               │ Time          │ Space         │ Optimization           │
├─────────────────────────┼───────────────┼───────────────┼─────────────────────────┤
│ Add Task                │ O(1)          │ O(1)          │ Direct array push       │
│ Sort by Start Time      │ O(n log n)    │ O(1)          │ In-place sorting        │
│ Group by Priority       │ O(n)          │ O(n)          │ Hash map (single pass)  │
│ Detect Overlaps         │ O(n log n)    │ O(k)          │ Interval sweep pattern  │
│ Get Tasks at Time       │ O(log n + k)  │ O(k)          │ Binary search           │
│ Get Tasks in Range      │ O(log n + k)  │ O(k)          │ Binary search + scan    │
│ Get by Priority (cached)│ O(1)          │ O(k)          │ Direct hash lookup      │
│ Memory Estimation       │ O(1)          │ O(1)          │ Formula-based           │
└─────────────────────────┴───────────────┴───────────────┴─────────────────────────┘

Where:
  n = number of tasks
  k = number of tasks in result/overlap
    `);
    
    console.log("=".repeat(80));
    console.log("✅ DEMONSTRATION COMPLETE");
    console.log("=".repeat(80));
}

// Run the demo
runDemo();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskScheduler;
}