import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {OndCsvBuilderService} from "../../../outsiderninjadevs/core";
import {JsonPipe} from "@angular/common";

interface IUser {
  id: string;
  name: string;
  age?: number;
  isDev?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  users: IUser[] = [
    {
      id: "a1",
      name: "John Doe",
      age: 25
    },
    {
      id: "a2",
      name: "Jane Doe",
      isDev: true
    }
  ]

  constructor(private readonly csv: OndCsvBuilderService) {
  }

  saveCSV = async () => {
    try {
      const res: string = await this.csv.toCSVAsync(this.users, ";");
      await this.csv.downloadCSVAsync(res, "myusers.csv");
    } catch (e) {
      console.error(e);
    }
  }
}
