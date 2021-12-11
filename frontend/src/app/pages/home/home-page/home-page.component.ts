import { Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { GroupService as GroupService } from 'src/app/core/services/group.service';
import { Group } from 'src/app/models/group.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  groups: Group[] = [];
  displayGroups: Group[] = [];

  modelChanged = new Subject<string>();

  constructor(private groupService: GroupService) {
    this.modelChanged
      .pipe(
        debounceTime(300)
      )
      .subscribe( (searchQuery: string) => {
        this.groupService.listGroups(searchQuery)
          .subscribe((groups: Group[]) => {
            this.displayGroups = groups;
            this.groups = this.displayGroups;
          })
      })
  }

  ngOnInit(): void {
    this.groupService.listGroups().subscribe((groups: Group[]) => {
      this.displayGroups = groups;
      this.groups = this.displayGroups;
    })
  }

  search = (searchQuery: string) => {
    this.modelChanged.next(searchQuery);
  }
}
