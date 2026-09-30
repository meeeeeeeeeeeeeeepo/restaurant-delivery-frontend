export type CartLine = { id: string; name: string; price: number; qty: number };

export function Cart({ lines, onRemove }: { lines: CartLine[]; onRemove: (id: string) => void }) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const deliveryFee = subtotal >= 25 || subtotal === 0 ? 0 : 2.99;
  return (
    <div className="cart">
      <h2>Your order</h2>
      {lines.length === 0 && <p>Cart is empty — add something tasty!</p>}
      <ul>
        {lines.map((l) => (
          <li key={l.id}>
            {l.qty}× {l.name} — £{(l.price * l.qty).toFixed(2)}
            <button className="link" onClick={() => onRemove(l.id)}>remove</button>
          </li>
        ))}
      </ul>
      {lines.length > 0 && (
        <div className="totals">
          <div>Subtotal: £{subtotal.toFixed(2)}</div>
          <div>Delivery: {deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}</div>
          <div><strong>Total: £{(subtotal + deliveryFee).toFixed(2)}</strong></div>
        </div>
      )}
    </div>
  );
}
