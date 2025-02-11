import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ButtonComponent } from '../../components/button/button.component';
import { CommonModule } from '@angular/common';
import { District } from '../../models/district.model';

@Component({
  selector: 'app-party-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './party-form.component.html',
  styleUrls: ['./party-form.component.css']
})
export class PartyFormComponent implements OnInit {
  partyFormData = { name: '', leaderName: '', districtId: 0 };
  isLoading = false;
  @Output() partyCreated = new EventEmitter<void>();
  @Output() partyDeleted = new EventEmitter<void>(); // Output event for delete
  @Input() districts: District[] = [];
  parties: any; // array to hold the parties

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchParties();
  }

  fetchParties() {
    this.apiService.getAllParties().subscribe({
      next: (parties) => {
        this.parties = parties || [];
      },
      error: (error) => {
        console.error('Error fetching parties:', error);
      }
    });
  }

  createParty() {
    if (!this.partyFormData.name || !this.partyFormData.districtId) {
      alert('Enter party name and select a district.');
      return;
    }
    this.isLoading = true;
    this.apiService.createParty(this.partyFormData).subscribe(
      response => {
        console.log('Party Created:', response);
        this.isLoading = false;
        alert('Party Created Successfully!');
        this.partyCreated.emit(); // Notify parent
        this.partyFormData = { name: '', leaderName: '', districtId: 0 }; //Clear form
        this.fetchParties();
      },
      error => {
        this.isLoading = false;
        alert(error.error?.message || 'Error creating party');
      }
    );
  }

  deleteParty(partyId: number) {
    if (confirm('Are you sure you want to delete this party?')) {
      this.apiService.deleteParty(partyId).subscribe({
        next: () => {
          this.parties = this.parties.filter((party: { id: number; }) => party.id !== partyId); // Remove from UI
          alert('Party deleted successfully');
          this.partyDeleted.emit();
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting party:', error);
          alert(error.error?.message || "Error deleting party");
        }
      });
    }
  }
}
