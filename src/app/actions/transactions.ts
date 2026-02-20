'use server';

import { supabase } from '@/lib/supabase';
import { categorizeTransaction } from '@/lib/gemini';
import { revalidatePath } from 'next/cache';

export async function addTransaction(formData: {
    amount: number;
    description: string;
    type: 'income' | 'expense';
    date: string;
}) {
    const { amount, description, type, date } = formData;

    // 1. Obtener todas las categorías disponibles para el tipo dado
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('type', type);

    if (catError || !categories) {
        throw new Error('No se pudieron cargar las categorías');
    }

    // 2. APRENDIZAJE: Buscar si existe una transacción previa exacta con esa descripción (insensible a mayúsculas)
    const { data: previousTransactions, error: prevError } = await supabase
        .from('transactions')
        .select('category_id')
        .ilike('description', description)
        .eq('type', type)
        .limit(1);

    let categoryId: string;

    if (previousTransactions && previousTransactions.length > 0 && previousTransactions[0].category_id) {
        console.log('Using learned category for:', description);
        categoryId = previousTransactions[0].category_id;
    } else {
        // 3. IA: Si no hay historial, usar Gemini
        console.log('Using Gemini AI for:', description);
        const category = await categorizeTransaction(description, type, categories);
        categoryId = category.id;
    }

    // 4. Insertar la nueva transacción
    const { error: insertError } = await supabase
        .from('transactions')
        .insert({
            amount,
            description,
            type,
            date,
            category_id: categoryId
        });

    if (insertError) {
        throw new Error('Error al insertar la transacción: ' + insertError.message);
    }

    revalidatePath('/');
    return { success: true };
}

export async function getSummary(fromDate?: string, toDate?: string) {
    let query = supabase
        .from('transactions')
        .select(`
            id,
            amount,
            type,
            description,
            date,
            category_id,
            categories (
                name,
                icon
            )
        `)
        .order('date', { ascending: false });

    if (fromDate) query = query.gte('date', fromDate);
    if (toDate) query = query.lte('date', toDate);

    const { data: transactions, error } = await query;

    if (error) return { income: 0, expenses: 0, transactions: [] };

    const summary = transactions.reduce((acc, curr) => {
        if (curr.type === 'income') acc.income += Number(curr.amount);
        else acc.expenses += Number(curr.amount);
        return acc;
    }, { income: 0, expenses: 0 });

    return { ...summary, transactions };
}

export async function deleteTransaction(id: string) {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error('Error al eliminar la transacción: ' + error.message);
    }

    revalidatePath('/');
    return { success: true };
}

export async function updateTransactionCategory(id: string, categoryId: string) {
    const { error } = await supabase
        .from('transactions')
        .update({ category_id: categoryId })
        .eq('id', id);

    if (error) {
        throw new Error('Error al actualizar la categoría: ' + error.message);
    }

    revalidatePath('/');
    return { success: true };
}

export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, type, icon, budget')
        .order('name');

    if (error) return [];
    return data;
}

export async function addCategory(name: string, icon: string, type: 'income' | 'expense') {
    const { error } = await supabase
        .from('categories')
        .insert({ name, icon, type });

    if (error) {
        throw new Error('Error al crear la categoría: ' + error.message);
    }

    revalidatePath('/');
    return { success: true };
}

export async function getFinancialReport(data: any) {
    const { transactions, income, expenses } = data;

    // Preparar un resumen simple para la IA para no saturar el prompt
    const summaryData = {
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses,
        savingsRate: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0,
        recentTransactions: transactions.slice(0, 15).map((t: any) => ({
            desc: t.description,
            amount: t.amount,
            category: t.categories?.name,
            type: t.type
        }))
    };

    const prompt = `
    Eres un Asesor Financiero Senior y experto en Economía Personal. 
    Tu objetivo es analizar los datos financieros del usuario y proporcionar un informe ejecutivo de alta calidad.

    DATOS ACTUALES:
    ${JSON.stringify(summaryData, null, 2)}

    ESTRUCTURA DEL REPORTE (JSON):
    Retorna estrictamente un objeto JSON con este formato:
    {
      "executiveSummary": "Un párrafo potente analizando la situación actual.",
      "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
      "recommendations": ["Recomendación 1", "Recomendación 2"],
      "healthScore": 0-100 (un número representando la salud financiera),
      "financialArchetype": "Un nombre creativo basado en sus hábitos"
    }

    REGLAS:
    - El tono debe ser profesional, directo y experto.
    - Los insights deben basarse en la relación ingreso/gasto y categorías detectadas.
    - El idioma debe ser ESPAÑOL.
    - Retorna SOLO el JSON.
    `;

    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
        console.error("Gemini Report Error:", error);
        return null;
    }
}

export async function getMonthlyStats(useCycle: boolean = true) {
    const monthsToShow = 6;
    const stats = [];
    const now = new Date();

    for (let i = 0; i < monthsToShow; i++) {
        let fromDate, toDate;

        if (useCycle) {
            // Cycle logic: 23rd of previous month to 22nd of current month (avoid overlaps)
            const endDate = new Date(now.getFullYear(), now.getMonth() - i, 22);
            const startDate = new Date(now.getFullYear(), now.getMonth() - i - 1, 23);
            fromDate = startDate.toISOString().split('T')[0];
            toDate = endDate.toISOString().split('T')[0];
        } else {
            // Calendar month logic
            const firstDay = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            fromDate = firstDay.toISOString().split('T')[0];
            toDate = lastDay.toISOString().split('T')[0];
        }

        const { income, expenses } = await getSummary(fromDate, toDate);

        // Month name for label
        const monthDate = new Date(toDate);
        const monthLabel = monthDate.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });

        stats.push({
            label: monthLabel,
            income,
            expenses,
            savings: income - expenses,
            fromDate,
            toDate
        });
    }

    return stats.reverse();
}
export async function updateCategoryBudget(categoryId: string, budget: number) {
    const { error } = await supabase
        .from('categories')
        .update({ budget })
        .eq('id', categoryId);

    if (error) {
        throw new Error('Error al actualizar el presupuesto: ' + error.message);
    }

    revalidatePath('/');
    return { success: true };
}
