import React, { useState } from 'react'
import { useFetch } from '../../hooks'
import { modulesAPI, materialsAPI } from '../../api/endpoints'
import UploadForm from './UploadForm'
import MaterialList from './MaterialList'

export default function Materials(){
  const [selectedModuleId, setSelectedModuleId] = useState<number | undefined>()
  const { data: modules, loading: modulesLoading } = useFetch(() => modulesAPI.list(undefined, 0, 20), [])
  const { data: materials, loading: materialsLoading, refetch } = useFetch(
    selectedModuleId ? () => materialsAPI.listByModule(selectedModuleId) : () => Promise.resolve([]),
    [selectedModuleId]
  )

  return (
    <div style={{padding:20}}>
      <h2 style={{marginBottom:16}}>Course Materials</h2>

      <div style={{marginBottom:16}}>
        <label style={{marginRight:8}}>Select Module:</label>
        <select 
          value={selectedModuleId ?? ''} 
          onChange={(e) => setSelectedModuleId(e.target.value ? Number(e.target.value) : undefined)}
          style={{padding:6, minWidth:220}}
        >
          <option value="">-- Choose a module --</option>
          {Array.isArray(modules) && modules.map((m: any) => (
            <option key={m.id} value={m.id}>{m.code} - {m.name}</option>
          ))}
        </select>
      </div>

      {modulesLoading && <p>Loading modules...</p>}

      {selectedModuleId ? (
        <div>
          <div style={{marginBottom:12}}>
            <UploadForm moduleId={selectedModuleId} onUploaded={()=>refetch && refetch()} />
          </div>
          <h3 style={{marginTop:8}}>Materials for Module {selectedModuleId}</h3>
          {materialsLoading ? <p>Loading materials...</p> : <MaterialList materials={materials || []} />}
        </div>
      ) : (
        <p>Please select a module to view or upload materials.</p>
      )}
    </div>
  )
}
