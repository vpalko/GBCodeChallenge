import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../shared/constants';
import { User } from './services/user.model';
import * as moment from 'moment';
import * as lodash from 'lodash';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  users: User[] = [];

  @ViewChild('f') gbForm: NgForm;
  userForm: FormGroup;
  phoneMask = this.constants.PHONE_MASK;
  dateMask = this.constants.DATE_MASK;
  formState = 0; //0 - initial (Find User), 1 - veiw user, 2 - edit user, 3 - new user
  msgBoxType = 0; // 0 - no message; 1 - success; 2 - info; 3 - warning; 4 - error
  msgBoxMessage = '';
  userIsValid: boolean = true;

  userid: number;
  firstname: string;
  lastname: string;
  address: string;
  phone: number;
  dateOfBirth: string;
  age: number;
  height: number;
  educationlevel;
  degreeobtained: string;

  educationlevels = [{ level: '', degree: false },
  { level: 'Less than high school', degree: false },
  { level: 'High school diploma or equivalent', degree: false },
  { level: 'Some college, no degree', degree: false },
  { level: 'Postsecondary non-degree award', degree: false },
  { level: 'Associate\'s degree', degree: true },
  { level: 'Bachelor\'s degree', degree: true },
  { level: 'Master\'s degree', degree: true },
  { level: 'Doctoral or professional degree', degree: true }
  ];

  constructor(
    private constants: Constants,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {

    this.buildFormComponents();

    this.userForm.get('educationLevelControl').valueChanges.subscribe(value => {
      this.resetDegree(value)
    });

    this.userForm.get('userIDControl').valueChanges.subscribe(value => {
      this.userIdIsValid(value)
    });
  }

  countryForm: FormGroup;

  buildFormComponents() {
    this.userForm = this.formBuilder.group({
      userIDControl: ['',
        [
          Validators.pattern(this.constants.NUMBER_PATTERN)
        ]],
      firstNameControl: [{ value: '', disabled: true },
      [
        Validators.required,
        Validators.pattern(this.constants.NAME_PATTERN),
        Validators.maxLength(this.constants.FIRST_NAME_MAX_LENGTH)
      ]],
      lastNameControl: [{ value: '', disabled: true },
      [
        Validators.required,
        Validators.pattern(this.constants.NAME_PATTERN),
        Validators.maxLength(this.constants.LAST_NAME_MAX_LENGTH)
      ]],
      phoneControl: [{ value: '', disabled: true },
      [
        Validators.required,
        Validators.pattern(this.constants.PHONE_FORMAT_PATTERN),
        Validators.minLength(this.constants.PHONE_MIN_LENGTH)
      ]],
      addressControl: [{ value: '', disabled: true },
      [
        Validators.required
      ]],
      dateOfBirthControl: [{ value: '', disabled: true },
      [
        Validators.required,
        Validators.minLength(10),
        this.dateValidator
      ]],
      ageControl: [{ value: '', disabled: true },
      [
        Validators.pattern(this.constants.NUMBER_PATTERN)
      ]],
      heightControl: [{ value: '', disabled: true },
      [
        Validators.pattern(this.constants.NUMBER_PATTERN)
      ]],
      educationLevelControl: [{ value: '', disabled: true }],
      degreeObtainedControl: [{ value: '', disabled: true },]
    });
  }

  dateValidator(control: FormControl) {
    let valueToCheck = control.value;

    var d = moment(valueToCheck, 'M/D/YYYY');
    if (d == null || !d.isValid()) {
      return { 'invalid': true };
    } else {
      return (valueToCheck.indexOf(d.format('M/D/YYYY')) >= 0
        || valueToCheck.indexOf(d.format('MM/DD/YYYY')) >= 0
        || valueToCheck.indexOf(d.format('M/D/YY')) >= 0
        || valueToCheck.indexOf(d.format('MM/DD/YY')) >= 0) ? null : { 'invalid': true };
    }
  }

  onClear() {
    this.gbForm.reset();
    this.formState = 0;
    this.enableFormControls();
  }

  resetDegree(value) {
    if (!value || value === '') {
      this.userForm.controls['degreeObtainedControl'].reset();
      this.userForm.controls['degreeObtainedControl'].disable();
    } else {
      var index = -1;
      var index = this.educationlevels.findIndex(function (item, i) {
        return item.level === value;
      });

      if (this.educationlevels[index].degree !== true) {
        this.userForm.controls['degreeObtainedControl'].reset();
        this.userForm.controls['degreeObtainedControl'].disable();
      } else {
        this.userForm.controls['degreeObtainedControl'].enable();
      }
    }
  }

  userIdIsValid(value) {
   // this.showMessageBox(0, '');
    this.userIsValid = !this.userForm.controls['userIDControl'].hasError('pattern') && value !== null && value !== undefined && value.toString().trim() !== ''
  }

  enableFormControls() {
    if (this.formState === 0){
      this.userForm.controls['userIDControl'].enable();
    } else {
      this.userForm.controls['userIDControl'].disable();
    }

    if (this.formState === 0 || this.formState === 1) {//initial state or user found
      this.userForm.controls['firstNameControl'].disable();
      this.userForm.controls['lastNameControl'].disable();
      this.userForm.controls['phoneControl'].disable();
      this.userForm.controls['addressControl'].disable();
      this.userForm.controls['dateOfBirthControl'].disable();
      this.userForm.controls['ageControl'].disable();
      this.userForm.controls['heightControl'].disable();
      this.userForm.controls['educationLevelControl'].disable();
      this.userForm.controls['degreeObtainedControl'].disable();

    } else if (this.formState === 2 || this.formState === 3) {//edit or new
      this.userForm.controls['firstNameControl'].enable();
      this.userForm.controls['lastNameControl'].enable();
      this.userForm.controls['phoneControl'].enable();
      this.userForm.controls['addressControl'].enable();
      this.userForm.controls['dateOfBirthControl'].enable();
      this.userForm.controls['ageControl'].enable();
      this.userForm.controls['heightControl'].enable();
      this.userForm.controls['educationLevelControl'].enable();
      this.userForm.controls['degreeObtainedControl'].enable();
    }
  }

  showMessageBox(msgType, msgMessage) {
    this.msgBoxMessage = msgMessage;
    this.msgBoxType = msgType;
  }

  newUser() {
    this.onClear();
    this.formState = 3;
    this.enableFormControls();
    this.resetDegree(this.educationlevel);
  }

  editUser() {
    this.formState = 2;
    this.enableFormControls();
    this.resetDegree(this.educationlevel);
  }

  loadUser(id){
    this.userid = this.users[id].userid;
    this.firstname = this.users[id].firstname;
    this.lastname = this.users[id].lastname;
    this.phone = this.users[id].phone;
    this.address = this.users[id].address;
    this.dateOfBirth = this.users[id].dateOfBirth;
    this.age = this.users[id].age;
    this.height = this.users[id].height;
    this.educationlevel = this.users[id].educationlevel;
    this.degreeobtained = this.users[id].degreeobtained;

    this.formState = 2;
    this.enableFormControls();
    this.resetDegree(this.educationlevel);
  }

  findUser() {
    //check if user present in reqres.in then either update users:User[] or add a new user if not exist in users:User[]

    this.httpClient.get(this.constants.REQRES_API_BASE_URL + this.constants.REQRES_API_USER_URL + '/' + this.userid).subscribe((res) => {
      //check if user present in users:User[] .. since reqres.in doesn't really save the data
      let userIdx = lodash.findIndex(this.users, {'userid': this.userid});

      if (Object.keys(res).length === 0) {
        if(userIdx!==-1){
          this.showMessageBox(0, '');
          this.formState = 1;
          this.userid = this.users[userIdx].userid;
          this.firstname = this.users[userIdx].firstname;
          this.lastname = this.users[userIdx].lastname;
          this.phone = this.users[userIdx].phone;
          this.address = this.users[userIdx].address;
          this.dateOfBirth = this.users[userIdx].dateOfBirth;
          this.age = this.users[userIdx].age;
          this.height = this.users[userIdx].height;
          this.educationlevel = this.users[userIdx].educationlevel;
          this.degreeobtained = this.users[userIdx].degreeobtained;
          this.enableFormControls();
        } else {
          this.gbForm.reset();
          this.showMessageBox(3, 'User not found.');
          this.formState = 0;
        }
      } else {
        this.showMessageBox(0, '');
        this.formState = 1;
        if(userIdx==-1){//add to users:User[]
          this.users.push(new User(
            res['data'].id, 
            res['data'].first_name, 
            res['data'].last_name,
            res['data'].tel ? res['data'].tel : '',
            res['data'].address ? res['data'].address : '',
            res['data'].dob ? res['data'].dob : '',
            res['data'].age ? res['data'].age : '',
            res['data'].height ? res['data'].height : '',
            res['data'].education ? res['data'].education : '',
            res['data'].degree ? res['data'].degree : ''
            ));

            this.userid = res['data'].id;
            this.firstname = res['data'].first_name;
            this.lastname = res['data'].last_name;
            this.phone = res['data'].tel ? res['data'].tel : '';
            this.address = res['data'].address ? res['data'].address : '';
            this.dateOfBirth = res['data'].dob ? res['data'].dob : '';
            this.age = res['data'].age ? res['data'].age : '';
            this.height = res['data'].height ? res['data'].height : '';
            this.educationlevel = res['data'].education ? res['data'].education : '';
            this.degreeobtained = res['data'].degree ? res['data'].degree : '';
        } else {
          this.userid = this.users[userIdx].userid;
          this.firstname = this.users[userIdx].firstname;
          this.lastname = this.users[userIdx].lastname;
          this.phone = this.users[userIdx].phone;
          this.address = this.users[userIdx].address;
          this.dateOfBirth = this.users[userIdx].dateOfBirth;
          this.age = this.users[userIdx].age;
          this.height = this.users[userIdx].height;
          this.educationlevel = this.users[userIdx].educationlevel;
          this.degreeobtained = this.users[userIdx].degreeobtained;
        }

        this.enableFormControls();
      }
    },
      (error) => {
        let userIdx = lodash.findIndex(this.users, {'userid': this.userid});
        if(userIdx!==-1){
          this.showMessageBox(0, '');
          this.formState = 1;
          this.userid = this.users[userIdx].userid;
          this.firstname = this.users[userIdx].firstname;
          this.lastname = this.users[userIdx].lastname;
          this.phone = this.users[userIdx].phone;
          this.address = this.users[userIdx].address;
          this.dateOfBirth = this.users[userIdx].dateOfBirth;
          this.age = this.users[userIdx].age;
          this.height = this.users[userIdx].height;
          this.educationlevel = this.users[userIdx].educationlevel;
          this.degreeobtained = this.users[userIdx].degreeobtained;
          this.enableFormControls();
        } else {
          this.gbForm.reset();
          this.showMessageBox(3, 'User not found.');
          this.formState = 0;
        }
      });
  }

  deleteUser() {
    this.httpClient.delete(this.constants.REQRES_API_BASE_URL + this.constants.REQRES_API_USER_URL + '/' + this.userid)
      .subscribe(
        (val) => {
          //remove from users:User[]
          let userIdx = lodash.findIndex(this.users, {'userid': this.userid});
          if(userIdx!=-1){
            this.users.splice(userIdx, 1);
          }

          this.onClear();
          this.showMessageBox(1, 'User deleted successfully');
        },
        response => {
          this.showMessageBox(4, 'Unable to deleted the user');
        },
        () => {

        });
  }

  saveUser(){
    if(this.formState===2){//edit user
      this.updateUser();
    } else if(this.formState===3){//new user
      this.createUser();
    }
  }

  createUser() {
    this.httpClient.post(this.constants.REQRES_API_BASE_URL + this.constants.REQRES_API_USER_URL,
      {
        "first_name": this.firstname,
        "last_name": this.lastname,
        "tel": this.phone,
        "address": this.address,
        "dob": this.dateOfBirth,
        "age": this.age,
        "height": this.height,
        "education": this.educationlevel,
        "degree": this.degreeobtained
      })
      .subscribe(
        res => {
          this.users.push(new User(
            res['id'], 
            res['first_name'], 
            res['last_name'],
            res['tel'],
            res['address'],
            res['dob'],
            res['age'],
            res['height'],
            res['education'],
            res['degree']
            ));

            this.userid = res['id'];
            this.firstname = res['first_name'];
            this.lastname = res['last_name'];
            this.phone = res['tel'];
            this.address = res['address'];
            this.dateOfBirth = res['dob'];
            this.age = res['age'];
            this.height = res['height'];
            this.educationlevel = res['education'];
            this.degreeobtained = res['degree'];

          this.formState = 1;
          this.enableFormControls();
          this.showMessageBox(1, 'User created successfully');
        },
        error => {
          this.showMessageBox(4, 'Unable to save new user');
        }
      );
  }

  updateUser() {
    this.httpClient.put(this.constants.REQRES_API_BASE_URL + this.constants.REQRES_API_USER_URL + '/' + this.userid,
      {
        "first_name": this.firstname,
        "last_name": this.lastname,
        "tel": this.phone,
        "address": this.address,
        "dob": this.dateOfBirth,
        "age": this.age,
        "height": this.height,
        "education": this.educationlevel,
        "degree": this.degreeobtained
      })
      .subscribe(
        data => {
          let userIdx = lodash.findIndex(this.users, {'userid': this.userid});
          if(userIdx!=-1){
            this.users[userIdx].firstname = this.firstname;
            this.users[userIdx].lastname = this.lastname;
            this.users[userIdx].phone = this.phone;
            this.users[userIdx].address = this.address;
            this.users[userIdx].dateOfBirth = this.dateOfBirth;
            this.users[userIdx].age = this.age;
            this.users[userIdx].height = this.height;
            this.users[userIdx].educationlevel = this.educationlevel;
            this.users[userIdx].degreeobtained = this.degreeobtained;
          }

          this.formState = 1;
          this.enableFormControls();
          this.showMessageBox(1, 'User updated successfully');
        },
        error => {
          this.showMessageBox(4, 'Unable to update user info');
        }
      );
  }
}
