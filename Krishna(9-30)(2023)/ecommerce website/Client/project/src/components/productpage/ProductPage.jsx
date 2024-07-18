import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCartContext } from '../../context/cartContext';
import './product.css';

function ProductPage() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [Qty, setQuantity] = useState(1);
  const { addToCart } = useCartContext();
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    user: 'Anonymous' // Assuming you have user info
  });

  const getProductDetails = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(`http://localhost:443/getProduct/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setProductDetails(res.data.data.product);
        setReviews(res.data.data.product.reviews || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...productDetails, qty: Qty });
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    setNewReview((prevReview) => ({ ...prevReview, rating }));
  };

  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, comment: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId'); // Assuming you store the user's ID in local storage
      const userEmail = localStorage.getItem('userEmail');
            
      const reviewToSubmit = {
        ...newReview,
        user: userId || 'Anonymous' ,
        userEmail:userEmail || 'Anonymous'
      };

      if (!reviewToSubmit.rating || reviewToSubmit.rating < 1 || reviewToSubmit.rating > 5) {
        console.error('Invalid rating');
        return;
      }
      if (!reviewToSubmit.comment) {
        console.error('Comment is required');
        return;
      }
      if (!reviewToSubmit.user) {
        console.error('User ID is required');
        return;
      }

      if (!reviewToSubmit.userEmail) {
        console.error('User Email is required');
        return;
      }

      await axios.post(`http://localhost:443/product/${id}/review`, reviewToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getProductDetails();

      setNewReview({ rating: 0, comment: '', user: '' });
      setSelectedRating(0);

    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  return (
    <>
      <div className="pd-wrap">
        <div className="container">
          <div className="heading-section">
            <h2>Product Details</h2>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div id="slider" className="owl-carousel product-slider">
                <div className="item">
                  <img src={productDetails?.productImage} alt="" className='w-full h-[25rem] cursor-pointer' />
                </div>
              </div>
              <div id="thumb" className="owl-carousel product-thumb">
              </div>
            </div>
            <div className="col-md-6">
              <div className="product-dtl">
                <div className="product-info">
                  <div className="product-name">{productDetails?.name}</div>
                  <div className="reviews-counter">
                    <div className="rate">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <React.Fragment key={rating}>
                          <input
                            type="radio"
                            id={`star${rating}`}
                            name="rate"
                            value={rating}
                            checked={selectedRating === rating}
                            onChange={() => handleRatingChange(rating)}
                          />
                          <label htmlFor={`star${rating}`} title={`${rating} stars`}>
                            {`${rating} stars`}
                          </label>
                        </React.Fragment>
                      ))}
                    </div>
                    <span>{reviews.length} Reviews</span>
                  </div>
                  <div className="product-price-discount">
                    <span>${productDetails?.price}</span>
                    <span className="line-through">$1399</span>
                  </div>
                </div>
                <p>100% Original Products Pay on delivery might be available Easy 14 days returns and exchanges.</p>
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="size">Size</label>
                    <select id="size" name="size" className="form-control">
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                    </select>
                  </div>
                </div>
                <div className="product-count">
                  <a href="#" onClick={handleAddToCart} className="round-black-btn">Add to Cart</a>
                </div>
              </div>
            </div>
          </div>
          <div className="product-info-tabs">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" id="description-tab" data-toggle="tab" href="#description" role="tab" aria-controls="description" aria-selected="true">
                  Description
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="review-tab" data-toggle="tab" href="#review" role="tab" aria-controls="review" aria-selected="false">
                  Reviews ({reviews.length})
                </a>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
              </div>
              <div className="tab-pane fade" id="review" role="tabpanel" aria-labelledby="review-tab">
                <div className="review-heading">REVIEWS</div>
                {reviews.length === 0 ? (
                  <p className="mb-20">There are no reviews yet.</p>
                ) : (
                  reviews.map((review, index) => (
                    <div key={index} className="review">
                      <div className="review-author"><h3>{review.userEmail}</h3></div>
                      <div className="review-rating"><h6>{review.rating} stars</h6></div>
                      <div className="review-comment"><p className='mess'>{review.comment}</p></div>
                    </div>
                  ))
                )}
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label>Your rating</label>
                    <div className="reviews-counter">
                      <div className="rate">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <React.Fragment key={rating}>
                            <input
                              type="radio"
                              id={`star${rating}`}
                              name="rate"
                              value={rating}
                              checked={selectedRating === rating}
                              onChange={() => handleRatingChange(rating)}
                            />
                            <label htmlFor={`star${rating}`} title={`${rating} stars`}>
                              {`${rating} stars`}
                            </label>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Your message</label>
                    <textarea
                      className="form-control"
                      rows={10}
                      value={newReview.comment}
                      onChange={handleReviewChange}
                      required
                    />
                  </div>
                  <button type="submit" className="round-black-btn">
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-container container">
          <div className="content_1">
            <img src='/landing/logo.png' alt="" />
            <samp className='bebas-neue-regular1'>Click</samp>
            <samp className='lugrasimo-regular'>Shop</samp>
            <p>
              The customer is at the heart of our
              <br />
              unique business model, which includes
              <br />
              design.
            </p>
            <img src="https://i.postimg.cc/Nj9dgJ98/cards.png" alt="cards" />
          </div>
          <div className="content_2">
            <h4>SHOPPING</h4>
            <a href="#sellers">Clothing Store</a>
            <a href="#sellers">Trending Shoes</a>
            <a href="#sellers">Accessories</a>
            <a href="#sellers">Sale</a>
          </div>
          <div className="content_3">
            <h4>SHOPPING</h4>
            <a href="./contact.html">Contact Us</a>
            <a href="https://payment-method-sb.netlify.app/" target="_blank">
              Payment Method
            </a>
            <a href="https://delivery-status-sb.netlify.app/" target="_blank">
              Delivery
            </a>
            <a href="https://codepen.io/sandeshbodake/full/Jexxrv" target="_blank">
              Return and Exchange
            </a>
          </div>
          <div className="content_4">
            <h4>NEWLETTER</h4>
            <p>
              Be the first to know about new
              <br />
              arrivals, look books, sales & promos!
            </p>
            <div className="f-mail">
              <input type="email" placeholder="Your Email" />
              <i className="bx bx-envelope" />
            </div>
            <hr />
          </div>
        </div>
        <div className="f-design">
          <div className="f-design-txt container">
            <p>
              Copyright ©2023 All rights reserved | This template is made with{' '}
              <i className="bx bxs-heart" /> by <a href="#sellers">SBI Clothing</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default ProductPage;
