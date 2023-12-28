import React, { useState } from 'react'
import './Report.css'
import { AiOutlineClose } from 'react-icons/ai'
import ReportApi from '../../Api/ReportApi';

type ChannelType = {
  id: number;
  member_count: number;
  last_message?: any;
  title: string;
  avatar_url?: string;
  create_at: string;
};

type UserType = {
  id: number,
  username: string,
  avatar_url: any,
  first_name: string,
  last_name: string,
  fullname: string
}



type UnifiedType = UserType | ChannelType;

type ReportType = {
  setIsReport: React.Dispatch<React.SetStateAction<boolean>>
  channel: UnifiedType,
  isUserType: any
}

const Report: React.FC<ReportType> = ({channel, setIsReport, isUserType }) => {
  const [messageReport, setMessageReport] = useState<string>('')
  const [descriptionReport, setDescriptionReport] = useState<string>('');

  const handleDescriptionReportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDescriptionReport(e.target.value);
  }
 
  const handleSubmitReport = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if(user === 'null') {
      throw new Error("User don't have in local storage")
    }
    const formData = {
      "report_type": isUserType ? "REPORT_USER" : "REPORT_CHANNEL",
      "reason": messageReport + '_' + descriptionReport,
      "processed": true,
      "reporter": user?.no_id,
      "reported_channel": channel.id
    }

    try {
      const response = await ReportApi.createReport(formData);
      console.log(response);
      alert("The report was sent successfully.");
      setIsReport(false)
    } catch (error) {
      console.log(error)
      alert("Report FAIL !!!")
    }
    
  }

  return (
    <div className="overlay" >
      <div className="backdrop" onClick={e => { setIsReport(false) }}></div>
      <div className="wrapper">
        <div className="header-report">
          <span className='button-close' onClick={e => { setIsReport(false) }}>
            <AiOutlineClose size={22} />
          </span>
          <div className='header-title'>Report</div>
        </div>
        <div className="content-report">
          <div className="title-report">
            <label className="Radio">
              <input className='radio-input' onChange={() => setMessageReport("Spam")} checked = {messageReport === "Spam"} type="radio" name="report-message" value="Spam" />
              <div className="Radio-main">
                <span className="label">Spam</span>
              </div>
            </label>
            <label className="Radio">
              <input className='radio-input' onChange={() => setMessageReport("Violence")} checked = {messageReport === "Violence"} type="radio" name="report-message" value="Violence" />
              <div className="Radio-main">
                <span className="label">Violence</span>
              </div>
            </label>
            <label className="Radio">
              <input className='radio-input' onChange={() => setMessageReport("Pornography")} checked = {messageReport === "Pornography"} type="radio" name="report-message" value="Pornography" />
              <div className="Radio-main">
                <span className="label">Pornography</span>
              </div>
            </label>
            <label className="Radio"> 
              <input className='radio-input' onChange={() => setMessageReport("Child abuse")} checked = {messageReport === "Child abuse"} type="radio" name="report-message" value="Child abuse" />
              <div className="Radio-main">
                <span className="label">Child abuse</span>
              </div>
            </label>
            <label className="Radio">
              <input className='radio-input' onChange={() => setMessageReport("Copyright")} checked = {messageReport === "Copyright"} type="radio" name="report-message" value="Copyright" />
              <div className="Radio-main">
                <span className="label">Copyright</span>
              </div>
            </label>
            <label className="Radio">
              <input className='radio-input' onChange={() => setMessageReport("Illegal Drugs")} checked = {messageReport === "Illegal Drugs"} type="radio" name="report-message" value="Illegal Drugs" />
              <div className="Radio-main">
                <span className="label">Illegal drugs</span>
              </div>
            </label>
            <label className="Radio">
              <input className='radio-input' onChange={() => setMessageReport("Other")} checked = {messageReport === "Other"} type="radio" name="report-message" value="Other" />
              <div className="Radio-main">
                <span className="label">Other</span>
              </div>
            </label>
          </div>
          <div className="description-report">
            <div className="input-group">
              <input className='form-control' onChange={handleDescriptionReportChange} dir='auto' type="text" name='description' placeholder='description' />
              <label>Description</label>
            </div>
          </div>

          <div className="submit-report">
            <div className='btn-report' onClick={handleSubmitReport}>
              Report
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Report