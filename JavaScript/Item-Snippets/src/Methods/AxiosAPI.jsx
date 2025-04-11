import React, { useState, useEffect } from 'react'
import axios from 'axios'

const AxiosAPI = () => {
    const [data, setData] = useState('')
    useEffect(() => {
        axios.get('https://api.adviceslip.com/advice')
            .then((response) => { setData(response.data.slip.advice) })
    }, [])
    return (
        <div>{data}</div>
    )
}

export default AxiosAPI