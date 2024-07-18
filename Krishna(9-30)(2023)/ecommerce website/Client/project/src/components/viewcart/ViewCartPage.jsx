import React, { useEffect, useState } from 'react';
import { useCartContext } from '../../context/cartContext';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import './viewcart.css';
import { useUserContext } from '../../context/userContext';

function ViewCart() {
  const { cartItems } = useCartContext();
  const { user } = useUserContext(); 
  const [userId, setUserId] = useState(user?.user_id || localStorage.getItem('userId'));

  useEffect(() => {
    if (user?.user_id) {
      setUserId(user.user_id);
      localStorage.setItem('userId', user.user_id);
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

  const itemsPrice = cartItems.reduce((a, c) => a + (c.qty * c.price || 0), 0);
  const shippingPrice = itemsPrice > 2000 ? 0 : 20;
  const totalPrice = itemsPrice + shippingPrice;

  return (
    <div className={cartItems.length === 0 ? "bg-gray-100 h-96" : "bg-gray-100"}>
      <div className="container mx-auto py-6">
        <div className="w-full bg-white px-10 py-5 text-black rounded-md">
          <div className="flex justify-between border-b pb-8">
            <h2>My <span className="prodects-h">Cart</span></h2>
            <h1 className="font-semibold text-2xl">
              <span className="prodects-h">Items:</span> {cartItems.length || 0}
            </h1>
          </div>
          <table className="table table-striped table-class" id="table-id">
            <thead>
              <tr className="tablerow">
                <th className="tablehead">Product</th>
                <th>ProductName</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((product) => (
                <CartProduct key={product.id} product={product} />
              ))}
            </tbody>
          </table>
          <div className={cartItems.length === 0 ? "mx-auto hidden items-end justify-center px-6 flex-col" : "mx-auto justify-center items-end px-6 flex-col"}>
            <div className='text-right mb-2 font-semibold text-red-900'>
              Shipping: {shippingPrice.toFixed(2)}
            </div>
            <div className='text-right mb-2 font-semibold text-red-900'>
              Total Price: {totalPrice.toFixed(2)}
            </div>
            <div className='btn text-right justify-end ml-auto text-white hover:bg-red-600 hover:border-red-600 btn-sm bg-red-500'>
              <Link className='butviewcart' to={`/Shipping/${userId}`}>Check out</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCart;

const CartProduct = ({ product }) => {
  const { removeItem, addToCart } = useCartContext();

  // Ensure price and qty are numbers and handle potential NaN values
  const price = product.price || 0;
  const qty = product.qty || 0;
  const totalPrice = price * qty;

  return (
    <tr>
      <td><img className='viewcartimg' src={product?.productImage} alt={product.name} /></td>
      <td>{product.name}</td>
      <td>
        <span className='flex items-center space-x-4 btt'>
          <div className='shadow-sm text-white bg-red-500 hover:bg-red-700 cursor-pointer p-4 rounded-full relative' onClick={() => removeItem(product)}>
            <AiOutlineMinus size={20} className='absolute font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
          </div>
          <span className="text-red-500 px-3 py-2 bg-slate-100 text-lg font-medium">
            {qty}
          </span>
          <div className='shadow-sm text-white bg-red-500 hover:bg-red-700 cursor-pointer p-4 rounded-full relative' onClick={() => addToCart(product)}>
            <AiOutlinePlus size={20} className='absolute font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
          </div>
        </span>
      </td>
      <td>{product?.category}</td>
      <td>{price.toFixed(2)} x {qty}</td>
      <td>{!isNaN(totalPrice) ? totalPrice.toFixed(2) : '0.00'}</td>
    </tr>
  );
};
