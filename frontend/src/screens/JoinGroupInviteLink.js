import React from 'react';
import { postCreateGroupMember} from '../api/groupMemebrApi';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import parseJwt from '../utils/jwt';

export default function JoinGroupInviteLink() {
    const { groupId:group_id } = useParams();
    const token = localStorage.getItem("token")
    const decodedToken = parseJwt(token)
    const navigate = useNavigate()
    const handleJoinGroup = async ()=>{
        try{
            const user_id = decodedToken.userId
      
            const groupMemberDetails = {
                user_id,
                group_id
            }
            console.log(groupMemberDetails)
            const joinrequest = await postCreateGroupMember(groupMemberDetails,token);
            if(joinrequest.status===201){
                navigate('/')
            }
        }catch(error){
            console.log("Error JOining Group")
        }
    }
  return (
    <div>
      <div>
              <div className="fixed inset-0 flex items-center justify-center bg-7a7d85 bg-opacity-75 z-50">
                  <div className="border bg-teal-100 border-red-400 rounded-lg p-6">
                      <button className=" bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      onClick={handleJoinGroup}
                      >
                          Join Group
                      </button>
                  </div>
              </div>

      </div>
    </div>
  );
}
