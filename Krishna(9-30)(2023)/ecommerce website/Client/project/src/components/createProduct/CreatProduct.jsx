import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import './createproduct.css';


function CreateProductPage() {
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);
  
    const handleImage = async (e) => {
      const file = e.target.files[0];
      let formData = new FormData();
      formData.append('image', file);
      setUploading(true);
      
      try {
        const { data } = await axios.post("http://localhost:443/upload-image", formData);
        setUploading(false);
        setImage({
          url: data.url,
          public_id: data.public_id
        });
        
        if (uploading === false) {
          // alert("Successfully uploaded");
          toast.success('Successfullyuploaded',{
            className: 'custom-toast' });
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    const handleSubmit = async (e) => {  
      e.preventDefault();
      const form = e.target;
      const name = form.name.value;
      const price = form.price.value;
      const category = form.category.value;
      const stock = form.stock.value;
      const location = form.location.value;
      const description = form.description.value;
      const productImage = image?.url;
      const productData = { name, price, category, stock, location, description, productImage };
  
      try {
        const token = localStorage.getItem('accessTocken');
        const res = await axios.post("http://localhost:443/addproduct", productData, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
  
        if (res.data.success) {
            console.log(res.data.message); 
            // alert("Successfully Created");
            toast.success('SuccessfullyCreated',{
              className: 'custom-toast' });
            form.reset()
        } else {
            console.error(res.data.message); 
        }
      } catch (error) {
        console.log(error);
        console.error("Failed to add product",error.response ? error.response.data.message : error.message);
      }
    }
  
    return (
      <>
        <div className='addprodectbg'>
          <div className='addproduct'>
            <div className='w-full mx-auto pt-[16vh]'>
              <form className='ease-in duration-300' onSubmit={handleSubmit}>
                <h1 className="bebas-neue-regular">Create Product</h1>
                <div className="grid grid-cols-2 sm:grid-cols-2 items-center gap-4">
                  <input type="text" name='name' placeholder='Enter product name' />
                  <input type="file" name='myFile' className="file-input" onChange={handleImage} />
                  <input type="number" name='price' placeholder='Enter price' />
                  <select className="select" name='category' defaultValue="default">
                    <option value="default" disabled>Category</option>
                    <option value="Men">Men's</option>
                    <option value="Women">Women's</option>
                    <option value="Kids">Kids</option>
                  </select>
                  <input type="number" name='stock' placeholder='Enter stock' />
                  <input type="text" name='location' placeholder='Enter location' />
                  <textarea className="textarea" name='description' placeholder="Enter description"></textarea>
                </div>
                <button className='add-product-btn' type='submit'>Add Product</button>
                <ToastContainer />
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  export default CreateProductPage;
