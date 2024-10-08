import React,{useState, useEffect,useCallback,useContext} from 'react';
import { useRouter } from 'next/router';
import {useDropzone} from 'react-dropzone';
import Image from 'next/image';

//INTERNAL IMPORT
import { VotingContext } from '../context/Voter';
import Style from '../styles/allowdVoter.module.css';
import images from '../assets';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';

const candidateRegistration =()=>{
  const [fileUrl, setFileUrl] = useState(null);
  const [candidateForm, setCandidateForm] = useState({ 
    name :"",
    address: "",
    age:"",
  });
  const router = useRouter();
  const { setCandidate,uploadToIPFSCandidate, candidateArray, getNewCandidate} =  useContext(VotingContext);
  
  //VOTER IMAGE DROP
  const onDrop = useCallback(async(acceptedFil)=>{
    const url = await uploadToIPFSCandidate(acceptedFil[0]);
    setFileUrl(url);  
  });
  const {getRootProps, getInputProps}= useDropzone({
    onDrop,
    // accept:'image/*',
    // accept: ['image/jpeg', 'image/png', 'image/gif'],
    accept: {
      'image/png': ['.png'], 
      'image/jpeg': ['.jpg', '.jpeg'] 
    },
    maxSize:5000000,
  });

  useEffect(()=>{
    getNewCandidate();
  },[]);
  //JSX PART
  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt='Voter Image'/>
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name: <span>&nbsp;{candidateForm.name}</span>
              </p>
              <p>
                Add: &nbsp;<span>{candidateForm.address.slice(0, 20)}</span>
              </p>
              <p>
                age: &nbsp;<span>{candidateForm.position}</span>
              </p>
            </div>
          </div>
        )}

        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create candidate For Voting</h4>
              <p>
                Blockchain voting organization, provide ethereum blockchain ecosyterm
              </p>
              <p className={Style.sideInfo_para}>Contract Candidate</p>
            </div>

            <div className={Style.card}>
              {candidateArray.map((el,i) =>(
                <div key={i+1} className={Style.card_box}>
                  <div className={Style.image}>
                    <img src={el[3]} alt="Profile photo"/>
                  </div>

                  <div className={Style.card_info}></div>
                  <p>{el[1]} #{el[2].toNumber()}</p>
                  <p>{el[0]}</p>
                  <p>Address: {el[6].slice(0, 10)}...</p>

                </div>
               ))} 
            </div>
          </div>
        )}

      </div>
        <div className={Style.voter}>
          <div className={Style.voter__container}>
            <h1>Create New Candidate</h1>
            <div className={Style.voter__container__box}>
              <div className={Style.voter__container__box__div}>
                <div {...getRootProps()}> 
                  <input {...getInputProps()} />

                  <div className={Style.voter__container__box__div_info}>

                    <p>Upload File:JPG, PNG, GIF, WEBM MAX 10MB</p>
                    <div className={Style.voter__container__box__div__image}>
                      <Image src={images.upload} width={150} height={150} 
                      // objectFit='contain'
                      alt='File upload'/>
                    </div>
                    <p>Drag and Drop File</p>
                    <p>or Browse on you device</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={Style.input_container}>
            <Input inputType="text" title="Name" placeholder="Voter Name"
            handleClick={(e)=> setCandidateForm({...candidateForm, name: e.target.value})} />

            <Input inputType="text" title="Address" placeholder="Voter Address"
            handleClick={(e)=> setCandidateForm({...candidateForm, address: e.target.value})} /> 

            <Input inputType="text" title="Position" placeholder="Voter Position"
            handleClick={(e)=> setCandidateForm({...candidateForm, age: e.target.value})} />

            <div className={Style.Button}>
              <Button btnName="Authorized Candidate" 
              handleClick={() => {setCandidate(candidateForm,fileUrl,router)}} />
            </div>

          </div>
        </div>
        {/* /////////////////// */}
        <div className={Style.createdVoter}>
          <div className={Style.createdVoter_info}>
            <Image src={images.creator} alt="User Profile" priority/>
            <p>Notice For User</p>
            <p>
              Organizer <span>0x4BC833a7b33fAFDb8C4EED0B0255Be35A3F03B70</span>
            </p>
            <p>
              Only organizer of the voting contract can create voting elect
            </p>
          </div>
        </div>


    </div>
  );
};


export default allowdVoters;
