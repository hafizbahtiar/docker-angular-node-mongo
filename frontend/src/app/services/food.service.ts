import { Injectable } from '@angular/core';
import { Food } from '../models/Food';
import { sample_foods } from '../../data';

@Injectable({
  providedIn: 'root'
}) 
export class FoodService {

  constructor() { }

  getAllFoods(): Food[] {
    return sample_foods;
  }
}
