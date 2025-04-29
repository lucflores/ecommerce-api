import fs from 'fs/promises';

export class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];  
    this._load();     
  }

  async _load() {
    try {
      const d = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(d);
    } catch {
      this.carts = [];
      await this._save();
    }
  }

  async _save() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async createCart() {
    const newId = this.carts.length
      ? this.carts[this.carts.length - 1].id + 1
      : 1;
    const cart = { id: newId, products: [] };
    this.carts.push(cart);
    await this._save();
    return cart;
  }

  async getCartById(cid) {
    await this._load();
    return this.carts.find(c => c.id === Number(cid)) || null;
  }

  async addProduct(cid, pid) {
    await this._load();  
    const cart = this.carts.find(c => c.id === Number(cid));
    if (!cart) return null;
    const item = cart.products.find(p => p.product === Number(pid));
    if (item) item.quantity++;
    else cart.products.push({ product: Number(pid), quantity: 1 });
    await this._save();
    return cart;
  }
}
