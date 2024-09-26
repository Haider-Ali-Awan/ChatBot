import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ChatbotService } from 'src/app/services/gemini.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
})
export class ChatbotComponent {

  chatbotForm: FormGroup;
  chatHistory: { message: string; sender: string }[] = [];   //An empty array of chat message objects.

  // our formBuider
  constructor(private fb: FormBuilder, private chatbotService: ChatbotService) {
    this.chatbotForm = this.fb.group({
      userMessage: ['', Validators.required],
    });
  }


  ngOnInit() {

    // We are calling the getChatHistory() function and storing updated data in chatHistory.
    this.chatHistory = this.getChatHistory();
  }

  // sendMessage function
  sendMessage() {
    if (this.chatbotForm.valid) { // check if the chatbotForm is null or undefined 
      const userInput = this.chatbotForm.get('userMessage')?.value;   //Assign the value of the userMessage property of the chatbotForm to the userInput variable.
      this.chatHistory.push({ sender: 'user', message: userInput }); // add sender: 'user', message: userInput in to chatHistory empty array   
      this.saveChatHistory(userInput, 'user'); // Save user message

      this.chatbotService.getGeminiResponse(userInput).subscribe(response => { //calling api
        const chatbotMessage = response.candidates[0].content.parts[0].text;  // storing response in a local variable called chatbotMessage
        this.chatHistory.push({ message: chatbotMessage, sender: 'chatbot' });  // Just like we added userInput and sender to chatHistory, 
        //we're now adding a new object with sender set to 'chatBot' and message set to chatbotMessage.
        this.saveChatHistory(chatbotMessage, 'chatbot'); // Save chatbot message
      });

      this.chatbotForm.reset(); //reset form
    }
  }



  saveChatHistory(message: string, sender: string) {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]'); //We're retrieving the chat history from local storage.
    chatHistory.push({ message, sender }); //We are adding two pieces of information to the chat history: the message and the sender. 
    //These pieces of information (message and sender) are stored as strings within an object.
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory)); //now set this variable in to local storage 
  }


  //We're retrieving the chat history from local storage. in ngOninIt The getChatHistory() function updates the chatHistory array with the latest data,
  // ensuring that the entire conversation is displayed on the screen even after reloading the page.
  getChatHistory() {
    return JSON.parse(localStorage.getItem('chatHistory') || '[]'); //get chatHistory variable data
  }

}
