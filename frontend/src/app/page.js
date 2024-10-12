'use client'
import {useSearchParams} from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const domain = 'http://localhost:8080'
  const searchParam= useSearchParams()

  const [token, setToken] = useState({
    accessToken: '',
    refreshToken: ''
  })

  useEffect(() => {
    const code = searchParam.get('code')
    if(code) {
      fetch(`${domain}/login/kakao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      })
      .then((res) => res.json())
      .then((data) => {
        setToken({
          accessToken: data.access_token,
          refreshToken: data.refresh_token
        })
      })
    }
  }, [])

  const clickKakaoLoing = async () => {
    const response = await fetch(`${domain}/auth/kakao`)
    const data = await response.json()
    
    window.location.href = data.url
  }
  return (
    <div className={styles.page}>
      {token.accessToken ? <span>로그인 성공 accessToken: {token.accessToken} refreshToken: {token.refreshToken}</span> :<button className={styles.button} onClick={clickKakaoLoing}>카카오 로그인</button>}
    </div>
  );
}