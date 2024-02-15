
public class ItemOrder {
	private Item item;
	private double price;
	
	public ItemOrder(Item item, int quantity) {
		this.item = item;
		price = item.priceFor(quantity);
	}
	
	public double getPrice() {
		return price;
	}
	
	public Item getItem() {
		return item;
	}
}
