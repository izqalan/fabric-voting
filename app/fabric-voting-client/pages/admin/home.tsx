import { useEffect, useState } from "react"
import Api from "@/components/utils/api"
import { Text } from "@chakra-ui/react"

export default function Home() {

  const api = new Api('http://localhost:8081/api/v1');
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
      {Hello && (<Text>{Hello.message}</Text>)}
    </>
  )
}