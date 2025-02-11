import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ResultDTO } from '../../models/resultdto';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  formattedResults: string[] = [];
  results: ResultDTO[] = [];
  showTable: boolean = false;
  isLoading: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getFormattedResults();
  }

  getFormattedResults() {
    this.isLoading = true;
    this.apiService.getFormattedResults().subscribe(
      (response: string[]) => {
        this.formattedResults = response;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error("Error fetching formatted results:", error);
        alert(error.error?.message || "Error fetching formatted results");
      }
    );
  }

  getResults() {
    this.isLoading = true;
    this.apiService.getResults().subscribe(
      (response: ResultDTO[]) => {
        this.results = response;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error("Error fetching detailed results:", error);
        alert(error.error?.message || "Error fetching detailed results");
      }
    );
  }

  toggleResultsTable() {
    this.showTable = !this.showTable;
    if (this.showTable && this.results.length === 0) {
      this.getResults();
    }
  }
}