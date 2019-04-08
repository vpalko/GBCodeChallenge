import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MainComponent} from './components/main/main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { Constants } from './shared/constants';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MainComponent
      ],
      imports: [
        FormsModule, 
        ReactiveFormsModule,
        TextMaskModule
      ],
      providers: [
        Constants, 
        HttpClient, 
        HttpHandler]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'GB Coding Challenge to create/update/view a user record using the https://reqres.in API'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('GB Coding Challenge to create/update/view a user record using the https://reqres.in API');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('GB Coding Challenge to create/update/view a user record using the https://reqres.in API');
  });
});
