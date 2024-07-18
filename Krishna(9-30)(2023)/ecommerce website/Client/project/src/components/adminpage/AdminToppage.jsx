import React, { useEffect, useState }  from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './admin.css';
import { useCartContext } from '../../context/cartContext';
import { useFavoriteContext } from '../../context/favoriteContext';



function AdminToppage() {
  const [product, setProduct] = useState([]);
  const [value, setValue] = useState('all');


  const { addToCart } = useCartContext();
  const { addToFavorite } = useFavoriteContext();








  const handleBtn = (btn) => {
    setActive(btn.id);
    setValue(btn.value);
  };
  const params = useParams()

  const getTopProducts = async () => {
    try {
      const token = localStorage.getItem('accessTocken');
      const res = await axios.get(`http://localhost:443/getTopRated`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setProduct(res.data.data.product);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(product);
  useEffect(() => {
    getTopProducts()
  }, [value])

  const handleAddToCart = (productDetails) => {
    addToCart({ ...productDetails, qty: 1 });
  };

  
  const handleAddToFavorite = (productDetails) => {
    addToFavorite({ ...productDetails, qty: 1 });
  };


  return (
    <>


  <section id="sellers">
    <div className="seller container">
      <h2>Recommended<span className='prodects-h' >Products</span> </h2>
      <section id="sellers">
  <div className="seller container">
    <div className="best-seller">
      <div className="row">
        {
          product?.map((curElem) => (
            <div key={curElem._id} className="col-lg-4 col-md-6 col-sm-12">
              <div className="best-p1">
                <div className="relative mb-3">
                  <Link  to={`/product/${curElem?._id}`}> <img   src={curElem.productImage} alt="" /></Link> 
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
                    ${curElem.price}
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
          ))
        }
      </div>
    </div>
  </div>
</section>
    </div>
  
  </section>

 
    </>
  );
}

export default AdminToppage;