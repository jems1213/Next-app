export async function getProducts() {
  const res = await fetch("https://fakestoreapi.com/products", { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  return res.json();
}

export async function getProduct(id: string) {
  const res = await fetch(`https://fakestoreapi.com/products/${encodeURIComponent(id)}`, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id}: ${res.status}`);
  }
  return res.json();
}
