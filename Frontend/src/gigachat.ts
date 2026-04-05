const CREDENTIALS = import.meta.env.VITE_GIGACHAT_CREDENTIALS?.trim();

if (!CREDENTIALS) {
    console.error('VITE_GIGACHAT_CREDENTIALS не задан в .env файле!');
}

let accessToken: string | null = null;

const getAccessToken = async (): Promise<string> => {
    if (accessToken) return accessToken;

    const response = await fetch('/gigachat-oauth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': `Basic ${CREDENTIALS}`,
            'RqUID': crypto.randomUUID(),        
        },
        body: 'scope=GIGACHAT_API_PERS',
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('OAuth error:', response.status, errorText);
        throw new Error(`Ошибка авторизации: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;

    setTimeout(() => { accessToken = null; }, 25 * 60 * 1000);

    return accessToken!;
};

// Улучшить описание
export const improveDescription = async (
    title: string,
    currentDescription: string,
    category: string
): Promise<string> => {
    const token = await getAccessToken();

    const prompt = `Ты — профессиональный копирайтер объявлений для Авито/Юлы.
        Улучши описание товара: сделай его живым, продающим и структурированным.
        Добавь преимущества и эмоции. Сохрани все важные факты.

        Название: ${title}
        Категория: ${category}
        Текущее описание: ${currentDescription || "Описание отсутствует"}

        Напиши улучшенную версию (максимум 300 символов).`;

    const response = await fetch('/gigachat-chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            model: 'GigaChat-2-Max',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1200,
            n: 1,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat error:', response.status, errorText);
        throw new Error(`Ошибка ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || 'Не удалось сгенерировать описание';
};

// Оценка рыночной цены
export const estimateMarketPrice = async (
    title: string,
    category: string,
    params: any,
    currentPrice?: string
): Promise<string> => {
    const token = await getAccessToken();

    const prompt = `Ты — эксперт по вторичному рынку России (Авито, Юла и др.).
Оцени реальную рыночную стоимость товара.

Название: ${title}
Категория: ${category}
Характеристики: ${JSON.stringify(params, null, 2)}
Цена продавца: ${currentPrice || 'не указана'}

Ответь строго в формате:

Рыночная цена: от X до Y рублей
Рекомендуемая цена для быстрой продажи: Z рублей
Краткое обоснование: (2–4 предложения)`;

    const response = await fetch('/gigachat-chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            model: 'GigaChat-2-Max',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.6,
            max_tokens: 900,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Price estimation error:', response.status, errorText);
        throw new Error(`Ошибка ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || 'Не удалось оценить цену';
};