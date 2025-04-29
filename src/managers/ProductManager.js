import fs from 'fs/promises';

export class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this._load();
  }

  async _load() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch {
      this.products = [];
      await this._save();
    }
  }

  async _save() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
  }

  async addProduct({ title, description, code, price, status = true, stock, category, thumbnails = [] }) {
    const newId = this.products.length
      ? this.products[this.products.length - 1].id + 1
      : 1;
    const newProd = { id: newId, title, description, code, price, status, stock, category, thumbnails };
    this.products.push(newProd);
    await this._save();
    return newProd;
  }

  async getProducts() {
    await this._load();
    return this.products;
  }

  async getProductById(pid) {
    await this._load();
    return this.products.find(p => p.id === Number(pid)) || null;
  }

  async updateProduct(pid, fields) {
    await this._load();
    const idx = this.products.findIndex(p => p.id === Number(pid));
    if (idx < 0) return null;
    // nunca cambiar el id
    this.products[idx] = { ...this.products[idx], ...fields, id: Number(pid) };
    await this._save();
    return this.products[idx];
  }

  async deleteProduct(pid) {
    await this._load();
    const idx = this.products.findIndex(p => p.id === Number(pid));
    if (idx < 0) return false;
    this.products.splice(idx, 1);
    await this._save();
    return true;
  }
}

