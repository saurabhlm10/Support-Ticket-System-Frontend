import React from 'react'

const IdProvider = ({children}) => {
    const [id, setId] = useState('')

    const getAgent = async () => {
        try {
            const response = await axiosInstance.get(
                `/agent/getAgent/${router.query.userId}`
            );
            setUser(response.data.agent);
            setIsLoading(false);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        getAgent()
    }, [])


    return (
        <div>{children}</div>
    )
}

export default IdProvider