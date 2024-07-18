import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartContext } from '../../context/cartContext';
import { useFavoriteContext } from '../../context/favoriteContext';

import './kidscat.css';

const KidsCatpage = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCartContext();
  const { addToFavorite } = useFavoriteContext();
  const navigate = useNavigate();


  const params = useParams();

  const getTopProducts = async () =>{
    try{
    const res = await axios.get(`http://localhost:443/getNewProduct`)
    if(res.data.success){
      setProducts(res.data.data.product)
  }
}catch(error){
  console.log(error);

  }
  }


  useEffect(() => {
    getTopProducts();
  }, []);

  const handleAddToCart = (productDetails) => {
    if (!localStorage.getItem('accessTocken')) {
      navigate('/Signin');
      swal("Warning", "Login to go to Cart Page", "error");
    } else {
      addToCart({ ...productDetails, qty: 1 });
    }
  };

  const handleAddToFavorite = (productDetails) => {
    if (!localStorage.getItem('accessTocken')) {
      navigate('/Signin');
      swal("Warning", "Login to add items to your favorites", "error");
    } else {
      addToFavorite({ ...productDetails, qty: 1 });
    }
  };

  return (
    <section id="sellers">
      <div className="seller container">
        <h2>
        Kids <span className="prodects-h">Products</span>
        </h2>
        <div className="best-seller">
          <div className="row">
            {products.filter(curElem => curElem.category === 'Kids').map((curElem) => (
              <div key={curElem._id} className="col-lg-4 col-md-6 col-sm-12">
                <div className="best-p1">
                  <div className="relative mb-3">
                    <Link >
                      <img src={curElem.productImage} alt="" />
                    </Link>
                    <div className="best-p1-txt">
                      <div className="name-of-p">
                        <p>{curElem.name}</p>
                      </div>
                      <div className="rating">
                        <i className="bx bxs-star" />
                        <i className="bx bxs-star" />
                        <i className="bx bxs-star" />
                        <i className="bx bxs-star" />
                        <i className="bx bx-star" />
                      </div>
                      <div className="price">
                        ₹{curElem.price}
                        <div className="colors">
                          <i className="bx bxs-circle brown" />
                          <i className="bx bxs-circle green" />
                          <i className="bx bxs-circle blue" />
                        </div>
                      </div>
                      <div className="buy-now">
                      <button className='favo'  onClick={() => handleAddToFavorite(curElem)}   >
                      <Link to={``}>
                      Favourite
                          </Link>
                      </button>
                      <button onClick={() => handleAddToCart(curElem)}>
                      <Link to={``}>
                      Add To Cart
                          </Link>
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KidsCatpage;


