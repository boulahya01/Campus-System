import React from 'react'

type Props = { materials: any[] }

export default function MaterialList({ materials }: Props){
  return (
    <div>
      {!materials || materials.length === 0 ? (
        <p>No materials uploaded yet</p>
      ) : (
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
      )}
    </div>
  )
}
