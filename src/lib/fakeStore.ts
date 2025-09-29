export async function getProducts() {
  const res = await fetch("https://fakestoreapi.com/products", { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  const products = await res.json();

  // Ensure there are at least 20 products by cloning/mirroring existing ones.
  if (Array.isArray(products) && products.length < 20) {
    const originals = products.slice();
    let nextId = originals.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1;
    let idx = 0;
    while (products.length < 20) {
      const base = originals[idx % originals.length];
      const clone = {
        ...base,
        id: nextId,
        title: `${base.title} — Special Edition ${nextId}`,
        price: Math.round((Number(base.price) * (1 + ((idx % 5) * 0.06))) * 100) / 100,
      };
      products.push(clone);
      nextId++;
      idx++;
    }
  }

  return products;
}

export async function getProduct(id: string) {
  // try the API first
  const res = await fetch(`https://fakestoreapi.com/products/${encodeURIComponent(id)}`, { next: { revalidate: 60 } });
  if (res.ok) return res.json();

  // fallback: try to find in augmented product list
  try {
    const products = await getProducts();
    const numericId = Number(id);
    const found = products.find((p: any) => String(p.id) === String(id) || (numericId && Number(p.id) === numericId));
    if (found) return found;
  } catch {}

  throw new Error(`Failed to fetch product ${id}`);
}
