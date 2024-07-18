import React, { useEffect, useState } from 'react';
import './userlist.css';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UserListPage = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const token = !!localStorage.getItem('accessTocken');

  if (!token) {
    return null;
  }

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessTocken');
      const response = await axios.get(`http://localhost:443/getData?page=${currentPage}&pageSize=${pageSize}&search=${search}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const responseData = response.data.data;
      setData(responseData.datas);
      setTotalPages(responseData.totalPages);
      setCurrentPage(responseData.currentPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, search]);

  const handleEditUser = (userId) => {
    setSelectedUserId(userId);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessTocken');
      const response = await axios.delete(`http://localhost:443/deleteData/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response && response.status === 200) {
        console.log("User deleted successfully");
        toast.success('User deleted successfully',{
          className: 'custom-toast'
        });
        fetchData();
      } else {
        console.error("Failed to delete user. Response:", response);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      console.log("No more pages available");
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      console.log("No more pages available");
    }
  };

  const handleSearch = () => {
    fetchData();
  };

  return (
    <>
      <div className='bguserli'>
        <h2 className="list">User List</h2>
        <div className="search-container">
          <input className='search' type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className='searchbut' onClick={handleSearch}><span className="material-symbols-outlined">search</span></button>
        </div>
        <div className="table1">
          <table className="table user-list">
            <thead>
              <tr>
                <th>User</th>
                <th>UserName</th>
                <th>Email</th>
                <th>Role</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((userData) => (
                <tr key={userData._id}>
                  <td><img className="avatar1" src={userData.profileImage ? `http://localhost:443/${userData.profileImage}` : "../../../public/landing/user.webp"} alt="" /></td>
                  <td>{userData.username}</td>
                  <td>{userData.email}</td>
                  <td>{userData.type === "Admin" ? "Admin" : (userData.type === "Seller" ? "Seller" : "Buyer")}</td>
                  <td>
                    <button onClick={() => handleDelete(userData._id)} type="button" className="btn btn-primary"><span className="material-symbols-outlined">delete</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='pagination'>
            <button onClick={handlePreviousPage}><span className="material-symbols-outlined">arrow_back_ios</span></button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? 'active' : ''}
              >{page}</button>
            ))}
            <button onClick={handleNextPage}><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>
        {loading && <div>Loading...</div>}
      </div>
      <ToastContainer />
    </>
  );
};

export default UserListPage;
