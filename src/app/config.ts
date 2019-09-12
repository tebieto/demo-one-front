import { environment } from 'src/environments/environment';

environment
export class Config {
     static currentYear = 2019;
     static appName = "IDEAHUB";
     static api = environment.apiUrl;
     static pusher = environment.pusher;
     static ipChecker = 'http://ip-api.com/json/';
     static bearer = 'atala,'
     static isPublic = false;
}
