import React, { useState, useEffect, useCallback} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ItemUpdateIn, Category, ElectronicsItemParams, AutoItemParams, RealEstateItemParams } from './client';
import { updateItem, getItemById } from './client';
import { improveDescription, estimateMarketPrice } from './gigachat';
import SuccessSaved from './components/SuccessSaved/SuccessSaved';
import UnSuccessSaved from './components/UnSuccessSaved/UnSuccessSaved';
import Modal from './components/Modal/Modal';
import "./styles/CardEditPage.css"

type ParamsType = AutoItemParams | RealEstateItemParams | ElectronicsItemParams;

const CardEditPage = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [category, setCategory] = useState<Category>('electronics');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    const [params, setParams] = useState<ParamsType>({});

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    
    const [touched, setTouched] = useState({
        title: false,
        price: false,
        brand: false,
        model: false,
        color: false,
        condition: false,
        yearOfManufacture: false,
        transmission: false,
        mileage: false,
        enginePower: false,
        address: false,
        area: false,
        floor: false,
    });

    const [improvingDesc, setImprovingDesc] = useState(false);
    const [estimatingPrice, setEstimatingPrice] = useState(false);

    const [improveError, setImproveError] = useState(false);
    const [priceError, setPriceError] = useState(false);

    const [showPriceModal, setShowPriceModal] = useState(false);
    const [priceResult, setPriceResult] = useState<string>('');
    const [draftSaving, setDraftSaving] = useState(false);

    const [showImproveModal, setShowImproveModal] = useState(false);
    const [improvedDescription, setImprovedDescription] = useState<string>('');

    const DRAFT_KEY = (id: string) => `edit_draft_${id}`;

    useEffect(() => {
        if (!id) return;

        const loadItem = async () => {
            try {
                const item = await getItemById(id);

                const draftStr = localStorage.getItem(DRAFT_KEY(id));

                if (draftStr) {
                    try {
                        const draft = JSON.parse(draftStr);

                        if (draft.updatedAt > Date.now() - 24 * 60 * 60 * 1000) {
                            const shouldRestore = window.confirm(
                                'Найден несохранённый черновик.\n\nВосстановить последние изменения?'
                            );

                            if (shouldRestore) {
                                setCategory(draft.category);
                                setTitle(draft.title || '');
                                setPrice(draft.price || '');
                                setDescription(draft.description || '');
                                setParams({ ...(draft.params || {}) });

                                setLoading(false);
                                return;
                            }
                        }
                    } catch (e) {
                        console.error('Ошибка чтения черновика', e);
                        localStorage.removeItem(DRAFT_KEY(id));
                    }
                }

                setCategory(item.category);
                setTitle(item.title);
                setPrice(item.price.toString());
                setDescription(item.description || '');
                setParams(item.params || {});

            } catch (err) {
                console.error("Ошибка загрузки объявления для редактирования", err);
            } finally {
                setLoading(false);
            }
        };

        loadItem();
    }, [id]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value as Category;
        setCategory(newCategory);

        if (newCategory === 'electronics') {
            setParams({
                type: 'laptop',
                brand: '',
                model: '',
                condition: 'used',
                color: ''
            });
        } else if (newCategory === 'auto') {
            setParams({
                brand: '',
                model: '',
                yearOfManufacture: undefined,
                transmission: 'automatic',
                mileage: undefined,
                enginePower: undefined
            });
        } else if (newCategory === 'real_estate') {
            setParams({
                type: 'flat',
                address: '',
                area: undefined,
                floor: undefined
            });
        }
    };

    const handleParamChange = (key: string, value: any) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const isTitleValid = title.trim().length > 0;
    const isPriceValid = price.trim().length > 0 && !isNaN(Number(price));

    const canSave = isTitleValid && isPriceValid;

    const showTitleError = touched.title && !isTitleValid;
    const showPriceError = touched.price && !isPriceValid;

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const renderParams = () => {
    if (category === 'electronics') {
        const p = params as ElectronicsItemParams;
        return (
            <>
                <p className="card-edit-page-title-p">Тип</p>
                <select 
                    className="input" 
                    value={p.type || 'laptop'}
                    onChange={(e) => handleParamChange('type', e.target.value)}
                >
                    <option value="phone">Телефон</option>
                    <option value="laptop">Ноутбук</option>
                    <option value="misc">Другое</option>
                </select>

                <p className="card-edit-page-title-p">Бренд</p>
                <input 
                    className={`input ${touched.brand && !p.brand?.trim() ? 'input-warning' : ''}`} 
                    value={p.brand || ''} 
                    onChange={(e) => handleParamChange('brand', e.target.value)}
                    onBlur={() => handleBlur('brand')}
                />

                <p className="card-edit-page-title-p">Модель</p>
                <input 
                    className={`input ${touched.model && !p.model?.trim() ? 'input-warning' : ''}`} 
                    value={p.model || ''} 
                    onChange={(e) => handleParamChange('model', e.target.value)}
                    onBlur={() => handleBlur('model')}
                />

                <p className="card-edit-page-title-p">Цвет</p>
                <input 
                    className={`input ${touched.color && !p.color?.trim() ? 'input-warning' : ''}`} 
                    value={p.color || ''} 
                    onChange={(e) => handleParamChange('color', e.target.value)}
                    onBlur={() => handleBlur('color')}
                />

                <p className="card-edit-page-title-p">Состояние</p>
                <select 
                    className={`input ${touched.condition && !p.condition ? 'input-warning' : ''}`} 
                    value={p.condition || 'used'}
                    onChange={(e) => handleParamChange('condition', e.target.value)}
                    onBlur={() => handleBlur('condition')}
                >
                    <option value="new">Новое</option>
                    <option value="used">Б/у</option>
                </select>
            </>
        );
    }

    if (category === 'auto') {
        const p = params as AutoItemParams;
        return (
            <>
                <p className="card-edit-page-title-p">Бренд</p>
                <input 
                    className={`input ${touched.brand && !p.brand?.trim() ? 'input-warning' : ''}`} 
                    value={p.brand || ''} 
                    onChange={(e) => handleParamChange('brand', e.target.value)}
                    onBlur={() => handleBlur('brand')}
                />

                <p className="card-edit-page-title-p">Модель</p>
                <input 
                    className={`input ${touched.model && !p.model?.trim() ? 'input-warning' : ''}`} 
                    value={p.model || ''} 
                    onChange={(e) => handleParamChange('model', e.target.value)}
                    onBlur={() => handleBlur('model')}
                />

                <p className="card-edit-page-title-p">Год выпуска</p>
                <input 
                    className={`input ${touched.yearOfManufacture && !p.yearOfManufacture ? 'input-warning' : ''}`} 
                    type="number"
                    value={p.yearOfManufacture || ''} 
                    onChange={(e) => handleParamChange('yearOfManufacture', e.target.value ? Number(e.target.value) : '')}
                    onBlur={() => handleBlur('yearOfManufacture')}
                />

                <p className="card-edit-page-title-p">Коробка передач</p>
                <select 
                    className={`input ${touched.transmission && !p.transmission ? 'input-warning' : ''}`} 
                    value={p.transmission || 'automatic'}
                    onChange={(e) => handleParamChange('transmission', e.target.value)}
                    onBlur={() => handleBlur('transmission')}
                >
                    <option value="automatic">Автоматическая</option>
                    <option value="manual">Механическая</option>
                </select>

                <p className="card-edit-page-title-p">Пробег (км)</p>
                <input 
                    className={`input ${touched.mileage && !p.mileage ? 'input-warning' : ''}`} 
                    type="number"
                    value={p.mileage || ''} 
                    onChange={(e) => handleParamChange('mileage', e.target.value ? Number(e.target.value) : '')}
                    onBlur={() => handleBlur('mileage')}
                />

                <p className="card-edit-page-title-p">Мощность двигателя (л.с.)</p>
                <input 
                    className={`input ${touched.enginePower && !p.enginePower ? 'input-warning' : ''}`} 
                    type="number"
                    value={p.enginePower || ''} 
                    onChange={(e) => handleParamChange('enginePower', e.target.value ? Number(e.target.value) : '')}
                    onBlur={() => handleBlur('enginePower')}
                />
            </>
        );
    }

    if (category === 'real_estate') {
        const p = params as RealEstateItemParams;
        return (
            <>
                <p className="card-edit-page-title-p">Тип</p>
                <select 
                    className="input" 
                    value={p.type || 'flat'}
                    onChange={(e) => handleParamChange('type', e.target.value)}
                >
                    <option value="flat">Квартира</option>
                    <option value="house">Дом</option>
                    <option value="room">Комната</option>
                </select>

                <p className="card-edit-page-title-p">Адрес</p>
                <input 
                    className={`input ${touched.address && !p.address?.trim() ? 'input-warning' : ''}`} 
                    value={p.address || ''} 
                    onChange={(e) => handleParamChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                />

                <p className="card-edit-page-title-p">Площадь (м²)</p>
                <input 
                    className={`input ${touched.area && !p.area ? 'input-warning' : ''}`} 
                    type="number"
                    value={p.area || ''} 
                    onChange={(e) => handleParamChange('area', e.target.value ? Number(e.target.value) : '')}
                    onBlur={() => handleBlur('area')}
                />

                <p className="card-edit-page-title-p">Этаж</p>
                <input 
                    className={`input ${touched.floor && !p.floor ? 'input-warning' : ''}`} 
                    type="number"
                    value={p.floor || ''} 
                    onChange={(e) => handleParamChange('floor', e.target.value ? Number(e.target.value) : '')}
                    onBlur={() => handleBlur('floor')}
                />
            </>
        );
    }

        return null;
    };

    const saveDraft = useCallback(() => {
        if (!id) return;

        setDraftSaving(true);

        const draftData = {
            category,
            title,
            price,
            description,
            params: { ...params },
            updatedAt: Date.now(),
        };

        try {
            localStorage.setItem(DRAFT_KEY(id), JSON.stringify(draftData));
        } catch (e) {
            console.error('Не удалось сохранить черновик', e);
        } finally {
            setDraftSaving(false);
        }
    }, [id, category, title, price, description, params]);

    useEffect(() => {
        if (!id) return;

        const timeout = setTimeout(() => {
            saveDraft();
        }, 800);

        return () => clearTimeout(timeout);
    }, [saveDraft]);

    const handleSave = async () => {
        if (!canSave || !id) return;

        setSaving(true);
        setShowSuccess(false);
        setShowError(false);

        const updateData: ItemUpdateIn = {
            category,
            title: title.trim(),
            description: description.trim() || undefined,
            price: Number(price),
            params: { ...params }
        };

        try {
            await updateItem(id, updateData);
            setShowSuccess(true);

            localStorage.removeItem(DRAFT_KEY(id));

            setTimeout(() => {
                navigate(`/item/${id}`);
            }, 1800);
        } catch (err: any) {
            console.error(err);
            setShowError(true);
        } finally {
            setSaving(false);
        }
    };

    const handleImproveDescription = async () => {
        if (!title.trim()) {
            alert('Сначала заполните название объявления');
            return;
        }

        setImprovingDesc(true);
        setImproveError(false);

        try {
            const improvedText = await improveDescription(title, description, category);
            
            setImprovedDescription(improvedText);
            setShowImproveModal(true);
            setImproveError(false);
        } catch (error) {
            console.error(error);
            setImproveError(true);
        } finally {
            setImprovingDesc(false);
        }
    };

    const handleEstimatePrice = async () => {
        if (!title.trim()) {
            alert('Сначала укажите название товара');
            return;
        }

        setEstimatingPrice(true);
        setPriceError(false);

        try {
            const result = await estimateMarketPrice(title, category, params, price);
            
            setPriceResult(result); 
            setShowPriceModal(true);
            setPriceError(false);
        } catch (error) {
            console.error(error);
            setPriceError(true);
        } finally {
            setEstimatingPrice(false);
        }
    };

    const handleApplyPrice = () => {
        setShowPriceModal(false); 
    };

    const handleApplyImprovedDescription = () => {
        setDescription(improvedDescription);
        setShowImproveModal(false);
    };

    if (loading) return <div className="loading">Загрузка...</div>;

    return (
        <div className="card-edit-page">
            <h1 className='card-edit-page-h1'>Редактирование объявления</h1>

            <p className="card-edit-page-title-p">Категория</p>
            <select className="input" value={category} onChange={handleCategoryChange}>
                <option value="electronics">Электроника</option>
                <option value="auto">Авто</option>
                <option value="real_estate">Недвижимость</option>
            </select>

            <p className="card-edit-page-title-p">
                <span className="required">*</span> Название
            </p>
            <input
                className={`input ${showTitleError ? 'input-error' : ''}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleBlur('title')}
                placeholder="Название объявления"
            />
            {showTitleError && <p className="error-text">Поле должно быть заполнено</p>}

            <p className="card-edit-page-title-p">
                <span className="required">*</span> Цена
            </p>
            <div className="price-edit">
                <input
                    className={`input ${showPriceError ? 'input-error' : ''}`}
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onBlur={() => handleBlur('price')}
                    placeholder="150000"
                />
                <button 
                    className="ai-market-price" 
                    onClick={handleEstimatePrice}
                    disabled={estimatingPrice}
                >
                    {estimatingPrice ? (
                        <img src="/src/assets/icons/IconLoading.svg" width={14} height={14} alt="" />
                    ) : priceError ? (
                        <img src="/src/assets/icons/IconRetry.svg" width={14} height={14} alt="" />
                    ) : (
                        <img src="/src/assets/icons/IconLamp.svg" width={14} height={14} alt="" />
                    )}
                    
                    {estimatingPrice 
                        ? "Выполняется запрос" 
                        : priceError 
                            ? "Повторить запрос" 
                            : "Узнать рыночную цену"}
                </button>
            </div>
            {showPriceError && <p className="error-text">Поле должно быть заполнено</p>}

            <p className="card-edit-page-title-p">Характеристики</p>
            <div className="characteristics-edit">
                {renderParams()}
            </div>

            <p className="card-edit-page-title-p">Описание</p>
            <textarea
                className='textarea'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введите описание..."
                rows={6}
            />
            <button 
                className="ai-improve-description" 
                onClick={handleImproveDescription}
                disabled={improvingDesc}
            >
                {improvingDesc ? (
                    <img src="/src/assets/icons/IconLoading.svg" width={14} height={14} alt="" />
                ) : improveError ? (
                    <img src="/src/assets/icons/IconRetry.svg" width={14} height={14} alt="" />
                ) : (
                    <img src="/src/assets/icons/IconLamp.svg" width={14} height={14} alt="" />
                )}
                
                {improvingDesc 
                    ? "Выполняется запрос" 
                    : improveError 
                        ? "Повторить запрос" 
                        : "Улучшить описание"}
            </button>

            <div className="buttons">
                <button 
                    className="btn-save" 
                    onClick={handleSave}
                    disabled={!canSave || saving}
                >
                    {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button className="btn-cancel" onClick={() => navigate(`/item/${id}`)}>
                    Отменить
                </button>
            </div>

            {showSuccess && <SuccessSaved />}
            {showError && <UnSuccessSaved />}

            <Modal
                isOpen={showPriceModal}
                onClose={() => setShowPriceModal(false)}
                title="Рекомендуемая рыночная цена"
                onApply={handleApplyPrice}
            >
                {priceResult}
            </Modal>

            <Modal
                isOpen={showImproveModal}
                onClose={() => setShowImproveModal(false)}
                title="Улучшенное описание"
                onApply={handleApplyImprovedDescription}
            >
                {improvedDescription}
            </Modal>
        </div>
    );
}

export default CardEditPage