export interface Candidate { 
  partiesInDistrict: import("c:/Users/2375278/OneDrive - Cognizant/Desktop/MK/cts_project/frontend/f3-vote/src/app/models/party.model").Party[]; 
  candidateId: number; 
  name: string; 
  email: string; 
  age: number; 
  gender: string; 
  districtId: number; 
  hasVoted: boolean; 
  role:string; 
 }