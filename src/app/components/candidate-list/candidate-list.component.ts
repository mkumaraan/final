import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Candidate } from '../../models/candidate.model';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit {
  @Input() candidates: Candidate[] = [];
  @Output() candidateSelected = new EventEmitter<Candidate>();

  constructor() {}

  ngOnInit(): void {}

  onCandidateSelect(candidate: Candidate) {
    this.candidateSelected.emit(candidate);
  }
}