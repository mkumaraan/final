import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ButtonComponent } from '../../components/button/button.component';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../models/candidate.model';
import { Party } from '../../models/party.model';
import { ResultDTO } from '../../models/resultdto';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user: Candidate | null = null;
  parties: Party[] = [];
  results: ResultDTO[] = [];
  selectedPartyld: number = 0;
  voteForm = {
    candidateId: 0,
    partyId: 0
  }
  voted = false;
  voteCasted = false;
  showVotePopup = false;
  voteConfirmationMessage = "";
  isLoading = false;
  constructor(private authService: AuthService, private apiService: ApiService, private router: Router) {
    this.authService.loggedInUser.subscribe((user) => {
      this.user = user;
      if (user) {
        this.voteForm.candidateId = user.candidateId;
        if (user.role !== 'ADMIN') {
          this.getPartiesFromLogin(user);
          this.checkIfUserVoted();
        }
      }
    });
  }

  ngOnInit() {
    this.authService.loggedInUser.subscribe((user) => {
      this.user = user;
      if (user) {
        this.voteForm.candidateId = user.candidateId;
        if (user.role !== 'ADMIN') {
          this.getPartiesFromLogin(user);
          this.checkIfUserVoted();
        }
      }
    });
  }

  getPartiesFromLogin(user: Candidate) {
    console.log("User Data on Home Component:", user);

    if (user && user.partiesInDistrict && Array.isArray(user.partiesInDistrict) && user.partiesInDistrict.length > 0) {
      console.log("Fetched Parties from Backend:", user.partiesInDistrict);
      this.parties = user.partiesInDistrict;
    } else {
      console.error("No parties found or undefined:", user);
      alert("No parties found for this district.");
    }
  }

  logout() {
    this.authService.logout();
  }
  vote() {
    if (!this.user) {
      alert("User data not found. Please log in again.");
      return;
    }

    this.voteForm.candidateId = this.user.candidateId;
    this.voteForm.partyId = this.selectedPartyld;
    console.log("Vote Request Data:", JSON.stringify(this.voteForm));
    if (!this.voteForm.candidateId || !this.voteForm.partyId) {
      alert("Please select a party and try again.");
      return;
    }

    this.isLoading = true;
    this.apiService.vote(this.voteForm).subscribe(
      (response) => {
        this.isLoading = false;
        console.log("Vote Response:", response);
        this.voteConfirmationMessage = response;
        this.voted = true;
        this.voteCasted = true;
        this.checkIfUserVoted();
      },
      (error) => {
        this.isLoading = false;
        console.error("Error submitting vote:", error);
        alert("You have already voted");
      }
    );
  }

  checkIfUserVoted() {
    if (this.user && this.user.hasVoted) {
      this.voted = true;
    } else {
      this.voted = false
    }
  }

  goToRegister() {
    this.router.navigate(['/register'])
  }
  goToLanding() {
    this.router.navigate(['/'])
  }
}