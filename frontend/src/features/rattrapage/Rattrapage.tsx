import React, { useEffect, useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import useCan from '../../hooks/useCan'

type Policy = {
  pass_threshold: number
  policy: 'replace' | 'average' | 'max'
}

export default function Rattrapage(){
  const { push } = useToast()
  const { can } = useCan()
  const [policy, setPolicy] = useState<Policy>({ pass_threshold: 10, policy: 'replace' })

  useEffect(()=>{
    // load saved policy from localStorage for now
    const raw = localStorage.getItem('rattrapage_policy')
    if (raw) setPolicy(JSON.parse(raw))
  }, [])

  function save(){
    localStorage.setItem('rattrapage_policy', JSON.stringify(policy))
    push('Rattrapage policy saved (local)')
  }

  if (!can('rattrapage:create')) return <div>You do not have access to this page.</div>

  return (
    <div>
      <h2>Rattrapage (Resit) Policy</h2>
      <div>
        <label>Pass Threshold: <input type="number" value={policy.pass_threshold} onChange={e=>setPolicy({...policy, pass_threshold: parseInt(e.target.value||'0')})} /></label>
      </div>
      <div>
        <label>Policy: 
          <select value={policy.policy} onChange={e=>setPolicy({...policy, policy: e.target.value as any})}>
            <option value="replace">Replace (resit replaces original)</option>
            <option value="average">Average</option>
            <option value="max">Take higher</option>
          </select>
        </label>
      </div>
      <div style={{marginTop:10}}>
        <button onClick={save}>Save</button>
      </div>
    </div>
  )
}
import React from 'react'

export default function Rattrapage(){
  return (
    <div className="container">
      <h2>Rattrapage Sessions</h2>
      <p>Admin can create and manage rattrapage (resit) sessions here. Student registration and results application UI will be implemented next.</p>
    </div>
  )
}
