import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from '../models/candidate.model';
import { LoginResponse } from '../models/loginresponse';
import { Party } from '../models/party.model';
import { ResultDTO } from '../models/resultdto';
import { District } from '../models/district.model';
import { State } from '../models/state.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) { }

  //auth calls
  register(candidate: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/candidates/register`, candidate, {
      responseType: 'text'
    });
  }

  login(loginData: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/candidates/login`, loginData).pipe(
      tap((response: LoginResponse) => {
        if (response && response.candidate) {
          console.log("Inside tap, login successful");
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.candidate));
        }
      })
    );
  }

  // admin calls
  createState(state: any): Observable<State> {
    return this.http.post<State>(`${this.baseUrl}/admins/state`, state, this.getAuthHeaders());
  }

  deleteState(stateId: number) {
    return this.http.delete(`${this.baseUrl}/admins/delete/state/${stateId}`, this.getAuthHeaders());
  }

  getAllStates(): Observable<State[]> {
    return this.http.get<State[]>(`${this.baseUrl}/admins/state`, this.getAuthHeaders());
  }

  createDistrict(district: any):
    Observable<District> {
    district.stateId = Number(district.stateId);
    return this.http.post<District>(`${this.baseUrl}/admins/district`, district, this.getAuthHeaders());
  }

  deleteDistrict(districtId: number) {
    return this.http.delete(`${this.baseUrl}/admins/delete/district/${districtId}`, this.getAuthHeaders());
  }

  getAllDistricts(): Observable<District[]> {
    return this.http.get<District[]>(`${this.baseUrl}/admins/district`, this.getAuthHeaders());
  }

  createParty(party: any): Observable<Party> {
    return this.http.post<Party>(`${this.baseUrl}/admins/party`, party, this.getAuthHeaders());
  }

  uploadPartySymbol(partyId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.baseUrl}/admins/party/${partyId}/symbol`, formData, {
      headers: headers, responseType: 'text'
    });
  }

  deleteParty(partyId: number) {
    return this.http.delete(`${this.baseUrl}/admins/delete/party/${partyId}`, this.getAuthHeaders());
  }

  getAllParties(): Observable<Party[]> {
    return this.http.get<Party[]>(`${this.baseUrl}/admins/party`, this.getAuthHeaders());
  }

  vote(voteData: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Error: Missing token. User must log in again.");
      alert("Session expired. Please log in again.");
      return new Observable();
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log("Sending Vote Request:", JSON.stringify(voteData));

    return this.http.post(`${this.baseUrl}/candidates/vote`, voteData, {
      headers: this.getAuthHeaders().headers,
      responseType: 'text'
    });
  }

  deleteCandidate(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.delete(`${this.baseUrl}/admins/deletebyid/${id}`, {
      headers: this.getAuthHeaders().headers,
      responseType: 'text'
    });
  }

  getResults(): Observable<ResultDTO[]> {
    return this.http.get<ResultDTO[]>(`${this.baseUrl}/admins/result`, this.getAuthHeaders());
  }

  getFormattedResults(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/admins/results/formatted`, this.getAuthHeaders());
  }

  getAllCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.baseUrl}/admins/getAll`, this.getAuthHeaders())
  }

  getCandidateById(id: number): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.baseUrl}/admins/getbyid/${id}`, this.getAuthHeaders())
  }

  getCandidatesByRole(role: string): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.baseUrl}/admins/byrole/${role}`, this.getAuthHeaders())
  }

  updateCandidate(id: number, candidate: any): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.baseUrl}/admins/update/candidate/${id}`, candidate, this.getAuthHeaders())
  }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return { headers }
  }
}