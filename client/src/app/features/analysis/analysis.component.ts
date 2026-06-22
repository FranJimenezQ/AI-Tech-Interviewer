import { Component, inject } from '@angular/core';
import { AnalysisService } from '../../core/services/analysis.service';
import { SuggestedChange} from '../../core/models/analysis.models';
import { Router } from '@angular/router';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-analysis',
  imports: [SkeletonComponent],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.scss'
})
export class AnalysisComponent {

  readonly analysisService = inject(AnalysisService);
  readonly router = inject(Router);
  get result() {
    return this.analysisService.result();
  }

  onStartOver() {
    this.analysisService.reset();
    this.router.navigate(['/']);
  }

  trackByChangeId(index: number, change: SuggestedChange): number {
    return change.id;
  }
}
