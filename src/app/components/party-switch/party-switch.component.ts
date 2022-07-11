import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { ViewService } from 'src/app/services/view.service';

@Component({
    selector: 'app-party-switch',
    templateUrl: './party-switch.component.html',
    styleUrls: ['./party-switch.component.css']
})
export class PartySwitchComponent implements OnInit, OnDestroy {

    isOwner: boolean;
    partyParamID: string;

    constructor(private activatedRoute: ActivatedRoute,
                private viewService: ViewService,
                private toast: NotificationService,
                private socketService: SocketWebService,
                private router: Router) {
                    
        this.viewService.setShowNarBar(true, false);
    }

    ngOnInit(): void {
        this.partyParamID = this.activatedRoute.snapshot.paramMap.get('id');
        this.socketService.isUserPartyOwner();

        this.socketService._userPartyOwner.subscribe({
            next: (response) => {
                this.isOwner = response;
            }
        })
       
        this.listenServerEvents();
    }

    ngOnDestroy(): void {
        this.socketService.leaveParty(this.partyParamID, false);
    }

    listenServerEvents(){
        let actualUserID = sessionStorage.getItem('user-id');

        this.socketService._playerJoin.subscribe({
            next: (user) => {
                console.log('_playerJoin', user);
                if(user.id == actualUserID){
                    this.toast.successToast({
                        title: "You are in!",
                        description: `Welcome to the party.`
                    })
                }
                else{
                    this.toast.successToast({
                        title: "Player Joined",
                        description: `${user.name} has just arrived to the party.`
                    })
                } 
            }
        })

        this.socketService._playerLeave.subscribe({
            next: (response) => {
                console.log('_playerLeave', response);
                
                this.toast.infoToast({
                    title: "Player Leave",
                    description: `${response.user.name} has leave the party.`
                })
            }
        })

        this.socketService._adminLeave.subscribe({
            next: (response) => {
                console.log('ADMIN LEAVE', response);       

                this.router.navigateByUrl('/dashboard')

                this.toast.infoToast({
                    title: 'Admin left the party',
                    description: 'You just got redirected to dashboard'
                })

                this.socketService.leaveParty(this.partyParamID, true);
            }
        })
    }
}
