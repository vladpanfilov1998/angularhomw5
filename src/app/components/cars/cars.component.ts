import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

import {regex} from "../../constants";
import {ICar} from "../../interfaces";
import {CarService} from "../../services/car.service";

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {
  cars: ICar[];
  formCar: FormGroup;
  carForUpdate: ICar | null;

  constructor(private carService: CarService) {
    this._createForm();
  }

  ngOnInit(): void {
    this.carService.getAll().subscribe(value => this.cars = value);
  }

  save(): void {
    if (!this.carForUpdate) {
      this.carService.create(this.formCar.getRawValue()).subscribe(value => {
        this.cars.push(value);
        this.formCar.reset()
      })
    } else {
      this.carService.updateById(this.carForUpdate.id, this.formCar.getRawValue()).subscribe(value => {
        const updateCar = this.cars.find(value => value.id = this.carForUpdate?.id as number);
        Object.assign(updateCar, value);
        this.carForUpdate = null;
      })
    }
  }

  delete(id: number): void {
    this.carService.deleteById(id).subscribe(() => {
      const index = this.cars.findIndex(value => value.id === id);
      this.cars.splice(index, 1);
    })
  }

  update(car: ICar): void {
    this.carForUpdate = car;
    this.formCar.setValue({model: car.model, price: car.price, year: car.year});
  }

  private _createForm() {
    this.formCar = new FormGroup({
      model: new FormControl(null, [
        Validators.required,
        Validators.pattern(regex.model),
        Validators.minLength(1),
        Validators.maxLength(20),
      ]),
      year: new FormControl(null, [
        Validators.required,
        Validators.min(1990),
        Validators.max(new Date().getFullYear()),
      ]),
      price: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(1000000),
      ])
    })
  }

}
