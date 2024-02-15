import java.util.ArrayList;

public class Catalog {
	private String name;
	private ArrayList<Item> itemList;
	public Catalog(String name) {
		this.name = name;
		itemList = new ArrayList<Item>();
	}
	
	public void add(Item item) {
		itemList.add(item);
	}
	
	public int size() {
		return itemList.size();
	}
	
	public Item get(int index) {
		return itemList.get(index);
	}
	
	public String getName() {
		return name;
	}

}
