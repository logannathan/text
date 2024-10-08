import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
// import { JsonRpcProvider } from "ethers";
// const {ethers} = require ('ethers');
import { Web3Provider } from "ethers"; 
import { providers } from "ethers";
import { create as ipfsHttpClient } from 'ipfs-http-client';
import axios from 'axios';
import { useRouter } from 'next/router';

import { votingAddress, votingAddressABI } from './constants';

// const client =ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const fetchContract = (signerOrProvider) => new ethers.Contract(
    votingAddress, votingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
    const votingTitle = ' My first smart contract app';
    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState('');
    const [candidateLength, setCandidateLength] = useState('');
    const pushCandidate = [];
    const candidateIndex = [];
    const [candidateArray, setCandidateArray] = useState(pushCandidate);
    // END OF CANDIDATE DATE
    const [error, setError] = useState('');
    const highesVote = [];
    //VOTER SECTION
    const pushVoter = [];
    const [voterArray, setVoterArray] = useState(pushVoter);
    const [voterLenghth, setVoterLength] = useState('');
    const [voterAddress, setVoterAddress] = useState([]);
    //CONNECTING METAMASK
    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return setError('please Install Metamask');
        const account = await window.ethereum.request({ method: 'eth_account' });
        if (account.length) {
            setCurrentAccount(account[0]);
        } else {
            setError('Please Install Metamask and Connect, Reload');
        }
    };
    //CONNECT WALLET
    const connectWallet = async () => {
        if (!window.ethereum) return setError('please Install Metamask');
        const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentAccount(account[0]);
    }
    //UPLOAD TO IPFS VOTER IMAGE
    // Thay thế bằng API key và Secret key của bạn từ Pinata
    const PINATA_API_KEY = '53cfcd425d343baa64fa';
    const PINATA_SECRET_API_KEY = 'f7c439497837ed260f1be96d7c5a537b6a645f7a1286b410a79ee7d8adca5307';

    const uploadToIPFS = async (file) => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

        // Tạo FormData để chứa file
        let data = new FormData();
        data.append('file', file);

        try {
            // Gửi request lên Pinata với API key và Secret key
            const response = await axios.post(url, data, {
                maxContentLength: "Infinity", // Để upload các file lớn
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_API_KEY
                }
            });

            // Lấy đường dẫn của file đã upload
            const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            console.log(ipfsUrl);
            return ipfsUrl;
        } catch (error) {
            console.error('Error Uploading File to Pinata:', error);
            setError('Error Uploading File to Pinata');
        }
    };

    // Hàm để upload JSON lên Pinata
    const uploadJsonToPinata = async (jsonData) => {
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

        try {
            const response = await axios.post(url, jsonData, {
                headers: {
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_API_KEY
                }
            });
            // Trả về URL IPFS của JSON
            return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            console.log(response.data.IpfsHash);
        } catch (error) {
            console.error('Error Uploading JSON to Pinata:', error);
            throw error;
        }
    };
    //------------------UPLOAD TO IPFS CANDIDATE IMAGE
    const uploadToIPFSCandidate = async (file) => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

        // Tạo FormData để chứa file
        let data = new FormData();
        data.append('file', file);

        try {
            // Gửi request lên Pinata với API key và Secret key
            const response = await axios.post(url, data, {
                maxContentLength: "Infinity", // Để upload các file lớn
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_API_KEY
                }
            });

            // Lấy đường dẫn của file đã upload
            const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            console.log(ipfsUrl);
            return ipfsUrl;
        } catch (error) {
            console.error('Error Uploading File to Pinata:', error);
            setError('Error Uploading File to Pinata');
        }
    };
    //---------------------------CREATE Voter
    const createVoter = async (formInput, fileUrl, router) => {
        try {
            const { name, address, position } = formInput;
            console.log(name, address, position, fileUrl);
            if (!name || !address || !position) {
                return console.log("Input data is missing");
            }
            // Tạo đối tượng JSON chứa thông tin voter
            const jsonData = {
                name: name,
                address: address,
                position: position,
                image: fileUrl  // Đường dẫn hình ảnh đã được upload lên Pinata
            };
            // console.log(jsonData);
            // Upload JSON object lên Pinata
            const jsonUrl = await uploadJsonToPinata(jsonData);
            // console.log(jsonUrl);

            // CONNECTING SMART CONTRACT
            const provider = new ethers.BrowserProvider(window.ethereum);
            // const provider = new ethers.JsonRpcProvider("http://localhost:8545");
            const   signer = await provider.getSigner();
            const addresss = await signer.getAddress(); // Lấy địa chỉ ví
            console.log("Địa chỉ ví:", addresss);
            const contract = fetchContract(signer);
            // console.log(contract) ;


            // Lấy ABI từ contract đã triển khai
            // const contractABI = contract.interface.fragments;

            // Lọc và hiển thị các hàm từ ABI
            // contractABI.forEach(fragment => {
            // if (fragment.type === 'function') {
            //     console.log(`Function: ${fragment.name}`);
            // }
            // });
            
            console.log(address, name, jsonUrl, fileUrl);
            
            // const voter = await contract.voterRight("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","thieu", 
            //     "https://gateway.pinata.cloud/ipfs/QmaSgMNSqNh3pp5X8X3itTpAY9MeUE5tMgF6XreS5UkQym",
            //     "https://gateway.pinata.cloud/ipfs/QmWBvakC39WtUa3n4Zorxi2JibR9oAbgoCBjBgX4q3j6yt");
        
            const    voter = await contract.voterRight(address, name, jsonUrl, fileUrl);
            voter.wait();
            // console.log(voter);
            // const votersAddress= await contract.voterAddress();
            // console.log(votersAddress);

            // const voterListData = await contract.getVoterList();
            // const getVotedVoterLists = await contract.getVotedVoterList()
       
                // voterListData.wait();
                
                // console.log(voterListData);
                // console.log(getVotedVoterLists);
            //     setVoterAddress(voterListData);
            //     console.log(voterAddress);

            router.push('/voterList');
        } catch (error) {
            setError("something wrong creating voter");
          }
          
    };

    //----------------------------------------GET VOTER DATA
    const getAllVoterData = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);         
            const   signer = await provider.getSigner();
            const contract = fetchContract(signer);   

            // VOTER LIST
            const voterListData = await contract.getVoterList();
            voterListData.wait();
            console.log(voterListData);
            setVoterAddress(voterListData);
            console.log(voterAddress);

            voterListData.map(async (el) => {
                const singleVoterData = await contract.getVoterData(el);
                pushVoter.push(singleVoterData);
                console.log(singleVoterData);
              });
            
            // VOTER LENGTH
            const voterList = await contract.getVoterLength();
            setVoterLength(voterList.toNumber());

            
        } catch (error) {
            setError("something went wrong fetching data");
          }
    };
    
    // useEffect(()=>{
    //     getAllVoterData();
    // },[]);

    const giveVote = async (id) => {
        try {

        const voterAddress = id.address;
        const voterId = id.id;
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);
        const voteredList= await contract.vote(voterAddress,voterId);
        } catch (error) {
          console.log(error);
        }
      };
    //-------------------CANDIDATE SECTION-----------------------
      const setCandidate = async (candidateForm, fileUrl, router) => {
        try {
          const { name, address, age } = candidateForm;
          if (!name || !address || !age) 
            return setError("Input data is missing");

          console.log(name, address,age,fileUrl);
      
          // Kết nối với hợp đồng thông minh
          const web3Modal = new Web3Modal();
          const connection = await web3Modal.connect();
          const provider = new ethers.providers.Web3Provider(connection);
          const signer = provider.getSigner();
          const contract = fetchContract(signer);

          const data = JSON.stringify({ name, address, image: fileUrl, age });
            const added = await client.add(data);
            const ipfs = `https://ipfs.infura.io/ipfs/${added.path}`;

            const candidate = await contract.setCandidate(
            address,
            age,
            name,
            fileUrl,
            ipfs
            );
            candidate.wait();
            console.log(candidate);

            router.push('/');
          // Thêm logic xử lý tiếp theo ở đây
        } catch (error) {
            setError("something went wrong fetching data");
        }
      };
    //---------------GET CANDIDATE DATA--------------------
    
    const getNewCandidate = async () => {
        try {
        // Kết nối với hợp đồng thông minh
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);

        // -- ALL CANDIDATE
        const allCandidate = await contract.getCandidate();
      

        allCandidate.map(async (el) => {
        const singleCandidateData = await contract.getCandidatedata(el);
        
        pushCandidate.push(singleCandidateData);
        candidateIndex.push(singleCandidateData[2].toNumber());
        
        });
        // -- CANDIDATE LENGTH
        const allCandidateLength = await contract.getCandidateLength();
        setCandidateLength(allCandidateLength.toNumber());
    
        // Thêm logic xử lý tiếp theo ở đây
        } catch (error) {
        console.log(error);
        }
    };
    useEffect(()=>{
        getNewCandidate();
    },[]);
    //-------------------------------------------------------------------
    return (
        <VotingContext.Provider value={{
            votingTitle,
            checkIfWalletIsConnected,
            connectWallet,
            uploadToIPFS,
            createVoter,
            getAllVoterData,
            giveVote,
            setCandidate,
            getNewCandidate,
            error,
            voterArray,
            voterLenghth,
            voterAddress,
            currentAccount,
            candidateLength,
            candidateArray,
            uploadToIPFSCandidate
        }}>
            {children}
        </VotingContext.Provider>
    );
};


