import { District } from "./district.model";
import { Party } from "./party.model";
export interface Result{
  resultId:number;
  district:District;
  party:Party;
  votes:number;
}