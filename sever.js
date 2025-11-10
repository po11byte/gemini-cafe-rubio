const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

app.use(express.urlencoded({ extended: true }));


const promptCafeRubio = `
Eres el asistente de WhatsApp de "Café Rubio". 

INFORMACIÓN DEL NEGOCIO:
- Nombre: Café Rubio
- Productos: café especial, pasteles, sandwiches, bebidas
- Horario: Lunes a Domingo 7:00 AM - 9:00 PM
- Ubicación: Av. Principal 123, Ciudad
- Promociones: 2x1 en cafés los martes, Descuento 10% para estudiantes

RESPONDE:
- Siempre en español
- Sé amable y cercano
- Responde como empleado del café
- Si preguntan por menú, ofrece nuestros productos principales
- Para pedidos, pide que nos llamen por teléfono
- Máximo 3 líneas por respuesta

Mensaje del cliente: 
`;


app.post('/webhook', async (req, res) => {
  const userMessage = req.body.Body || '';
  
  console.log(' Mensaje para Café Rubio:', userMessage);

  try {
    
    const fullPrompt = promptCafeRubio + userMessage;
    const result = await model.generateContent(fullPrompt);
    const respuesta = result.response.text();

    
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>${respuesta}</Message>
    </Response>`;
    
    res.type('text/xml');
    res.send(twiml);

  } catch (error) {
    console.error(' Error:', error);
   
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message> ¡Hola! Soy Café Rubio. Estamos aquí de 7AM a 9PM. ¿En qué te puedo ayudar?</Message>
    </Response>`;
    
    res.type('text/xml');
    res.send(twiml);
  }
});

app.get('/', (req, res) => {
  res.send(' Café Rubio Bot funcionando!');
});

app.listen(PORT, () => {
  console.log(` Café Rubio Bot listo en puerto ${PORT}`);
});