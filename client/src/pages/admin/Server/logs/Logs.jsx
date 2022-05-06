import React from 'react';
import { useSelector } from 'react-redux';
import api from "src/apis";


const Logs = (props) => {
  
  const { authState }  = useSelector((state ) =>state)

  const [logs, setLogs] = React.useState([])
  const [viewLogs, setViewLogs] = React.useState(null)
  
  
  
  React.useEffect(()=>{
    if(!authState._id){
      return null
    }
    api.post("/api/admin/get-server-logs", {path: "/", author_id: authState._id}).then(r => {
      if(r.status === 200) {
        setLogs(r.data)
      }
    }).catch(ex=>{
      console.log(ex)
    })
    
  }, [])
  
  
  function fetchLogDetail(l) {
    api.post("/api/admin/get-server-log", {fileName: l.name}).then(r => {
      if(r.status === 200){
        setViewLogs({
          content: r.data,
          path: l.path,
          name: l.name,
          size: l.size
        })
      }
    }).catch(ex=>{
      console.log(ex)
    })
  }
  
  function deleteLog(log){
    api.post("/api/admin/delete-server-log", {fileName: log.name}).then(r=>{
      if(r.status === 201){
        setLogs(logs.filter(l=>l.name !== log.name))
      }
    }).catch(ex=>{
      console.log(ex)
    })
  }
  
  
  return (
    <div>
      <h1>Server Logs</h1>
      
      <div>
        { logs && logs.map(l=>(
          <div>
            <div className="flex items-center justify-between" >
              <h4 onClick={()=>fetchLogDetail(l)}
                  className={["text-dark-800 text-sm font-normal cursor-pointer",  viewLogs && viewLogs.name === l.name ? "text-blue-500 " : ""].join(" ")}>{l.name} {Math.round(l.size / 1024) }KB</h4>
              <button className="btn" onClick={()=>deleteLog(l)}>DELETE</button>
            </div>
            { viewLogs && viewLogs.name === l.name && (
              <div className="max-h-[500px] overflow-y-auto">
                <pre className="text-sm font-normal">
                  { viewLogs.content }
                </pre>
              </div>
            )  }
          </div>
        )) }
      </div>
      
    </div>
  );
};

export default Logs;