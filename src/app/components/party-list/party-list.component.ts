import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Party } from '../../models/party.model';

@Component({
  selector: 'app-party-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './party-list.component.html',
  styleUrls: ['./party-list.component.css']
})
export class PartyListComponent implements OnInit {
  @Input() parties: Party[] = [];
  @Output() partiesChanged = new EventEmitter<void>(); // Notify parent when parties update
  selectedFile: File | null = null;
  selectedPartyId: number | null = null;
  isLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  onFileSelectedForParty(event: any, partyId: number): void {
    this.selectedFile = event.target.files[0] as File;
    this.selectedPartyId = partyId;
  }

  uploadSymbolForParty(partyId: number): void {
    if (!this.selectedFile || !partyId) {
      alert('Please select a file and party');
      return;
    }

    this.isLoading = true;
    this.apiService.uploadPartySymbol(partyId, this.selectedFile).subscribe({
      next: (response) => {
        alert('Image uploaded successfully!');
        this.partiesChanged.emit(); // Refresh parties in parent
        this.selectedFile = null;
        this.selectedPartyId = null;
        this.isLoading = false;
        window.location.reload();
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        alert(error.error?.message || 'Error uploading image.');
        this.isLoading = false;
      }
    });
  }
}