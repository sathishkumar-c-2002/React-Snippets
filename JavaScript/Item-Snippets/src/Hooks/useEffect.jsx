import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AxiosAsyncAwait = () => {
    const [datas, setDatas] = useState('');
    const [count,setCount] = useState(0);
    useEffect(() => {
        const fetch_data = async () => {
            const response = await axios.get('https://api.adviceslip.com/advice');
            setDatas(response.data.slip.advice);
        };
        fetch_data();
    }, [count]);

    const handleChange = async () => {
       setCount(()=>count+1);   
       console.log(count)
    };

    return (
        <div>
            <div>
                {datas}
            </div>
            <button onClick={handleChange}>Change</button>
        </div>
    );
}

export default AxiosAsyncAwait