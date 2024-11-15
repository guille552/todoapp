import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/services.service';
import { NgIf } from '@angular/common';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  weatherData: any;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.getWeather(position);
    });
  }

  async getWeather(position: GeolocationPosition) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    try {
      this.weatherData = await firstValueFrom(this.weatherService.getWeather(lat, lon));
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }
}

