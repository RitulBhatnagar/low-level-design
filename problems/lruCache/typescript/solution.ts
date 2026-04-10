export {}


class Node{
    key : string | null;
    value : string | null;
    next : Node | null;
    prev : Node | null;

    constructor(key:string | null, value:string | null){
        this.key = key;
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}


class LruCache{
    size : number;
    tail : Node;
    head : Node;
    hashMap : Map<string, Node>  = new Map();

    constructor(_size : number){
        if (_size <= 0) throw new Error("Cache size must be greater than 0");
        this.size = _size;
        this.tail = new Node(null, null);
        this.head = new Node(null, null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    addToFront(newNode : Node){
        const temp = this.head.next;
        newNode.next = temp;
        newNode.prev = this.head;
        this.head.next = newNode;
        temp.prev = newNode;
    }

    removeNode(delNode : Node){
        const prevNode = delNode.prev;
        const nextNode = delNode.next;
        prevNode.next = nextNode;
        nextNode.prev = prevNode;
    }

    put(key:string, value : string){
        if(this.hashMap.has(key)){
            const exisitingNode = this.hashMap.get(key);
            this.hashMap.delete(key);
            this.removeNode(exisitingNode);
        }

        if(this.hashMap.size == this.size){
            this.hashMap.delete(this.tail.prev.key);
            this.removeNode(this.tail.prev);
        }

        this.addToFront(new Node(key, value));
        this.hashMap.set(key, this.head.next);
    }

    get(key:string){
        if(this.hashMap.has(key)){
            const node = this.hashMap.get(key);
            this.hashMap.delete(key);
            this.removeNode(node);
            this.addToFront(new Node(key, node.value));
            this.hashMap.set(key, this.head.next);
            return node.value;
        }

        return -1;
    }
}


// ─── Test Runner ───────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(description: string, actual: any, expected: any) {
    if (actual === expected) {
        console.log(`  PASS  ${description}`);
        passed++;
    } else {
        console.log(`  FAIL  ${description}`);
        console.log(`         expected: ${expected}, got: ${actual}`);
        failed++;
    }
}


// ─── Test 1: Basic put and get ─────────────────────────────────────────────────
console.log("\nTest 1: Basic put and get");
const c1 = new LruCache(3);
c1.put("a", "1");
c1.put("b", "2");
c1.put("c", "3");
assert("get existing key 'a'", c1.get("a"), "1");
assert("get existing key 'b'", c1.get("b"), "2");
assert("get missing key 'z'",  c1.get("z"), -1);


// ─── Test 2: Eviction of LRU item ─────────────────────────────────────────────
console.log("\nTest 2: LRU eviction");
const c2 = new LruCache(2);
c2.put("a", "1");   // cache: [a]
c2.put("b", "2");   // cache: [b, a]
c2.put("c", "3");   // capacity hit — 'a' is LRU, evicted. cache: [c, b]
assert("evicted key 'a' returns -1", c2.get("a"), -1);
assert("'b' still present",          c2.get("b"), "2");
assert("'c' still present",          c2.get("c"), "3");


// ─── Test 3: get promotes to MRU, so different key gets evicted ───────────────
console.log("\nTest 3: get updates recency");
const c3 = new LruCache(2);
c3.put("a", "1");   // cache: [a]
c3.put("b", "2");   // cache: [b, a]
c3.get("a");        // 'a' accessed → cache: [a, b]  ('b' is now LRU)
c3.put("c", "3");   // capacity hit — 'b' is LRU, evicted. cache: [c, a]
assert("'b' evicted (was LRU after get)",  c3.get("b"), -1);
assert("'a' still present (was accessed)", c3.get("a"), "1");
assert("'c' still present",                c3.get("c"), "3");


// ─── Test 4: Overwrite existing key ───────────────────────────────────────────
console.log("\nTest 4: Overwrite existing key");
const c4 = new LruCache(2);
c4.put("a", "1");
c4.put("b", "2");
c4.put("a", "99");  // update 'a' — should not increase size
assert("updated value for 'a'",      c4.get("a"), "99");
assert("'b' still present",          c4.get("b"), "2");
assert("map size stays at capacity", c4.hashMap.size <= 2, true);


// ─── Test 5: Capacity of 1 ────────────────────────────────────────────────────
console.log("\nTest 5: Cache of size 1");
const c5 = new LruCache(1);
c5.put("a", "1");
c5.put("b", "2");   // 'a' evicted immediately
assert("'a' evicted", c5.get("a"), -1);
assert("'b' present", c5.get("b"), "2");


// ─── Test 6: Large sequential inserts ─────────────────────────────────────────
console.log("\nTest 6: Sequential inserts beyond capacity");
const c6 = new LruCache(3);
for (let i = 1; i <= 6; i++) c6.put(`k${i}`, `v${i}`);
// Only k4, k5, k6 should remain
assert("k1 evicted", c6.get("k1"), -1);
assert("k2 evicted", c6.get("k2"), -1);
assert("k3 evicted", c6.get("k3"), -1);
assert("k4 present", c6.get("k4"), "v4");
assert("k5 present", c6.get("k5"), "v5");
assert("k6 present", c6.get("k6"), "v6");


// ─── Test 7: Size 0 should throw ──────────────────────────────────────────────
console.log("\nTest 7: Cache of size 0 throws");
try {
    new LruCache(0);
    assert("size 0 should have thrown", true, false);
} catch (e) {
    assert("size 0 throws error", (e as Error).message, "Cache size must be greater than 0");
}


// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);