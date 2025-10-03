export async function getProducts() {
  const res = await fetch("https://fakestoreapi.com/products", { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  const products = await res.json();

  // Ensure there are at least 40 unique products by generating deterministic variations.
  if (Array.isArray(products) && products.length < 40) {
    const originals = products.slice();
    const existingTitles = new Set(originals.map((p: any) => String(p.title)));
    const baseCategories = Array.from(new Set(originals.map((p: any) => p.category)));

    const adjectives = [
      'Neo', 'Eco', 'Pro', 'Smart', 'Limited', 'Classic', 'Urban', 'Vintage', 'Sport', 'Deluxe', 'Prime', 'Essential', 'Signature', 'Bold', 'Fresh'
    ];
    const colors = ['Coral', 'Azure', 'Olive', 'Sable', 'Ivory', 'Crimson', 'Amber', 'Teal', 'Indigo'];

    let nextId = originals.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1;
    let idx = 0;

    while (products.length < 40) {
      const base = originals[idx % originals.length];
      const adj = adjectives[idx % adjectives.length];
      const color = colors[idx % colors.length];
      const category = baseCategories[(idx + 1) % baseCategories.length] || base.category;

      const shortName = String(base.title).split(' - ').pop() || String(base.title);
      let newTitle = `${adj} ${color} ${shortName}`;
      // ensure uniqueness
      while (existingTitles.has(newTitle)) {
        idx++;
        const adj2 = adjectives[idx % adjectives.length];
        const color2 = colors[idx % colors.length];
        newTitle = `${adj2} ${color2} ${shortName} ${nextId}`;
      }

      existingTitles.add(newTitle);

      const priceMultiplier = 1 + ((idx % 7) * 0.045);
      const newPrice = Math.round(Number(base.price) * priceMultiplier * 100) / 100;

      const generated = {
        id: nextId,
        title: newTitle,
        price: newPrice,
        description: base.description || `${newTitle} — high quality product.`,
        category,
        image: `https://picsum.photos/seed/${nextId}/400/400`,
        rating: base.rating || { rate: 4.5, count: 10 },
      };

      products.push(generated);
      nextId++;
      idx++;
    }
  }

  return products;
}

export async function getProduct(id: string) {
  // try the API first
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${encodeURIComponent(id)}`, { next: { revalidate: 60 } });
    if (res.ok) {
      try {
        const json = await res.json();
        // basic validation
        if (json && (json.id || json.title)) return json;
      } catch (e) {
        // parsing failed, fall through to fallback
      }
    }
  } catch (e) {
    // network error, fall through to fallback
  }

  // fallback: try to find in augmented product list
  try {
    const products = await getProducts();
    const numericId = Number(id);
    const found = products.find((p: any) => String(p.id) === String(id) || (numericId && Number(p.id) === numericId));
    if (found) return found;
  } catch {}

  throw new Error(`Failed to fetch product ${id}`);
}
