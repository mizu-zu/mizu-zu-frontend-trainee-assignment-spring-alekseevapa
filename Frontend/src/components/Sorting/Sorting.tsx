// import React, { useState } from 'react'
import React from 'react';
import './Sorting.css'

interface SortingProps {
    sort: {
        column: 'title' | 'createdAt' | 'price';
        direction: 'asc' | 'desc';
    };
    onSortChange: (column: 'title' | 'createdAt' | 'price', direction: 'asc' | 'desc') => void;
}

const Sorting = ({ sort, onSortChange }: SortingProps) => {
    // const [selectedSort, setSelectedSort] = useState('newest')

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        switch (value) {
        case 'name_asc':
            onSortChange('title', 'asc');
            break;
        case 'name_desc':
            onSortChange('title', 'desc');
            break;
        case 'newest':
            onSortChange('createdAt', 'desc');
            break;
        case 'oldest':
            onSortChange('createdAt', 'asc');
            break;
        case 'price_asc':
            onSortChange('price', 'asc');
            break;
        case 'price_desc':
            onSortChange('price', 'desc');
            break;
        default:
            onSortChange('createdAt', 'desc');
        }
    }

    const getSelectedValue = () => {
        if (sort.column === 'title' && sort.direction === 'asc') return 'name_asc';
        if (sort.column === 'title' && sort.direction === 'desc') return 'name_desc';
        if (sort.column === 'createdAt' && sort.direction === 'desc') return 'newest';
        if (sort.column === 'createdAt' && sort.direction === 'asc') return 'oldest';
        if (sort.column === 'price' && sort.direction === 'asc') return 'price_asc';
        if (sort.column === 'price' && sort.direction === 'desc') return 'price_desc';
        return 'newest';
    }

    return (
        <div className="sorting">
        
        <select 
            className="sorting__select" 
            value={getSelectedValue()}
            onChange={handleSortChange}
            style={{ fontFamily: 'Roboto' }}
        >   
            <option value="name_asc">По названию (А-Я)</option>
            <option value="name_desc">По названию (Я-А)</option>
            <option value="newest">По новизне (сначала новые)</option>
            <option value="oldest">По новизне (сначала старые)</option>
            <option value="price_asc">По цене (сначала дешевле)</option>
            <option value="price_desc">По цене (сначала дороже)</option>

        </select>
        </div>
    )
}

export default Sorting