import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  groupId: string;
  mostRecentCake: string;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.groupId = this.route.snapshot.params['groupId'];

    // TODO: replace condition with dynamic check involving backend somehow
    if (this.groupId === 'error') {
      this.router.navigate(['/404']);
    }

    // TODO: replace with actual logic fetching data from backend
    this.mostRecentCake = 'Jannik';


    // Scroll to top when navigating to overview
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

}
