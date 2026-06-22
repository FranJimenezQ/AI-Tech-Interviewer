import { Component, inject } from '@angular/core';
import { AnalysisService } from '../../core/services/analysis.service';
import { SuggestedChange} from '../../core/models/analysis.models';

@Component({
  selector: 'app-analysis',
  imports: [],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.scss'
})
export class AnalysisComponent {

  readonly analysisService = inject(AnalysisService);

  get result() {
    return this.analysisService.result();
  }

  onStartOver() {
    this.analysisService.reset();
  }

  trackByChangeId(index: number, change: SuggestedChange): number {
    return change.id;
  }
}
