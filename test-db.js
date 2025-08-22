const { Client } = require('pg')

// Replace with your actual password
const connectionString = "postgresql://postgres:nazneen@1993@db.esqtzqwdlbjliarzhuau.supabase.co:5432/postgres"

const client = new Client({
  connectionString: connectionString
})

async function testConnection() {
  try {
    console.log('Attempting to connect...')
    await client.connect()
    console.log('✅ Connected successfully!')
    
    const result = await client.query('SELECT NOW()')
    console.log('✅ Query successful:', result.rows[0])
    
    await client.end()
  } catch (error) {
    console.log('❌ Connection failed:', error.message)
  }
}

testConnection()