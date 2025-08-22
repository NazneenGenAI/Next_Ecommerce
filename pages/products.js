// pages/products.js
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(data.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    filterProducts(category, searchTerm);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterProducts(selectedCategory, term);
  };

  const filterProducts = (category, search) => {
    let filtered = products;

    if (category !== 'All') {
      filtered = filtered.filter(product => product.category === category);
    }

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  // Keep all your existing styles...
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px'
  };

  const headerStyle = {
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '16px'
  };

  const searchContainerStyle = {
    marginBottom: '24px'
  };

  const searchInputStyle = {
    width: '100%',
    maxWidth: '400px',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  };

  const filterContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '32px'
  };

  const filterButtonStyle = (isActive) => ({
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: isActive ? '#2563eb' : '#f3f4f6',
    color: isActive ? 'white' : '#374151'
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px'
  };

  if (loading) {
    return (
      <Layout title="Products - NextCommerce">
        <div style={{ ...containerStyle, textAlign: 'center' }}>
          <p>Loading products...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Products - NextCommerce">
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>All Products</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
            Showing {filteredProducts.length} of {products.length} products
          </p>
          
          {/* Search Bar */}
          <div style={searchContainerStyle}>
            <input
              type="text"
              placeholder="Search products..."
              style={searchInputStyle}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Category Filter */}
          <div style={filterContainerStyle}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                style={filterButtonStyle(selectedCategory === category)}
                onMouseOver={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.backgroundColor = '#e5e7eb';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div style={gridStyle}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280', fontSize: '18px' }}>
            <p>No products found matching your criteria.</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Try adjusting your search or filter options.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}