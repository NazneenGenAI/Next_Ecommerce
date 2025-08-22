// pages/admin/index.js
import { useState } from 'react';
import Layout from '../../components/Layout';
import products from '../../data/products.json';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [productList, setProductList] = useState(products);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: '',
    stock: '',
    features: ''
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = {
      ...newProduct,
      id: String(Date.now()),
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      features: newProduct.features.split(',').map(f => f.trim())
    };
    
    setProductList([...productList, product]);
    setNewProduct({
      name: '',
      price: '',
      description: '',
      category: '',
      image: '',
      stock: '',
      features: ''
    });
    setIsAddingProduct(false);
    toast.success('Product added successfully!');
  };

  const handleDeleteProduct = (id) => {
    setProductList(productList.filter(p => p.id !== id));
    toast.success('Product deleted!');
  };

  return (
    <Layout title="Admin Dashboard - NextCommerce">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => setIsAddingProduct(!isAddingProduct)}
            className="btn-primary"
          >
            {isAddingProduct ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {/* Add Product Form */}
        {isAddingProduct && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                required
                className="input-field"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                required
                className="input-field"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              />
              <input
                type="text"
                placeholder="Category"
                required
                className="input-field"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              />
              <input
                type="number"
                placeholder="Stock"
                required
                className="input-field"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
              />
              <input
                type="url"
                placeholder="Image URL"
                required
                className="input-field"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
              />
              <input
                type="text"
                placeholder="Features (comma separated)"
                required
                className="input-field"
                value={newProduct.features}
                onChange={(e) => setNewProduct({...newProduct, features: e.target.value})}
              />
              <textarea
                placeholder="Description"
                required
                className="input-field md:col-span-2"
                rows="3"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              />
              <button type="submit" className="btn-primary md:col-span-2">
                Add Product
              </button>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productList.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}