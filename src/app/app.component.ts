import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TeardownComponent } from './teardown/teardown.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TeardownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  title = 'angular17_teardown_logic';
}
