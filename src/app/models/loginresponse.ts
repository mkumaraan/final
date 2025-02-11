import { Candidate } from "./candidate.model";
import { Party } from "./party.model";
export interface LoginResponse{
  message:string,
  token:string,
  candidate:Candidate,
  partiesInDistrict:Party[];
}