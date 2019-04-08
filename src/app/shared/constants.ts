import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
  NAME_PATTERN = '[A-Za-z\\\'\\-\\s]*';
  PHONE_PATTERN = '[0-9]*';
  PHONE_FORMAT_PATTERN = '\\([0-9]{3}\\)\\s*[0-9]{3}\\-[0-9]{4}';
  DATE_FORMAT_PATTERN = '/^(((0[13578]|1[02])/(0[1-9]|[12]\d|3[01])/((19|[2-9]\d)\d{2}))|((0[13456789]|1[012])/(0[1-9]|[12]\d|30)/((19|[2-9]\d)\d{2}))|(02/(0[1-9]|1\d|2[0-8])/((19|[2-9]\d)\d{2}))|(02/29/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g';
  NUMBER_PATTERN = '[0-9]*';
  EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  SSN_WITH_MASK_PATTERN = '([0-9]{9})|(\\*\\*\\*\\-\\*\\*\\-[0-9]{4})|([0-9]{3}\\-[0-9]{2}\\-[0-9]{4})';
  FIRST_NAME_MAX_LENGTH = 25;
  LAST_NAME_MAX_LENGTH = 40;
  FIRST_NAME_MIN_LENGTH = 2;
  LAST_NAME_MIN_LENGTH = 2;
  PHONE_MIN_LENGTH = 13; // (ddd) ddd-dddd

  PHONE_MASK = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  DATE_MASK = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  REQRES_API_BASE_URL = 'https://reqres.in';
  REQRES_API_USER_URL = '/api/users';
}
