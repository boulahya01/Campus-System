import React, { useState } from 'react'
import { materialsAPI } from '../../api/endpoints'

type Props = { moduleId?: number, onUploaded?: (res:any)=>void }

export default function UploadForm({ moduleId, onUploaded }: Props){
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function submit(e: React.FormEvent){
    e.preventDefault()
    if(!file) return setMsg('Please choose a file')
    if(!moduleId) return setMsg('Please select a module first')
    setLoading(true)
    try{
      const res = await materialsAPI.upload(moduleId, file, title || undefined)
      setMsg('Uploaded')
      onUploaded?.(res.data || res)
    }catch(err:any){
      setMsg(err?.message || 'Upload failed')
    }finally{setLoading(false)}
  }

  return (
    <form onSubmit={submit} style={{marginBottom:20}}>
      <div>
        <label>Title (optional)</label><br />
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Use filename if empty" />
      </div>
      <div style={{marginTop:8}}>
        <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} />
      </div>
      <div style={{marginTop:8}}>
        <button disabled={loading}>{loading? 'Uploading...' : 'Upload'}</button>
      </div>
      {msg && <div style={{marginTop:8}}>{msg}</div>}
    </form>
  )
}
