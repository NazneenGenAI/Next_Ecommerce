// pages/debug.js
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState(null)
  const [productsInfo, setProductsInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function runTests() {
      try {
        // Test 1: Debug API
        console.log('Testing debug API...')
        const debugResponse = await fetch('/api/debug')
        const debugData = await debugResponse.json()
        setDebugInfo(debugData)
        console.log('Debug API result:', debugData)

        // Test 2: Products API
        console.log('Testing products API...')
        const productsResponse = await fetch('/api/products')
        const productsData = await productsResponse.json()
        setProductsInfo({
          status: productsResponse.status,
          data: productsData,
          isArray: Array.isArray(productsData),
          count: Array.isArray(productsData) ? productsData.length : 0
        })
        console.log('Products API result:', productsData)

      } catch (error) {
        console.error('Test failed:', error)
        setDebugInfo({ error: error.message })
      } finally {
        setLoading(false)
      }
    }

    runTests()
  }, [])

  if (loading) {
    return (
      <Layout title="Debug - Loading...">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">🔍 Running Diagnostics...</h1>
          <p>Testing database connection and API endpoints...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Debug Information">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">🔍 Debug Information</h1>
        
        {/* Debug API Results */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Database Connection Test</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </div>

        {/* Products API Results */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Products API Test</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="mb-2">
              <strong>Status:</strong> {productsInfo?.status || 'Unknown'}
            </div>
            <div className="mb-2">
              <strong>Is Array:</strong> {productsInfo?.isArray ? 'Yes' : 'No'}
            </div>
            <div className="mb-2">
              <strong>Product Count:</strong> {productsInfo?.count || 0}
            </div>
            <div className="mb-2">
              <strong>Raw Response:</strong>
            </div>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(productsInfo?.data, null, 2)}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Actions</h2>
          <div className="space-y-2">
            <button
              onClick={() => fetch('/api/setup-database', { method: 'POST' })
                .then(r => r.json())
                .then(data => {
                  alert('Setup result: ' + JSON.stringify(data, null, 2))
                  window.location.reload()
                })
                .catch(err => alert('Error: ' + err.message))
              }
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
            >
              🌱 Seed Database
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              🔄 Refresh Tests
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}