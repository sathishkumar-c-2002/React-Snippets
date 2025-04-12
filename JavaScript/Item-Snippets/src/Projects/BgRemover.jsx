import React, { useState } from "react"
import axios from "axios"

const BackgroundRemover = () => {
    const [image, setImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error,setError] = useState(null)



    const handleImageUpload=(event)=>{
        const file = event.target.files[0];
        if (file){
            setImage(URL.createObjectURL(file));
        }
    }

    const removeBackground=async()=>{
        if (!image) return;
        setIsLoading(true)
        setError(null)

        try{
            const formData = new FormData();
            const fileInput = document.querySelector('input[type="file"]')
            formData.append('image_file',fileInput.files[0])

            const response = await axios.post('https://api.remove.bg/v1.0/removebg',
                formData,
            {
                headers:{
                    'X-API-Key': 'aLHJWFYqsug3ch71SWo98TBU'
                },
                responseType:'blob',
            }
        );

        const url = URL.createObjectURL(response.data);
        setProcessedImage(url);
        }catch(error){
            setError('Failed to Remove bg. try again!')
            console.log(error)
        }
        finally{
            setIsLoading(false)
        }
    };


    const downloadImage=()=>{
        if (!processedImage) return;

        const link = document.createElement('a');
        link.href = processedImage;
        link.download = 'bg-remove.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    return (
        <div>
            <h1>Background Remover</h1>
            <div>
                <input type="file" accept="image/*"  onChange={handleImageUpload} disabled={isLoading} />
            </div>


            {image && (
                <div>
                    <div>
                        <h3>Original Image</h3>
                        <img src={image} alt="Original"  style={{height:100,width:100}} />
                    </div>
                    <button onClick={removeBackground} disabled={isLoading}>{isLoading?'Processing':'Remove Background'}</button>
                </div>
            )}

            {processedImage && (
                <div>
                    <div>
                        <h3>BG Removed Image</h3>
                        <img src={processedImage} alt="Original" />
                    </div>
                    <button onClick={downloadImage}>Download Image</button>
                </div>
            )}

            {error &&<div>{error}</div>}
        </div>
    )
}

export default BackgroundRemover;