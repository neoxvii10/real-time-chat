import React from 'react'
import './Report.css'

type ReportType = {
  setIsReport: React.Dispatch<React.SetStateAction<boolean>>
}

const Report: React.FC<ReportType> = ({setIsReport}) => {
  return (
    <div className="overlay" >
      <div className="backdrop" onClick={e => {setIsReport(false)}}></div>
      <div className="wrap-edit">
        REPORT
      </div>
    </div>
  )
}

export default Report