import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ButtonComponent } from '../../components/button/button.component';
import { CommonModule } from '@angular/common';
import { State } from '../../models/state.model';
import { District } from '../../models/district.model';

@Component({
  selector: 'app-district-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './district-form.component.html',
  styleUrls: ['./district-form.component.css']
})
export class DistrictFormComponent implements OnInit {
  districtFormData = { name: '', stateId: 0 };
  isLoading = false;
  @Input() districts: District[] = []; // Added to display districts
  @Output() districtCreated = new EventEmitter<void>();
  @Output() districtDeleted = new EventEmitter<void>(); // Event for deletion
  @Input() states: State[] = [];


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchDistricts();
    this.fetchStates();
  }

  fetchDistricts() {
    this.apiService.getAllDistricts().subscribe({
      next: (districts) => {
        console.log("Fetched districts:", districts); // Debugging
        this.districts = districts.map(district => {
          console.log("District:", district);
          console.log("State in district:", district.state);
          return {
            ...district,
            state: district.state || { name: "Unknown" }
          };
        });
      },
      error: (error) => {
        console.error('Error fetching districts:', error);
      }
    });
  }
  

  fetchStates() {
    this.apiService.getAllStates().subscribe({
      next: (states) => {
        console.log("Fetched states:", states); // Debugging
        this.states = states || [];
      },
      error: (error) => {
        console.error('Error fetching states:', error);
      }
    });
  }

  createDistrict() {
    if (!this.districtFormData.name || !this.districtFormData.stateId) {
      alert("Please enter district name and select a valid state.");
      return;
    }

    this.districtFormData.stateId = Number(this.districtFormData.stateId);

    this.isLoading = true;
    this.apiService.createDistrict(this.districtFormData).subscribe({
      next: (response) => {
        console.log("District Created:", response);
        this.isLoading = false;
        alert("District Created Successfully!");
        this.districtCreated.emit(); // Notify the parent component
        this.districtFormData = { name: '', stateId: 0 }; // Clear the form
        this.fetchDistricts(); // Refresh the list
      },
      error: (error) => {
        this.isLoading = false;
        alert(error.error?.message || "Error creating district");
      }
    });
  }

  deleteDistrict(districtId: number) {
    if (confirm('Are you sure you want to delete this district?')) {
      this.apiService.deleteDistrict(districtId).subscribe({
        next: () => {
          this.districts = this.districts.filter(district => district.districtId !== districtId); // Remove from UI
          alert('District deleted successfully');
          this.districtDeleted.emit(); // Notify parent
        },
        error: (error) => {
          console.error('Error deleting district:', error);
          alert(error.error?.message || "Error deleting district");
        }
      });
    }
  }
}
