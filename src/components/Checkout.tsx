import { useState } from 'react';
import { useMutation } from 'urql';
import { PlaceOrderMutation } from '../operations';
import type { CartLine } from './Cart';

export function Checkout({ cart, onDone }: { cart: CartLine[]; onDone: () => void }) {
  const [{ fetching, data, error }, placeOrder] = useMutation(PlaceOrderMutation);
  const [form, setForm] = useState({ name: '', address: '', phone: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder({
      input: {
        items: cart.map((l) => ({ id: l.id, qty: l.qty })),
        customer: form
      }
    }).then((res) => {
      if (res.data?.placeOrder) onDone();
    });
  };

  if (data?.placeOrder) {
    return (
      <div className="confirmation">
        <h2>✅ Order {data.placeOrder.id}</h2>
        <p>Status: {data.placeOrder.status}</p>
        <p>Total: £{data.placeOrder.total.toFixed(2)}</p>
        <p>ETA: {data.placeOrder.etaMinutes} min</p>
      </div>
    );
  }

  return (
    <form className="checkout" onSubmit={submit}>
      <h2>Delivery details</h2>
      <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input required placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <button type="submit" disabled={fetching}>{fetching ? 'Placing…' : 'Place order'}</button>
      {error && <p className="error">{error.message}</p>}
    </form>
  );
}
