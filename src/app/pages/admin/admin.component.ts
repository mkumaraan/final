import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../services/api.service';
import { Candidate } from '../../models/candidate.model';
import { District } from '../../models/district.model';
import { State } from '../../models/state.model';
import { ButtonComponent } from '../../components/button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Party } from '../../models/party.model';
import { StateFormComponent } from '../../components/state-form/state-form.component';
import { DistrictFormComponent } from '../../components/district-form/district-form.component';
import { PartyFormComponent } from '../../components/party-form/party-form.component';
import { PartyListComponent } from '../../components/party-list/party-list.component';
import { CandidateListComponent } from '../../components/candidate-list/candidate-list.component';
import { CandidateEditComponent } from '../../components/candidate-edit/candidate-edit.component';
import { ResultsComponent } from '../../components/results/results.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StateFormComponent,
    DistrictFormComponent,
    PartyFormComponent,
    PartyListComponent,
    CandidateListComponent,
    CandidateEditComponent,
    ResultsComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  user: Candidate | null = null;
  states: State[] = [];
  districts: District[] = [];
  parties: Party[] = [];
  candidates: Candidate[] = [];
  selectedCandidate: Candidate | null = null;
  welcomeMessage: string = "";
  showWelcome: boolean = false;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();
  activeTab: string = 'state';

  constructor(private authService: AuthService, private apiService: ApiService, private router: Router) {
    this.authService.loggedInUser.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;
      if (user && user.role === 'ADMIN') {
        this.getAllStates();
        this.getAllDistricts();
        this.getAllParties();
        this.getAllCandidates();
        this.showWelcomeMessage();
      }
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.getAllCandidates();
    this.getAllDistricts();
    this.getAllParties();
    this.getAllStates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.logout();
  }

  loadInitialData() { }

  // State Management
  getAllStates() {
    this.apiService.getAllStates().subscribe((states) => {
      this.states = states;
    }, (error) => {
      alert(error.error?.message || "Error fetching states");
    });
  }

  onStateCreated() {
    this.getAllStates();
    this.getAllDistricts(); // Refresh districts 
  }

  onStateDeleted() {
    this.getAllStates(); // Refresh the state list
  }

  // District Management
  getAllDistricts() {
    this.apiService.getAllDistricts().subscribe((districts) => {
      this.districts = districts;
    }, (error) => {
      alert(error.error?.message || "Error fetching districts");
    });
  }

  onDistrictCreated() {
    this.getAllDistricts();
  }

  onDistrictDeleted() {
    this.getAllDistricts(); // Refresh the district list
  }

  // Party Management
  getAllParties() {
    this.apiService.getAllParties().subscribe((parties) => {
      this.parties = parties;
    }, (error) => {
      alert(error.error?.message || "Error fetching parties");
    });
  }

  onPartyCreated() {
    this.getAllParties();
  }

  onPartiesChanged() {
    this.getAllParties();
  }

  onPartyDeleted() {
    this.getAllParties(); // Refresh the party list
  }

  // Candidate Management
  getAllCandidates() {
    this.apiService.getAllCandidates().subscribe((candidates) => {
      this.candidates = candidates;
    }, (error) => {
      alert(error.error?.message || "Error fetching candidates");
    });
  }

  onCandidateSelected(candidate: Candidate) {
    this.selectedCandidate = candidate;
  }

  onCandidateUpdated() {
    this.getAllCandidates();
    this.selectedCandidate = null;
  }

  onCandidateDeleted() {
    this.getAllCandidates();
    this.selectedCandidate = null;
  }

  onCandidateCancelled() {
    this.selectedCandidate = null;
  }

  private showWelcomeMessage() {
    if (this.user) {
      this.welcomeMessage = `Welcome, ${this.user.name}!`;
      this.showWelcome = true;
      setTimeout(() => {
        this.showWelcome = false;
      }, 2500);
    }
  }

  goToRegister() {
    this.router.navigate(['/register'])
  }
  goToLanding() {
    this.router.navigate(['/'])
  }
}