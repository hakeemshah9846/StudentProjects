import React from 'react';
import { useFavoriteContext } from '../../context/favoriteContext';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import './viewfavorite.css';

function ViewFavoritePage() {
  const { favoriteItems, removeFromFavorite, addToFavorite } = useFavoriteContext();
  const itemsPrice = favoriteItems.reduce((a, c) => a + c.qty * c.price, 0);
  const shippingPrice = itemsPrice > 2000 ? 0 : 20;
  const totalPrice = itemsPrice + shippingPrice;

  return (
    <div className={favoriteItems.length === 0 ? "bg-gray-100 h-96" : "bg-gray-100"}>
      <div className="container mx-auto py-6">
        <div className="w-full bg-white px-10 py-5 text-black rounded-md">
          <div className="flex justify-between border-b pb-8">
            <h2>
          My <span className="prodects-h">Favorites</span>
        </h2>
            <h1 className="font-semibold text-2xl"><span className="prodects-h">Items:</span>{favoriteItems.length}</h1>
          </div>
          <div className="best-seller">
            <div className="row">
              {favoriteItems.map((product) => (
                <div key={product._id} product={product} className="col-lg-4 col-md-6 col-sm-12">
                  <div className="best-p1">
                    <div className="relative mb-3">
                      <Link to={``}>
                        <img className='favoriteimg' src={product?.productImage} alt="" height="20" />
                      </Link>
                      <div className="best-p1-txt">
                        <div className="name-of-p">
                          <p>{product.name}</p>
                        </div>
                        <div className="rating">
                          <i className="bx bxs-star" />
                          <i className="bx bxs-star" />
                          <i className="bx bxs-star" />
                          <i className="bx bxs-star" />
                          <i className="bx bx-star" />
                        </div>
                        <div className="price">
                          ₹{product.price}
                          <div className="colors">
                            <i className="bx bxs-circle brown" />
                            <i className="bx bxs-circle green" />
                            <i className="bx bxs-circle blue" />
                          </div>
                        </div>
                        <div className="buy-now">
                          {/* <button className='favo' onClick={() => handleAddToFavorite(curElem)}   >
            Favourite
            </button> */}
                          <button onClick={() => removeFromFavorite(product)} type="button" className="btn btn-primary2"><span className="material-symbols-outlined">delete</span></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ViewFavoritePage;






