public class IntChain {
    int num;
    IntChain next = null;

    public IntChain(int num) {
        this.num = num;
    }

    public static IntChain of(int... values) {
        IntChain head = null;
        IntChain tail = null;
        for (int i = 0; i < values.length; i++) {
            IntChain n = new IntChain(values[i]);
            if (head == null) {
                head = n;
                tail = n;
            } else {
                tail.next = n;
                tail = n;
            }
        }
        return head;
    }

    public static boolean contains(IntChain head, int a) {
        IntChain temp = head;
        while (temp != null) {
            if (temp.num == a) {
                return true;
            }
            temp = temp.next;
        }
        return false;
    }

    public static IntChain swapValues(IntChain head, int a, int b) {
        IntChain nodeA = null;
        IntChain nodeB = null;
        IntChain t = head;
        while (t != null) {
            if (t.num == a) {
                nodeA = t;
            }
            if (t.num == b) {
                nodeB = t;
            }
            t = t.next;
        }
        if (nodeA != null && nodeB != null) {
            int tmp = nodeA.num;
            nodeA.num = nodeB.num;
            nodeB.num = tmp;
        }
        return head;
    }

    public static IntChain insertSorted(IntChain head, int a) {
        IntChain node = new IntChain(a);
        if (head == null || a < head.num) {
            node.next = head;
            return node;
        }
        IntChain t = head;
        while (t.next != null && t.next.num < a) {
            t = t.next;
        }
        node.next = t.next;
        t.next = node;
        return head;
    }

    public static String asString(IntChain head) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        IntChain t = head;
        boolean first = true;
        while (t != null) {
            if (!first) {
                sb.append(", ");
            }
            sb.append(t.num);
            first = false;
            t = t.next;
        }
        sb.append("}");
        return sb.toString();
    }

    public static void main(String[] args) {
        IntChain head = of(4, 1, 7, 5, 9, 2);
        System.out.println("chain " + asString(head));
        System.out.println("contains 3? " + contains(head, 3));
        System.out.println("contains 7? " + contains(head, 7));
        swapValues(head, 7, 2);
        System.out.println("after swap 7 and 2: " + asString(head));
        head = insertSorted(of(4, 2, 5, 1, 8, 9), 7);
        System.out.println("insert 7 into unsorted then as walk (sorted insert from head): " + asString(head));
    }
}
