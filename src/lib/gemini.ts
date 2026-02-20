import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

export async function categorizeTransaction(description: string, type: 'income' | 'expense', categories: { id: string, name: string }[]) {
    const categoriesList = categories.map(c => c.name).join(', ');

    const prompt = `De acuerdo a la siguiente descripción de un ${type === 'income' ? 'ingreso' : 'gasto'}: "${description}". 
  Por favor elige la categoría más adecuada de esta lista: [${categoriesList}]. 
  Responde únicamente con el nombre de la categoría, sin puntuación y nada más.`;

    try {
        const result = await model.generateContent(prompt);
        const categoryName = result.response.text().trim().replace(/['".,]/g, '');

        // Buscar la categoría que coincida con la respuesta de la IA (ahora más flexible)
        const matchedCategory = categories.find(c =>
            c.name.toLowerCase().includes(categoryName.toLowerCase()) ||
            categoryName.toLowerCase().includes(c.name.toLowerCase())
        );

        return matchedCategory || categories.find(c => c.name.includes('Otros')) || categories[0];
    } catch (error) {
        console.error("Error categorizing with Gemini:", error);
        return categories.find(c => c.name.includes('Otros')) || categories[0];
    }
}
