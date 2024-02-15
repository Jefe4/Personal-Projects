import java.util.ArrayList;

public class ShoppingCart {
	private ArrayList<Item> itemOrders;

	public ShoppingCart() {
		itemOrders = new ArrayList<Item>();
	}
	
	public void add(Item order) {
//		wdym remove the previous order?
		if(itemOrders.contains(order)) {
			itemOrders.remove(order); 
		}
		itemOrders.add(order);
	}
	
	public boolean setDiscount(boolean discount) {
		return discount;
	}
	
	public double getTotal() {
		int total = 0;
		for(Item item : itemOrders) {
//			total += item.price; add each item's price to the total variable
		}
		return total;
	}
}
