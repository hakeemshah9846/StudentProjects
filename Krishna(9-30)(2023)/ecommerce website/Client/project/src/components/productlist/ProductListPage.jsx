import React, { useEffect, useState } from 'react';
import './productlist.css';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ProductListPage = () => {
  const params = useParams();
  const [product, setProduct] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [search, setSearch] = useState('');
  const [value, setValue] = useState('all');


  const token = !!localStorage.getItem('accessTocken');

  if (!token) {
    return null;
  }

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessTocken');
      const response = await axios.get(`http://localhost:443/getAllProduct?category=${value}&page=${currentPage}&pageSize=${pageSize}&search=${search}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const responseData = response.data.data;
      setProduct(responseData.product);
      setTotalPages(responseData.totalPages);
      setCurrentPage(responseData.currentPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, search]);

  const handleEditUser = (id) => {
    setSelectedUserId(id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('accessTocken');
      const response = await axios.delete(`http://localhost:443/deleteproduct/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response && response.status === 200) {
        console.log("Product deleted successfully");
        // alert("Product deleted successfully");
        toast.success('Product deleted successfully',{
          className: 'custom-toast' });
        fetchData();
      } else {
        console.error("Failed to delete Product. Response:", response);
      }
    } catch (error) {
      console.error("Error deleting Product:", error);
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

    getPagination('#table-id');
	$('#maxRows').trigger('change');
	function getPagination (table){

		  $('#maxRows').on('change',function(){
		  	$('.pagination').html('');						// reset pagination div
		  	var trnum = 0 ;									// reset tr counter 
		  	var maxRows = parseInt($(this).val());			// get Max Rows from select option
        
		  	var totalRows = $(table+' tbody tr').length;		// numbers of rows 
			 $(table+' tr:gt(0)').each(function(){			// each TR in  table and not the header
			 	trnum++;									// Start Counter 
			 	if (trnum > maxRows ){						// if tr number gt maxRows
			 		
			 		$(this).hide();							// fade it out 
			 	}if (trnum <= maxRows ){$(this).show();}// else fade in Important in case if it ..
			 });											//  was fade out to fade it in 
			 if (totalRows > maxRows){						// if tr total rows gt max rows option
			 	var pagenum = Math.ceil(totalRows/maxRows);	// ceil total(rows/maxrows) to get ..  
			 												//	numbers of pages 
			 	for (var i = 1; i <= pagenum ;){			// for each page append pagination li 
			 	$('.pagination').append('<li data-page="'+i+'">\
								      <button classname="num">'+ i++ +'<button class="sr-only">(current)</button></button>\
								    </li>').show();
			 	}											// end for i 
     
         
			} 												// end if row count > max rows
			$('.pagination li:first-child').addClass('active'); // add active class to the first li 
        
        
        //SHOWING ROWS NUMBER OUT OF TOTAL DEFAULT
       showig_rows_count(maxRows, 1, totalRows);
        //SHOWING ROWS NUMBER OUT OF TOTAL DEFAULT

        $('.pagination li').on('click',function(e){		// on click each page
        e.preventDefault();
				var pageNum = $(this).attr('data-page');	// get it's number
				var trIndex = 0 ;							// reset tr counter
				$('.pagination li').removeClass('active');	// remove active class from all li 
				$(this).addClass('active');					// add active class to the clicked 
        
        
        //SHOWING ROWS NUMBER OUT OF TOTAL
       showig_rows_count(maxRows, pageNum, totalRows);
        //SHOWING ROWS NUMBER OUT OF TOTAL
        
        
        
				 $(table+' tr:gt(0)').each(function(){		// each tr in table not the header
				 	trIndex++;								// tr index counter 
				 	// if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
				 	if (trIndex > (maxRows*pageNum) || trIndex <= ((maxRows*pageNum)-maxRows)){
				 		$(this).hide();		
				 	}else {$(this).show();} 				//else fade in 
				 }); 										// end of for each tr in table
					});										// end of on click pagination list
		});
											// end of on select change 
		 
								// END OF PAGINATION 
    
	}	


			

// SI SETTING
$(function(){
	// Just to append id number for each row  
default_index();
					
});

//ROWS SHOWING FUNCTION
function showig_rows_count(maxRows, pageNum, totalRows) {
   //Default rows showing
        var end_index = maxRows*pageNum;
        var start_index = ((maxRows*pageNum)- maxRows) + parseFloat(1);
        var string = 'Showing '+ start_index + ' to ' + end_index +' of ' + totalRows + ' entries';               
        $('.rows_count').html(string);
}

// CREATING INDEX
function default_index() {
  var table = $('#table-id');
  var thExist = table.find('th:contains("ID")');
  if (thExist.length > 0) {
    thExist.remove(); // Remove existing <th> ID </th> element
  }

  table.find('tr:gt(0)').each(function(index) {
    var curElem = $(this).find('td:first-child');
    var productImage = curElem.data('product-image'); // Get the value of data-product-image attribute
    if (productImage) {
      // If data-product-image attribute exists
      curElem.html(`<img src="${productImage}" alt="" className='avatar1' />`);
    }
  });
}



function FilterkeyWord_all_table() {
  // Count td if you want to search on all table instead of specific column
  var count = $('.table').children('tbody').children('tr:first-child').children('td').length; 

  // Declare variables
  var input = document.getElementById("search_input_all");
  var filter = input.value.toLowerCase();
  var table = document.getElementById("table-id");
  var tr = table.getElementsByTagName("tr");

  if (filter !== '') {
    for (var i = 0; i < tr.length; i++) {
      var flag = 0;
      for (var j = 0; j < count; j++) {
        var td = tr[i].getElementsByTagName("td")[j];
        if (td) {
          var td_text = td.innerHTML.toLowerCase();  
          if (td_text.indexOf(filter) > -1) {
            flag = 1;
          }
        }
      }
      tr[i].style.display = flag === 1 ? "" : "none";
    }
  } else {
    // RESET TABLE
    $('#maxRows').trigger('change');
  }
}


  const handleSearch = () => {
    fetchData();
  };

  return (
    <>
<div className='bguserli'>
<div className="container">
<h2 className="list">Product List</h2>
  <div className="header_wrap">
    <div className="num_rows">
      <div className="form-group">
        {" "}
        {/*		Show Numbers Of Rows 		*/}
        <select className="form-control" name="state" id="maxRows">
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
  onChange={FilterkeyWord_all_table} // Use onChange event instead of onkeyup
  placeholder="Search.."
  className="form-control"
/>

    </div>
  </div>
   <table className="table table-striped table-class" id="table-id">
            <thead>
              <tr>
                <th>Product</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Location</th>
                <th>Description</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {product?.map((curElem) => (
                <tr key={curElem._id}>
                  <td><img src={curElem.productImage} alt="" className='avatar1' /></td>
                  <td>{curElem.name}</td>
                  <td>{curElem.price}</td>
                  <td>{curElem.category}</td>
                  <td>{curElem.stock}</td>
                  <td>{curElem.location}</td>
                  <td>{curElem.description}</td>

                  <td>
                    <button onClick={() => handleDelete(curElem._id)} type="button" className="btn btn-primary"><span className="material-symbols-outlined">delete</span></button>
                  </td>
                 
                </tr>
                
              ))}
 <ToastContainer />
            </tbody>
          </table>
  {/*		Start Pagination */}
  <div className="pagination">
          <button onClick={handlePreviousPage}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage}>Next</button>
        </div>
  <div className="rows_count">Showing 11 to 20 of 91 entries</div>
</div>
</div>
    </>
  );
};

export default ProductListPage;
