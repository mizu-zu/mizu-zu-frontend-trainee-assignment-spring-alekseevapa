import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItemById } from './client';
import type { ItemFull } from './client';
import NeedsRevision from './components/NeedsRevision/NeedsRevision';
import "./styles/CardPage.css";

const CardPage = () => {
    const [data, setData] = useState<ItemFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const loadItem = async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            const result = await getItemById(id);
            setData(result);
        } catch (err: any) {
            console.error("Ошибка загрузки:", err);
            setError(err.response?.data?.message || err.message || "Не удалось загрузить объявление");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItem();
    }, [id]);

    if (loading) return <div className="loading">Загрузка объявления...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;
    if (!data) return <div className="not-found">Объявление не найдено</div>;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMissingFields = (): string[] => {
        const missing: string[] = [];

        if (!data.title?.trim()) missing.push('Название');
        if (!data.price || data.price <= 0) missing.push('Цена');

        if (data.category === 'electronics') {
            if (!data.params?.brand?.trim()) missing.push('Бренд');
            if (!data.params?.model?.trim()) missing.push('Модель');
            if (!data.params?.condition) missing.push('Состояние');
        } 
        else if (data.category === 'auto') {
            if (!data.params?.brand?.trim()) missing.push('Бренд');
            if (!data.params?.model?.trim()) missing.push('Модель');
            if (!data.params?.yearOfManufacture) missing.push('Год выпуска');
            if (!data.params?.mileage && data.params?.mileage !== 0) missing.push('Пробег');
        } 
        else if (data.category === 'real_estate') {
            if (!data.params?.address?.trim()) missing.push('Адрес');
            if (!data.params?.area) missing.push('Площадь');
            if (!data.params?.type) missing.push('Тип недвижимости');
        }

        return missing;
    };

    const missingFields = getMissingFields();
    const hasMissingFields = missingFields.length > 0;

    const renderCharacteristics = () => {
    if (!data.params || Object.keys(data.params).length === 0) {
        return <p className="no-characteristics">Характеристики отсутствуют</p>;
    }

    const filledParams = Object.entries(data.params).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        return true;
    });

    if (filledParams.length === 0) {
        return <p className="no-characteristics">Заполненных характеристик нет</p>;
    }

    const sortedParams = [...filledParams].sort(([keyA], [keyB]) => {
        if (keyA === 'type') return -1;
        if (keyB === 'type') return 1;
        return 0;
    });

    return (
        <div className="characteristics-list">
            {sortedParams.map(([key, value]) => {
                const label = getFieldLabel(key);
                const displayValue = getFieldValue(key, value);

                return (
                    <div className="characteristic-item" key={key}>
                        <span className="characteristic-label">{label}</span>
                        <span className="characteristic-value">{displayValue}</span>
                    </div>
                );
            })}
        </div>
    );
};

    const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
        brand: "Бренд",
        model: "Модель",
        color: "Цвет",
        condition: "Состояние",
        yearOfManufacture: "Год выпуска",
        transmission: "Коробка передач",
        mileage: "Пробег",
        enginePower: "Мощность двигателя",
        type: "Тип",
        address: "Адрес",
        area: "Площадь",
        floor: "Этаж",
    };

    if (labels[key]) return labels[key];

    return key
        .replace(/([A-Z])/g, ' $1')   
        .replace(/^./, str => str.toUpperCase())
        .trim();
    };

    const getFieldValue = (key: string, value: any): string => {
        if (key === 'type') {
            const typeMap: Record<string, string> = {
                // Electronics
                phone: "Телефон",
                laptop: "Ноутбук",
                misc: "Другое",

                // Real Estate
                flat: "Квартира",
                house: "Дом",
                room: "Комната",

                // Auto
                sedan: "Седан",
                suv: "Внедорожник",

            };

            return typeMap[value as string] || value;
        }

        if (key === 'condition') {
            const conditionMap: Record<string, string> = {
                new: "Новое",
                used: "Б/у",
            };
            return conditionMap[value as string] || value;
        }

        return String(value);
    };

    const handleEdit = () => {
        navigate(`/edit/${id}`);
    };

    return (
        <div className='card-page'>
            <div className='card-page-header'>
                <div className='cardtitle-buttonedit'>
                    <h1>{data.title}</h1>
                    <button className='button-edit' onClick={handleEdit}>
                        Редактировать 
                        <img src="/src/assets/icons/Edit.svg" width={18} height={18} alt="edit" />
                    </button>
                </div>

                <div className='card-price-date-info'>
                    <p className="price">{data.price.toLocaleString('ru-RU')} ₽</p>
                    <div className='date-info'>
                        <p className="p-date-info">Опубликовано: {formatDate(data.createdAt)}</p>
                        <p className="p-date-info">Отредактировано: {formatDate(data.updatedAt)}</p>
                    </div>
                </div>
            </div>

            <div className='line-cardpage'></div>

            <div className="cards-charact">
                <div className="cards-charact-img-description">
                    <img 
                        src="/src/assets/icons/cover.svg" 
                        className="cardpage-img" 
                        alt={data.title}
                    />

                    <div className="description">
                        <h2>Описание</h2>
                        <p>{data.description || 'Описание отсутствует'}</p>
                    </div>
                </div>

                <div className="characteristics">

                    {hasMissingFields && (
                        <NeedsRevision missingFields={missingFields} />
                    )}  

                    <h2 className="characteristics-h2">Характеристики</h2>

                    <div className="characteristics-done">
                        {renderCharacteristics()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardPage;