import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ButtonComponent } from '../../components/button/button.component';
import { CommonModule } from '@angular/common';
import { Candidate } from '../../models/candidate.model';

@Component({
  selector: 'app-candidate-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './candidate-edit.component.html',
  styleUrls: ['./candidate-edit.component.css']
})
export class CandidateEditComponent implements OnChanges {
  @Input() selectedCandidate: Candidate | null = null;
  @Output() candidateUpdated = new EventEmitter<void>();
  @Output() candidateDeleted = new EventEmitter<void>();
  @Output() candidateCancelled = new EventEmitter<void>(); // to clear the selected candidate

  candidateFormData = { name: '', email: '', password: '', age: 0, gender: '', districtId: 0, role: '' };
  selectedCandidateId: number = 0;
  isLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCandidate'] && this.selectedCandidate) {
      this.selectedCandidateId = this.selectedCandidate.candidateId;
      this.candidateFormData = {
        name: this.selectedCandidate.name,
        email: this.selectedCandidate.email,
        password: '', // Never pre-fill the password field
        age: this.selectedCandidate.age,
        gender: this.selectedCandidate.gender,
        districtId: this.selectedCandidate.districtId,
        role: this.selectedCandidate.role
      };
    }
  }

  updateCandidate() {
    if (!this.selectedCandidateId) return;

    this.isLoading = true;
    this.apiService.updateCandidate(this.selectedCandidateId, this.candidateFormData).subscribe(
      (candidate) => {
        console.log(candidate);
        this.isLoading = false;
        alert("Candidate Updated Successfully!");
        this.candidateUpdated.emit(); // Notify parent
        this.cancelEdit();
      },
      (error) => {
        this.isLoading = false;
        alert(error.error?.message || "Error updating candidate");
      }
    );
  }

  deleteCandidate() {
    if (!this.selectedCandidateId) {
      alert("No candidate selected!");
      return;
    }

    this.isLoading = true;
    this.apiService.deleteCandidate(this.selectedCandidateId).subscribe(
      () => {
        console.log(`Candidate with ID ${this.selectedCandidateId} deleted.`);
        this.isLoading = false;
        alert("Candidate Deleted Successfully!");
        this.candidateDeleted.emit(); // Notify parent
        this.cancelEdit();
      },
      (error) => {
        this.isLoading = false;
        console.error("Delete error:", error);
        alert(error.error?.message || "Error deleting candidate");
      }
    );
  }

  cancelEdit() {
    this.selectedCandidate = null;
    this.selectedCandidateId = 0;
    this.candidateCancelled.emit();
  }
}