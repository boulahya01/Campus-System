import React, { useState } from 'react'
import api from '../api/client'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [msg,setMsg] = useState('')
  const setAuth = useAuthStore(state => state.setAuth)
  const navigate = useNavigate()

  async function submit(e: React.FormEvent){
    e.preventDefault()
    try{
      const res = await api.post('/auth/login',{email,password})
      const token = res.data.access_token
      const user = res.data.user
      setAuth(token, user)
      navigate('/dashboard')
    }catch(err:any){
      setMsg(err?.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>Email</label><br />
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button>Login</button>
      </form>
      <div style={{color:'red'}}>{msg}</div>
    </div>
  )
}
