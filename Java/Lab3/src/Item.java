import java.text.NumberFormat;

public class Item {
	private String name;
	private double price;
	private double bulkPrice;
	private int bulkQuantity;

	public Item(String name, double price) {
		if(price < 0) {
			throw new IllegalArgumentException("Price can't be negative!");
		}
		this.name = name;
		this.price = price;
	}
	
	public Item(String name, double price, double bulkPrice, int bulkQuantity) {
		if(price < 0 || bulkPrice < 0 || bulkQuantity < 0) {
			throw new IllegalArgumentException("Price can't be negative!");
		}
		this.name = name;
		this.price = price;
		this.bulkPrice = bulkPrice;
		this.bulkQuantity = bulkQuantity;
	}
	
	public double priceFor(int quantity) {
		if(quantity < 0 ) {
			throw new IllegalArgumentException("Quantity can't be negative!");
		}
		if (bulkQuantity > 0 && quantity >= bulkQuantity) {
			return (quantity / bulkQuantity) * bulkPrice + (quantity % bulkQuantity) * price;
		} else {
			return quantity * price;
		}
	}

	@Override
	public String toString() {
		NumberFormat nf = NumberFormat.getCurrencyInstance();
		String itemString = name + ", " + nf.format(price);
		
		if(bulkPrice != 0) {
			itemString += " (" + bulkQuantity + " for " + nf.format(bulkPrice) + ")";
		}
		
		return itemString;
	}
	
	
}
