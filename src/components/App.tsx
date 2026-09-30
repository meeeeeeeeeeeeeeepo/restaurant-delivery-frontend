import { useState } from 'react';
import { useQuery } from 'urql';
import { MenuQuery } from '../operations';
import { Cart, type CartLine } from './Cart';
import { Checkout } from './Checkout';

export function App() {
  const [{ data, fetching, error }] = useQuery({ query: MenuQuery });
  const [cart, setCart] = useState<CartLine[]>([]);

  const add = (id: string, name: string, price: number) => {
    setCart((c) => {
      const existing = c.find((l) => l.id === id);
      if (existing) return c.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      return [...c, { id, name, price, qty: 1 }];
    });
  };
  const remove = (id: string) => setCart((c) => c.filter((l) => l.id !== id));

  const categories = [...new Set((data?.menu.items ?? []).map((i) => i.category))];

  return (
    <div className="app">
      <header>
        <h1>🍝 Bella Forchetta</h1>
        <p>Authentic Italian — delivered to your door</p>
      </header>

      <main>
        <section className="menu">
          {fetching && <p>Loading menu…</p>}
          {error && <p className="error">Could not reach the kitchen: {error.message}</p>}
          {categories.map((cat) => (
            <div key={cat} className="category">
              <h2>{cat}</h2>
              <ul>
                {data!.menu.items.filter((i) => i.category === cat).map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.name}</strong> {item.veg && <span className="veg">🌱</span>}
                      <p>{item.description}</p>
                    </div>
                    <div className="price-add">
                      <span>£{item.price.toFixed(2)}</span>
                      <button onClick={() => add(item.id, item.name, item.price)}>Add</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <aside>
          <Cart lines={cart} onRemove={remove} />
          {cart.length > 0 && <Checkout cart={cart} onDone={() => setCart([])} />}
        </aside>
      </main>
    </div>
  );
}
