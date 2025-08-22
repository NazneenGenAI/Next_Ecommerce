// pages/api/chatbot.js
import OpenAI from 'openai';
import { prisma } from '../../lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to get product information
async function getProductInfo(query) {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 3 // Limit to 3 products
    });
    
    return products.map(p => ({
      name: p.name,
      price: p.price,
      category: p.category,
      stock: p.stock,
      description: p.description.substring(0, 100) + '...'
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { message, conversationHistory = [] } = req.body;

      // Check if user is asking about products
      const productKeywords = ['product', 'item', 'buy', 'purchase', 'find', 'search', 'looking for'];
      const isProductQuery = productKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
      );

      let productContext = '';
      
      if (isProductQuery) {
        const products = await getProductInfo(message);
        if (products.length > 0) {
          productContext = `\n\nHere are some relevant products from our store:\n${products.map(p => 
            `- ${p.name}: $${p.price} (${p.stock} in stock) - ${p.description}`
          ).join('\n')}`;
        }
      }

      const systemPrompt = `You are Alex, a helpful and friendly customer service chatbot for NextCommerce, a premium e-commerce website.

STORE INFORMATION:
Our product categories:
- Electronics: Wireless headphones ($79.99), Smart fitness watches ($199.99)
- Clothing: Organic cotton t-shirts ($29.99)
- Home & Garden: Modern desk lamps ($45.99)
- Food & Beverage: Premium coffee beans ($24.99)
- Accessories: Leather messenger bags ($89.99)

POLICIES & SERVICES:
- FREE shipping on orders over $50
- 30-day hassle-free returns
- We accept all major credit cards, PayPal
- Standard delivery: 3-5 business days
- Express shipping: $9.99 (1-2 business days)
- 24/7 customer support
- Price matching available

PERSONALITY:
- Be warm, helpful, and conversational
- Use emojis sparingly but effectively
- Ask follow-up questions to better help customers
- If you don't know something specific, offer to connect them with human support
- Always try to guide towards making a purchase when appropriate
- Be enthusiastic about our products

${productContext}

Keep responses concise but informative. Always aim to be helpful and move the conversation toward a solution.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: message }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 200,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const botResponse = completion.choices[0].message.content;

      res.status(200).json({ 
        response: botResponse,
        products: isProductQuery ? await getProductInfo(message) : []
      });

    } catch (error) {
      console.error('ChatGPT API error:', error);
      
      // Fallback response
      const fallbackResponses = [
        "I'm having trouble connecting right now, but I'm here to help! Could you please try asking your question again?",
        "Sorry, I'm experiencing some technical difficulties. Is there something specific I can help you with about our products or services?",
        "I'm temporarily unable to process that request, but I'd love to help! What can I assist you with today?"
      ];
      
      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      res.status(200).json({ 
        response: randomFallback,
        error: true
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}