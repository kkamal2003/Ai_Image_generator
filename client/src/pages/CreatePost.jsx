import React ,{ useState }from 'react'
import { json, useNavigate } from 'react-router-dom';
import * as dotenv from 'dotenv';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField , Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(
    {
      name:'',
      prompt:'',
      photo:'',
    }
  );
  const [generatingImg, setgeneratingImg] = useState(false);
  const [loading, setloading] = useState(false); 

  const generateImage = async ()=>
  {
    if(form.prompt){
      try{
        setgeneratingImg(true);
        const prompt = form.prompt;
        const response = await fetch(
          "ENTER YOUR API LINK",
          {
            method: "POST",
            headers: {
              "content-type":"application/json",
              "Authorization": "ENTER YOUR AUTHORIZATION TOKEN",
              },
            body: JSON.stringify({ inputs: prompt}), // Ensure to send the prompt data properly
          }
        );
      if (!response.ok) {
        throw new Error(`Hugging Face API request failed with status ${response.status}: ${await response.text()}`);
      }
      const blob = await response.blob();
      // Assuming you have a Blob object named 'blobData' (replace 'blobData' with the actual Blob object)
      const blobData = blob;

      // Create a FileReader to read the Blob content
      const reader = new FileReader();

      // Define the event handler when the reading is complete
      reader.onloadend = function () {
        // Get the base64 encoded data from the result property of the FileReader
        const base64Data = reader.result.split(',')[1];
        
        // Now, 'base64Data' contains the base64 representation of the Blob data
        // You can save this 'base64Data' to a file or use it as needed
        console.log(base64Data);
      };

      // Start reading the Blob as data URL (base64)
      reader.readAsDataURL(blobData);
      setForm({...form,photo:URL.createObjectURL(blobData)});
      photo:blobData;
    }catch (error){
        alert(error);
      }
      finally{
        setgeneratingImg(false);
      }
    } else{
      alert('please enter a prompt')
    }
  }

  const handleSubmit = async (e)=>
  {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setloading(true);
      try {
        const response = await fetch('https://server4-0k3l.onrender.com/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...form}),
        });
        await response.json();
        alert('Success');
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setloading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  }

  const handleChange = (e)=>
  {
    setForm({...form,[e.target.name]:e.target.value});
  }

  const handleSurpriseMe = ()=>
  {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({  ...form, prompt:randomPrompt});
  }
  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>
          create imaginative and visually stunning images generated by DALL-E AI and share them community
        </p>
      </div>
    <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-5'>
        <FormField
        labelName = "Your name"
        type = "text"
        name = "name"
        placeholder = "John doe"
        value= {form.name}
        handleChange = {handleChange}
        />
        <FormField
        labelName = "prompt"
        type = "text"
        name = "prompt"
        placeholder = "a sea otter with a pearl earring"
        value= {form.prompt}
        handleChange = {handleChange}
        isSurpriseMe
        handleSurpriseMe = {handleSurpriseMe}
        />
        <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-70 p-3 h-70 flex justify-center items-center'>
          {form.photo ?
          (
            <img
            src = {form.photo}
            alt = {form.prompt}
            className = "w-full h-full object-contain"
            />
          ): (
            <img src = {preview} alt = "preview" className='w-9/12 h-9/12 object-contain opacity-40'></img>
          )}

          {generatingImg &&(
            <div className='absolute inset-0 z-0 flex justify-center items-center bg-[#rgba(0,0,0,0.5)] rounded-lg'>
              <Loader/>
            </div>
          )}
        </div>
      </div>
      <div className='mt-5 flex gap-5'>
        <button 
        type = "button" 
        onClick= {generateImage}
        className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
        >
          {generatingImg ? 'Generating...' : 'Generate'} 
        </button>
      </div>
    <div className='mt-10'>
      <p className='mt-2 text-[#666e75] text-[14px]'>
        Once you have created the image you want, you can share it with others in the community
      </p>
      <button 
      type = "submit"
      className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
        {loading ? 'Sharing... ' : 'Share with the community'}
      </button>
    </div>
    </form>
    </section>
  )
}

export default CreatePost
