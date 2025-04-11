import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AxiosAsyncAwait = () => {

    const [datas, setDatas] = useState('');
    useEffect(() => {
        const fetch_data = async () => {
            const response = await axios.get('https://api.adviceslip.com/advice');
            setDatas(response.data.slip.advice)
            console.log(datas)
        }
        fetch_data();
    }, [])
    return (
        <div>
            {datas}
        </div>
    )
}

export default AxiosAsyncAwait