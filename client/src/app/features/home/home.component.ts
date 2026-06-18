import { Component, inject, signal, computed } from '@angular/core';
import { AnalysisService } from '../../core/services/analysis.service';
import { AnalysisComponent } from '../analysis/analysis.component';
import { SeniorityLevel } from '../../core/models/analysis.models';

//import from pdfjslib
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

@Component({
  selector: 'app-home',
  imports: [AnalysisComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly analysisService = inject(AnalysisService);

  //Local state for form with signals
  readonly selectedFile = signal<File | null>(null);
  readonly cvText = signal<string>('')
  readonly selectedLevel = signal<SeniorityLevel>('Mid');
  readonly jobDescription = signal<string>('');
  readonly isDragOver = signal<boolean>(false);
  readonly isExtractingPdf = signal<boolean>(false);

  //Available levels
  readonly levels: SeniorityLevel[] = ['Junior', 'Mid', 'Senior', 'Lead', 'Executive'];

  //Analyze button disabled state
  readonly canAnalyze = computed(() => {
    return this.cvText().trim().length > 0 && 
      this.jobDescription().trim().length > 0 && 
      !this.analysisService.isLoading() && 
      !this.isExtractingPdf();
  })

  // PDF file handling
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file && file.type === 'application/pdf') {
      this.handleFile(file);
    } else {
      alert('Please drop a valid PDF file.');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.handleFile(file);
    } else {
      alert('Please select a valid PDF file.');
    }
  }

  private async handleFile(file: File): Promise<void> {
    if (file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }
    this.selectedFile.set(file);
    await this.extractTextFromPdf(file);
  }
  
  private async extractTextFromPdf(file: File): Promise<void> {
    this.isExtractingPdf.set(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.
          map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      this.cvText.set(fullText);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      alert('Failed to extract text from the PDF. Please try again with a different file.');
    } finally {
      this.isExtractingPdf.set(false);
    }

  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.cvText.set('');
  }

  //Level handler
  selectLevel(level: SeniorityLevel): void {
    this.selectedLevel.set(level);
  }

  //Job description handler
  onJobDescriptionChange(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.jobDescription.set(input.value);
  }

  //Submit analysis
  onAnalyze(): void {
    if(!this.canAnalyze()) {
      alert('Please fill in all required fields and ensure no analysis is currently running.');
      return;
    }
    this.analysisService.analyze(
      this.cvText(),
      this.selectedLevel(),
      this.jobDescription()
    );
  }
}
