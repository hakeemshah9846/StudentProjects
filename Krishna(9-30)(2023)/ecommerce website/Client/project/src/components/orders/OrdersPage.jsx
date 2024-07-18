import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './orders.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('accessTocken');
        const response = await axios.get('http://localhost:443/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setOrders(response.data);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [currentPage, pageSize]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('accessTocken');
      const response = await axios.delete(`http://localhost:443/deleteproduct/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response && response.status === 200) {
        toast.success('Product deleted successfully', { className: 'custom-toast' });
        fetchOrders();
      } else {
        console.error('Failed to delete Product. Response:', response);
      }
    } catch (error) {
      console.error('Error deleting Product:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      console.log('No more pages available');
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      console.log('No more pages available');
    }
  };

  const handleUpdateDeliveryStatus = async (id) => {
    try {
      const token = localStorage.getItem('accessTocken');
      const response = await axios.put(
        `http://localhost:443/orders/${id}/deliver`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success('Order marked as delivered', { className: 'custom-toast' });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, isDelivered: true } : order
          )
        );
      } else {
        console.error('Failed to update delivery status. Response:', response);
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    return order.user?.username.toLowerCase().includes(search.toLowerCase());
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className='bguserli'>
      <div className="container">
        <h2 className="list">All Orders</h2>
        <div className="header_wrap">
          <div className="num_rows">
            <div className="form-group">
              <select
                className="form-control"
                name="state"
                id="maxRows"
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={12}>12</option>
                <option value={100}>Show ALL Rows</option>
              </select>
            </div>
          </div>
          <div className="tb_search">
            <input
              type="text"
              id="search_input_all"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search.."
              className="form-control"
            />
          </div>
        </div>
        <table className="table table-striped table-class" id="table-id">
          <thead>
            <tr>
              <th>Order Items</th>
              <th>Order ID</th>
              <th>User</th>
              <th>Order Date</th>
              <th>Total Price</th>
              <th>Paid</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order._id}>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {order.orderItems.map(item => (
                      <img
                        key={item._id}
                        src={item.image}
                        alt={item.name}
                        style={{ maxWidth: '50px', borderRadius: '5px' }}
                      />
                    ))}
                  </div>
                </td>
                <td>{order._id}</td>
                <td>{order.user?.username || 'Unknown User'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>
                  <button type="button" className={`btnn ${order.isPaid ? 'paid' : 'pending'}`}>
                    {order.isPaid ? 'Completed' : 'Pending'}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={`btnn ${order.isDelivered ? 'paid' : 'pending'}`}
                    onClick={() => handleUpdateDeliveryStatus(order._id)}
                  >
                    {order.isDelivered ? 'Completed' : 'Pending'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ToastContainer />
        <div className="pagination">
          <button onClick={handlePreviousPage}><span className="material-symbols-outlined">arrow_back_ios</span></button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage}><span className="material-symbols-outlined">chevron_right</span></button>
        </div>
        <div className="rows_count">
          Showing {Math.min((currentPage - 1) * pageSize + 1, filteredOrders.length)} to{' '}
          {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length}{' '}
          entries
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
