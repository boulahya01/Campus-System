import React, { useEffect, useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import useCan from '../../hooks/useCan'
import { Button } from '../../components/Button'
import { Card, CardBody, CardHeader } from '../../components/Card'
import { FormField } from '../../components/FormField'
import { Alert } from '../../components/Alert'

type Policy = {
  pass_threshold: number
  policy: 'replace' | 'average' | 'max'
  resit_cap?: number
}

export default function Rattrapage(){
  const { push } = useToast()
  const { can } = useCan()
  const [policy, setPolicy] = useState<Policy>({ pass_threshold: 10, policy: 'replace', resit_cap: 2 })
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    const raw = localStorage.getItem('rattrapage_policy')
    if (raw) setPolicy(JSON.parse(raw))
  }, [])

  function save(){
    setSaving(true)
    setTimeout(() => {
      localStorage.setItem('rattrapage_policy', JSON.stringify(policy))
      push('✓ Rattrapage policy saved successfully', 'success')
      setSaving(false)
    }, 300)
  }

  if (!can('rattrapage:create')) {
    return (
      <div className="container">
        <div className="alert alert-error">You do not have permission to manage rattrapage settings.</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1>Rattrapage (Resit) Configuration</h1>
        <p className="text-muted">Configure academic policies for resit exams and rattrapage sessions</p>
      </div>

      <div className="grid-2">
        <Card>
          <CardHeader>
            <h3 style={{ margin: 0 }}>Policy Settings</h3>
          </CardHeader>
          <CardBody>
            <FormField label="Pass Threshold (out of 20)" required>
              <input 
                type="number" 
                min="0" 
                max="20" 
                value={policy.pass_threshold}
                onChange={e => setPolicy({...policy, pass_threshold: parseFloat(e.target.value) || 0})}
              />
            </FormField>

            <FormField label="Resit Policy" required>
              <select value={policy.policy} onChange={e => setPolicy({...policy, policy: e.target.value as any})}>
                <option value="replace">Replace (resit replaces original grade)</option>
                <option value="average">Average (average of original and resit)</option>
                <option value="max">Take Maximum (higher of the two)</option>
              </select>
            </FormField>

            <FormField label="Resit Attempts Cap">
              <input 
                type="number" 
                min="1" 
                max="10" 
                value={policy.resit_cap || 2}
                onChange={e => setPolicy({...policy, resit_cap: parseInt(e.target.value) || 2})}
              />
            </FormField>

            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              <Button variant="success" block loading={saving} onClick={save}>
                Save Policy
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 style={{ margin: 0 }}>Policy Summary</h3>
          </CardHeader>
          <CardBody>
            <div style={{ background: 'var(--primary-light)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }}>
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <label className="text-bold">Pass Threshold</label>
                <p style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>{policy.pass_threshold} / 20</p>
              </div>
            </div>

            <div style={{ background: 'var(--info-light)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }}>
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <label className="text-bold">Calculation Method</label>
                <p style={{ margin: 0 }}>
                  {policy.policy === 'replace' && 'Resit grade replaces original'}
                  {policy.policy === 'average' && 'Average of original and resit grades'}
                  {policy.policy === 'max' && 'Take the higher grade'}
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--warning-light)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <label className="text-bold">Resit Limit</label>
                <p style={{ margin: 0 }}>Maximum {policy.resit_cap} attempts per course</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
