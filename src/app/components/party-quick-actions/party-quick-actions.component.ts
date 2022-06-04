import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UserStory } from 'src/app/models/user-story';

@Component({
	selector: 'app-party-quick-actions',
	templateUrl: './party-quick-actions.component.html',
	styleUrls: ['../party-admin-view/party-admin-view.component.css']
})
export class QuickActionsComponent implements OnInit {

	@Input() selectedUS: UserStory = new UserStory();
	@Output() updatingUserStory = new EventEmitter<any>();

	constructor() { }
		
	ngOnInit(): void {	
	}

	updateUS() {
		if(this.selectedUS){
			this.updatingUserStory.emit();
		}
	}
	
}
