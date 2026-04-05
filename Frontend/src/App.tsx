import { useState, useEffect } from "react"
import Searchbar from "./components/Searchbar/Searchbar"
import Filter from "./components/Filter/Filter"
import ButtonResetFilter from "./components/ButtonResetFilter/ButtonResetFilter"
import Card from "./components/Card/Card"
import type { ItemsGetParams, ItemsGetOut } from "./client"
import { getItems, getTotalItemsCount } from "./client";
import Left from "./assets/icons/Left.svg"
import Right from "./assets/icons/Right.svg"

import "./styles/app.css"

const App = () => {
  const [data, setData] = useState<ItemsGetOut | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0);

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false);

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, SetCurrentPage] = useState(1)

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [onlyNeedsRevision, setOnlyNeedsRevision] = useState(false);

  const [sort, setSort] = useState<{
    column: 'title' | 'createdAt' | 'price';
    direction: 'asc' | 'desc';
  }>({
    column: 'createdAt',
    direction: 'desc'
  });

  useEffect(() => {
    loadItems(searchQuery, 1);
  }, [selectedCategories, onlyNeedsRevision, sort, searchQuery]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        
        const [itemsResult, total] = await Promise.all([
          getItems({
            limit: limitAdds,
            skip: 0,
            sortColumn: sort.column === 'price' ? 'createdAt' : sort.column,
            sortDirection: sort.direction,
          }),
          getTotalItemsCount()
        ]);

        setTotalCount(total);

        if (sort.column === 'price') {
          const sortedItems = [...itemsResult.items].sort((a, b) => 
            sort.direction === 'asc' ? a.price - b.price : b.price - a.price
          );
          setData({ ...itemsResult, items: sortedItems });
        } else {
          setData(itemsResult);
        }

        SetCurrentPage(1);
      } catch (err: any) {
        setError(err.message || 'Ошибка при загрузке');
        setData(null);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };

    init();
  }, []);

  const limitAdds: number = 10;

  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / limitAdds);

  const loadItems = async (query: string = "", page: number = 1) => {
      try {
        setIsSearching(true);
        setError(null);

        const skip = (page - 1) * limitAdds;

        const result = await getItems({
          q: query.trim() || undefined,
          limit: limitAdds,
          skip: skip,
          categories: selectedCategories.length > 0 ? selectedCategories as any : undefined,
          needsRevision: onlyNeedsRevision || undefined,
          sortColumn: sort.column === 'price' ? 'createdAt' : sort.column,
          sortDirection: sort.direction,
        })
        
        if (sort.column === 'price') {
        const sortedItems = [...result.items].sort((a, b) => {
          return sort.direction === 'asc' 
            ? a.price - b.price 
            : b.price - a.price;
          });

          setData({
            ...result,
            items: sortedItems
          });
        } else {
          setData(result);
        }

        SetCurrentPage(page);
      }

      catch (error: any) {
        setError(error.message || 'Ошибка при загрузке объявлений')
        setData(null)
      }

      finally {
        setIsSearching(false)
        setLoading(false)
      }
  }

  const FilterAdds = (query: string) => {
    setSearchQuery(query);
    loadItems(query, 1);
  }

  const applyFilters = () => {
    loadItems(searchQuery, 1)
  }

  const resetFilters = () => {
    setSelectedCategories([]);
    setOnlyNeedsRevision(false);
    setSearchQuery("");
  } 

  const onSortChange = (column: 'title' | 'createdAt' | 'price', direction: 'asc' | 'desc') => {
    setSort({ column, direction });
  };

  const GoToPage = (page: number) => {
    if (page < 1 || page > totalPages) return; 
    loadItems(searchQuery, page);
  }

  const GoToPrev = () => GoToPage(currentPage - 1)
  const GoToNext = () => GoToPage(currentPage + 1)

  const getPageNumbers = (): number[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, currentPage + 2)

    if (end - start + 1 < 5) {
        if (start === 1) end = 5;
        else start = totalPages - 4;
    }

    return Array.from({length: end - start + 1}, (_, i) => start + i)
  }

  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="app">

      <div className="Titles">
        <h1 className="h1Title"> Мои объявления</h1>
        <h2 className="h2Title"> {loading ? 'Загрузка...' : `${totalCount} объявлени${totalCount === 1 ? 'е' : totalCount < 5 ? 'я' : 'й'}`} </h2>
      </div>

      <Searchbar 
        onSearchInput={FilterAdds} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 

        sort={sort}
        onSortChange={onSortChange}/>

      <div className="app__filter_card">

        <div className="app__filter">
          <Filter 
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            onlyNeedsRevision={onlyNeedsRevision}
            setOnlyNeedsRevision={setOnlyNeedsRevision}
            onApplyFilters={applyFilters}/>
          <ButtonResetFilter 
          resetFilters={resetFilters}/>
        </div>
        
        {/* data = {items:[{}, {}...], total:n} */}
        <div className="cards__pagination">
        <div className="cards">
          {isSearching && <div className="loading"> <p> Загрузка объявлений... </p></div>}
          {error && !isSearching && <p className="error-message">Ошибка: {error}</p>}
          { !isSearching && data && data.items.length > 0 && 
          data?.items.map((item, index) =>
          (<Card 
          key={index} 
          CategoryProduct={item.category} 
          NameProduct={item.title} 
          PriceProduct={item.price} 
          NeedRevision={item.needsRevision} 
          IdProduct={item.id}
          />))}

          {!isSearching && data && data.items.length === 0 && (
          <p className="not_found"> По вашему запросу ничего не найдено</p>
          )}
        </div>

        {!isSearching && totalPages >= 1 && (
          <div className="pagination">
            <button className="pagination__button" onClick={GoToPrev} disabled={currentPage === 1}>
            <img src={Left} alt='Left' height={12} width={12}/>
            </button>

            {getPageNumbers().map((page) => (
              <button key={page}
              className={`pagination__button ${currentPage === page ? 'active' : '' } ` }
              onClick={() => GoToPage(page)}
              >
              {page}
              </button>
            )
            )}  

            <button className="pagination__button" onClick={GoToNext} disabled={currentPage === totalPages}>
            <img src={Right} alt='Right' height={12} width={12}/>
            </button>
          </div>
          )} 
        </div>
            
        </div>

       
    </div>
  )

}

export default App
