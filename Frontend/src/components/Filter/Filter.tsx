import { useState } from 'react'
import './Filter.css'

interface FilterProps {
    selectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    onlyNeedsRevision: boolean;
    setOnlyNeedsRevision: (value: boolean) => void;
    onApplyFilters: () => void;
}

const Filter = ({
    selectedCategories,
    setSelectedCategories,
    onlyNeedsRevision,
    setOnlyNeedsRevision,
    }: FilterProps) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(true)

    const categories = [
        { id: 'auto', label: 'Авто' },
        { id: 'electronics', label: 'Электроника' },
        { id: 'real_estate', label: 'Недвижимость' },
    ]

    const toggleCategory = (id: string) => {
        setSelectedCategories((prev: string[]) => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
    }

    return (
        <div className="filter">
            <h3>Фильтры</h3>

            <div className="filter__section">
                <div className="filter__header">
                <p className="filter__title">Категория</p>

                <button 
                className="button_accordion" 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                > 
                    <span className={`filter__arrow ${isCategoryOpen ? 'open' : ''}`}>
                    <img 
                        src="/src/assets/icons/Down.svg" 
                        alt="arrow down" 
                        className="filter__arrow-icon"
                        width={12} height={9}
                    />
                    </span>
                </button> 
                </div>

                {isCategoryOpen && (
                <div className={`filter__content ${isCategoryOpen ? 'open' : ''}`}>
                    <div className="filter__checkbox-group">
                        {categories.map(({ id, label }) => (
                            <label key={id} className="filter__checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(id)}
                                    onChange={() => toggleCategory(id)}
                                />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                </div>
                )}
            </div>

            <div className='line'> </div>

            <div className='refinement_switch'>
                <h4 className='refinement_switch_h4'> Только требующие доработок </h4>
                <label className='switch'> 
                    <input
                        type="checkbox"
                        checked={onlyNeedsRevision}
                        onChange={(e) => setOnlyNeedsRevision(e.target.checked)}
                    />
                    <span className='move'> </span>
                </label>
            </div>
                

        </div>
    )
}

export default Filter