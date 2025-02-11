import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { State } from '../../models/state.model';

@Component({
  selector: 'app-state-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './state-form.component.html',
  styleUrls: ['./state-form.component.css']
})
export class StateFormComponent implements OnInit {
  stateFormData = { name: '' };
  isLoading = false;
  @Output() stateCreated = new EventEmitter<void>();
  @Output() stateDeleted = new EventEmitter<void>(); // Output event for delete
  states: State[] = []; // Array to hold the states

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchStates();
  }

  fetchStates() {
    this.apiService.getAllStates().subscribe({
      next: (states) => {
        this.states = states || [];
      },
      error: (error) => {
        console.error('Error fetching states:', error);
      }
    });
  }

  createState() {
    if (!this.stateFormData.name) return alert("Enter state name!");
    this.isLoading = true;
    this.apiService.createState(this.stateFormData).subscribe(
      (response) => {
        console.log("State Created:", response);
        this.isLoading = false;
        alert("State Created Successfully!");
        this.stateCreated.emit(); // Notify the parent component
        this.stateFormData = { name: '' }; // Clear the form
        this.fetchStates(); // Refresh the list
      },
      (error) => {
        this.isLoading = false;
        alert(error.error?.message || "Error creating State");
      }
    );
  }

  deleteState(stateId: number) {
    if (confirm('Are you sure you want to delete this state?')) {
      this.apiService.deleteState(stateId).subscribe({
        next: () => {
          this.states = this.states.filter(state => state.stateId !== stateId); // Remove from UI
          alert('State deleted successfully');
          this.stateDeleted.emit(); // Notify the parent component
        },
        error: (error) => {
          console.error('Error deleting state:', error);
          alert(error.error?.message || 'Error deleting state');
        }
      });
    }
  }
}