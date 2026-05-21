from typing import Optional


class Node:
    def __init__(self, key : Optional[str]=None, value : Optional[str] = None):
        self.key = key
        self.value = value
        self.next : Optional['Node']=None
        self.prev : Optional['Node']=None


class LruCache:
    def __init__(self, size : int):
        if(size==0):
            raise ValueError("Cache size must be greater than 0")
        self.size = size
        self.tail = Node()
        self.head = Node()
        self.head.next = self.tail
        self.tail.prev = self.head
        self.hash_map : dict[str, Node] = {}
    
    def addToFront(self, newNode : Node):
        temp = self.head.next
        newNode.next = temp
        newNode.prev = self.head
        self.head.next = newNode
        temp.prev = newNode

    def removeNode(self, delNode : Node):
        prevNode = delNode.prev
        nextNode = delNode.next
        prevNode.next = nextNode
        nextNode.prev = prevNode
    
    def put(self, key:str, value:str):
        if(key in self.hash_map):
            exisitingNode = self.hash_map.get(key)
            del self.hash_map[key]
            self.removeNode(exisitingNode)
        
        if(len(self.hash_map)==self.size):
            del self.hash_map[self.tail.prev.key]
            self.removeNode(self.tail.prev)

        self.addToFront(Node(key, value))
        self.hash_map[key] = self.head.next
    
    def get(self, key:str):
        if(key in self.hash_map):
            node = self.hash_map[key]
            del self.hash_map[key]
            self.removeNode(node)
            self.addToFront(Node(key, node.value))
            self.hash_map[key] = self.head.next
            return node.value
        return -1


# ── Tests ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    passed = 0
    failed = 0

    def assert_equal(desc, actual, expected):
        global passed, failed
        if actual == expected:
            print(f"  PASS  {desc}")
            passed += 1
        else:
            print(f"  FAIL  {desc}")
            print(f"         expected: {expected}, got: {actual}")
            failed += 1

    # Test 1: Basic put and get
    print("\nTest 1: Basic put and get")
    c1 = LruCache(3)
    c1.put("a", "1")
    c1.put("b", "2")
    c1.put("c", "3")
    assert_equal("get existing key 'a'", c1.get("a"), "1")
    assert_equal("get existing key 'b'", c1.get("b"), "2")
    assert_equal("get missing key 'z'",  c1.get("z"), -1)

    # Test 2: LRU eviction
    print("\nTest 2: LRU eviction")
    c2 = LruCache(2)
    c2.put("a", "1")
    c2.put("b", "2")
    c2.put("c", "3")  # 'a' evicted
    assert_equal("evicted key 'a' returns -1", c2.get("a"), -1)
    assert_equal("'b' still present",          c2.get("b"), "2")
    assert_equal("'c' still present",          c2.get("c"), "3")

    # Test 3: get updates recency
    print("\nTest 3: get updates recency")
    c3 = LruCache(2)
    c3.put("a", "1")
    c3.put("b", "2")
    c3.get("a")        # 'a' promoted, 'b' is now LRU
    c3.put("c", "3")   # 'b' evicted
    assert_equal("'b' evicted (was LRU after get)",  c3.get("b"), -1)
    assert_equal("'a' still present (was accessed)", c3.get("a"), "1")
    assert_equal("'c' still present",                c3.get("c"), "3")

    # Test 4: Overwrite existing key
    print("\nTest 4: Overwrite existing key")
    c4 = LruCache(2)
    c4.put("a", "1")
    c4.put("b", "2")
    c4.put("a", "99")
    assert_equal("updated value for 'a'", c4.get("a"), "99")
    assert_equal("'b' still present",     c4.get("b"), "2")
    assert_equal("size stays at capacity", len(c4.hash_map) <= 2, True)

    # Test 5: Cache of size 1
    print("\nTest 5: Cache of size 1")
    c5 = LruCache(1)
    c5.put("a", "1")
    c5.put("b", "2")
    assert_equal("'a' evicted", c5.get("a"), -1)
    assert_equal("'b' present", c5.get("b"), "2")

    # Test 6: Sequential inserts beyond capacity
    print("\nTest 6: Sequential inserts beyond capacity")
    c6 = LruCache(3)
    for i in range(1, 7):
        c6.put(f"k{i}", f"v{i}")
    assert_equal("k1 evicted", c6.get("k1"), -1)
    assert_equal("k2 evicted", c6.get("k2"), -1)
    assert_equal("k3 evicted", c6.get("k3"), -1)
    assert_equal("k4 present", c6.get("k4"), "v4")
    assert_equal("k5 present", c6.get("k5"), "v5")
    assert_equal("k6 present", c6.get("k6"), "v6")

    # Test 7: size 0 throws
    print("\nTest 7: Cache of size 0 throws")
    try:
        LruCache(0)
        assert_equal("size 0 should have thrown", True, False)
    except ValueError as e:
        assert_equal("size 0 raises ValueError", str(e), "Cache size must be greater than 0")

    print(f"\n{passed + failed} tests: {passed} passed, {failed} failed")
