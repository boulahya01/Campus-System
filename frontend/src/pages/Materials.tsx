import React, { useState } from 'react'
import { useFetch } from '../hooks'
import { materialsAPI, modulesAPI } from '../api/endpoints'

export default function Materials(){
  const [selectedModuleId, setSelectedModuleId] = useState<number | undefined>()
  
  const { data: modules, loading: modulesLoading } = useFetch(
    () => modulesAPI.list(undefined, 0, 20),
    []
  )

  const { data: materials, loading: materialsLoading } = useFetch(
    selectedModuleId ? () => materialsAPI.listByModule(selectedModuleId) : () => Promise.resolve([]),
    [selectedModuleId]
  )

  return (
    <div style={{padding:20}}>
      <h2>Course Materials</h2>

      <div style={{marginBottom:'20px'}}>
        <label>Select Module: </label>
        <select 
          value={selectedModuleId || ''} 
          onChange={(e) => setSelectedModuleId(e.target.value ? Number(e.target.value) : undefined)}
          style={{padding:'5px', marginLeft:'10px'}}
        >
          <option value="">-- Choose a module --</option>
          {Array.isArray(modules) && modules.map((m: any) => (
            <option key={m.id} value={m.id}>{m.code} - {m.name}</option>
          ))}
        </select>
      </div>

      {modulesLoading && <p>Loading modules...</p>}

      {selectedModuleId && (
        <div>
          <h3>Materials for Module {selectedModuleId}</h3>
          {materialsLoading && <p>Loading materials...</p>}
          
          {!materialsLoading && Array.isArray(materials) && materials.length > 0 ? (
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{borderBottom:'2px solid #ddd'}}>
                  <th style={{padding:'10px', textAlign:'left'}}>Title</th>
                  <th style={{padding:'10px', textAlign:'left'}}>File URL</th>
                  <th style={{padding:'10px', textAlign:'left'}}>Uploaded By</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((mat: any) => (
                  <tr key={mat.id} style={{borderBottom:'1px solid #eee'}}>
                    <td style={{padding:'10px'}}>{mat.title}</td>
                    <td style={{padding:'10px'}}>
                      <a href={mat.file_url} target="_blank" rel="noreferrer">{mat.file_url}</a>
                    </td>
                    <td style={{padding:'10px'}}>{mat.uploaded_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : !materialsLoading && <p>No materials uploaded yet</p>}
        </div>
      )}
    </div>
  )
}
