import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
 private apiKey = 'Your-Api-Key'; // Replace with your actual API key
private apiUrl = 'Your-Api-Url'; // Replace with your actual API Url

constructor(private http: HttpClient) {}

getGeminiResponse(message: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.apiKey}`, {   // simply call the api with post method
    contents: [{ parts: [{ text: message }] }]
  });
}
}
