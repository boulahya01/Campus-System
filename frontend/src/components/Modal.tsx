import React from 'react'

export default function Modal({ open, title, onClose, children }:{open:boolean,title?:string,onClose?:()=>void,children?:React.ReactNode}){
  if(!open) return null
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10000}} role="dialog">
      <div style={{background:'#fff',padding:16,borderRadius:8,minWidth:320,maxWidth:'90%'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <strong>{title}</strong>
          <button onClick={onClose} style={{border:'none',background:'transparent',cursor:'pointer'}}>✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
