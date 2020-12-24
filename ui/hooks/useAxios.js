import axios from 'axios'
import {useEffect, useState} from "react";

export default function useAxios(url, apiData = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  let deptArray = [url]
  if (Array.isArray(url)) {
    deptArray = []
    url.map(u => deptArray.length ? [...deptArray, Object.keys(u)[0]] : [Object.keys(u)[0]])
  }
  useEffect(() => {
    async function AxiosOne(url, apiData) {
      try {
        let response = await axios.post('/api/' + url, apiData)
        if (response.data.error)
          throw new Error(response.data.error)
        setData(response.data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    async function AxiosMultiple(urls) {
      try {
        let post = urls.map((u, i) => {
          let url = Object.keys(u)[0]
          let data = Object.values(u)[0]
          return axios.post('/api/' + url, data)
        })
        let response = await axios.all(post)
        let res = {}
        response.map(r => {
          if (r.data.error)
            throw new Error(r.data.error)
          let configUrl = r.config.url.slice(5)
          res[configUrl] = {data: r.data, url: configUrl}
        })
        setData(res)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    if (Array.isArray(url))
      AxiosMultiple(url)
    else
      AxiosOne(url, apiData)
  }, deptArray)

  return {data, error, loading}
}
