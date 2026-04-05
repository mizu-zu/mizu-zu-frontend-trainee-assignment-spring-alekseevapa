import "./ButtonResetFilter.css"

interface ButtonResetFilterProps {
    resetFilters: () => void;
}

const ButtonResetFilter = ({resetFilters}: ButtonResetFilterProps) => {
    return (
        <button className="buttonresetfilter"
        onClick={resetFilters}>
            <p> Сбросить фильтры </p>
        </button>
    )
}

export default ButtonResetFilter