import React, { useEffect, useState } from 'react'

const FetchAPI = () => {
    const [display, setDisplay] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://api.adviceslip.com/advice');
            const data = await response.json();
            console.log(data)
            setDisplay(data.slip.advice)
        }
        fetchData();
    }, [])

    return (
        <div>
            {display}
        </div>
    )
}

export default FetchAPI