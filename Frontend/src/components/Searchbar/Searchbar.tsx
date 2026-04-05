import Sorting from '../Sorting/Sorting'
import './Searchbar.css'

interface SearchbarProps {
    onSearchInput: (value:string)=>void;
    searchQuery: string;
    setSearchQuery: (value:string)=>void;
    sort: {
        column: 'title' | 'createdAt' | 'price';
        direction: 'asc' | 'desc';
    };
    onSortChange: (column: 'title' | 'createdAt' | 'price', direction: 'asc' | 'desc') => void;
}

const Searchbar = ({onSearchInput, searchQuery, setSearchQuery, sort, onSortChange}: SearchbarProps) => {
     
    const handleSearch = () => {
        const trimQuery = searchQuery.trim();
        onSearchInput(trimQuery);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
        handleSearch();
        }
    };

    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        setSearchQuery(target.value);
    };


    return (
        <div className = "search_bar">
            <div className='search_bar__input'>
            <input 
            className = "searchbarinput"
            placeholder='Найти объявление....'
            type="text"
            onKeyDown={handleKeyDown}
            value={searchQuery}
            onInput={handleInput}
            />
            <button className="icon-wrapper" onClick={handleSearch}> <img src="/src/assets/icons/icon-wrapper.svg" alt="appstore"/> </button>
            </div>
            <div className = "switch_label">
                <img src="/src/assets/icons/Appstore.svg" alt="appstore" width={15} height={15} />
                <img src="/src/assets/icons/Line.svg" alt="line" width={2} height={17} />
                <img src="/src/assets/icons/UnorderedList.svg" alt="list" width={15} height={15} />
            </div>
            <Sorting sort={sort} onSortChange={onSortChange}/>
        </div>
    )
}

export default Searchbar