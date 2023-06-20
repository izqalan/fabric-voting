/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import Api from "@/components/utils/api"
import { Text } from "@chakra-ui/react"

export default function Home() {

  const api = new Api(process.env.NEXT_PUBLIC_API_URL + '/api/v1');
  const [Hello, setHello] = useState({
    message: 'Nil'
  })

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get('/hello')
      setHello(res);
    }
    fetchData()
  }, [])

  return (
    <>
      {Hello && (<Text>{process.env.NEXT_PUBLIC_API_URL}</Text>)}
    </>
  )
}