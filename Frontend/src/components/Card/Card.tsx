import "./Card.css"
import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

interface CardProps {
        NameProduct: string;
        PriceProduct: number;
        CategoryProduct: string;
        NeedRevision: boolean;   
        IdProduct: number;         
    }

const Card = ({NameProduct, PriceProduct, CategoryProduct, NeedRevision, IdProduct} : CardProps) => {

    const Categories: Record<typeof CategoryProduct, string> = {
        auto: "Авто",
        real_estate: "Недвижимость",
        electronics: "Электроника",
    }

    const Navigate = useNavigate()

    const ToNextPage = () => {
        Navigate(`/item/${IdProduct}`)
    }
    
    return (
        <div className="card" onClick={ToNextPage}>
            <img src="/src/assets/icons/cover.svg" className="card__img" />
            <div className="categoryproduct"> {Categories[CategoryProduct] ?? "Другая категория"} </div>
            <div className="card__text">
                <p className="nameproduct_p"> {NameProduct.length <= 18 ? NameProduct : NameProduct.slice(0, 19) + "..."} </p>
                <p className="priceproduct_p"> {PriceProduct} ₽ </p>
            </div>

            {NeedRevision ? 
            <div className="revision"> 
                <div className="revision_circle"></div>
                <p> Требует доработок </p>
            </div>
            : <></>} 
            
        </div>
    )
}

export default Card