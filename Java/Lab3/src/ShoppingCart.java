import java.util.ArrayList;

public class ShoppingCart {
	private ArrayList<ItemOrder> itemOrders;

	public ShoppingCart() {
		itemOrders = new ArrayList<ItemOrder>();
	}
	
	public void add(ItemOrder order) {
		for (int i = 0; i < itemOrders.size(); i++) {
			if (itemOrders.get(i).getItem().equals(order.getItem())) {
				itemOrders.set(i, order);
				return;
			}
		}
		itemOrders.add(order);
	}
	
	public boolean setDiscount(boolean discount) {
		return discount;
	}
	
	public double getTotal() {
		double total = 0;
		for(ItemOrder order : itemOrders) {
			total += order.getPrice();
		}
		return total;
	}
}
