package com.csms.controller;

import com.csms.entity.Car;
import com.csms.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CarController {

    @Autowired
    private CarService carService;

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> addCar(@RequestBody Car car, @RequestParam Long userId) {
        try {
            Car newCar = carService.addCar(car, userId);
            Map<String, Object> response = com.csms.util.Dto.map(
                "message", "Car added successfully",
                "car", com.csms.util.Dto.map(
                    "id", newCar.getId(),
                    "carModel", newCar.getCarModel(),
                    "carBrand", newCar.getCarBrand(),
                    "carNumber", newCar.getCarNumber(),
                    "userId", newCar.getUser().getId()
                )
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(com.csms.util.Dto.map("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<List<Map<String, Object>>> getCarsByUserId(@PathVariable Long userId) {
        List<Car> cars = carService.findByUserId(userId);
        List<Map<String, Object>> carDTOs = cars.stream()
            .map(car -> com.csms.util.Dto.map(
                "id", car.getId(),
                "carModel", car.getCarModel(),
                "carBrand", car.getCarBrand(),
                "carNumber", car.getCarNumber(),
                "userId", car.getUser().getId()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(carDTOs);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getCarById(@PathVariable Long id) {
        Car car = carService.findById(id);
        Map<String, Object> carDTO = com.csms.util.Dto.map(
            "id", car.getId(),
            "carModel", car.getCarModel(),
            "carBrand", car.getCarBrand(),
            "carNumber", car.getCarNumber(),
            "userId", car.getUser().getId()
        );
        return ResponseEntity.ok(carDTO);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllCars() {
        List<Car> cars = carService.findAllCars();
        List<Map<String, Object>> carDTOs = cars.stream()
            .map(car -> com.csms.util.Dto.map(
                "id", car.getId(),
                "carModel", car.getCarModel(),
                "carBrand", car.getCarBrand(),
                "carNumber", car.getCarNumber(),
                "userId", car.getUser().getId(),
                "userName", car.getUser().getName()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(carDTOs);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> updateCar(@PathVariable Long id, @RequestBody Car carDetails) {
        try {
            Car updatedCar = carService.updateCar(id, carDetails);
            Map<String, Object> response = com.csms.util.Dto.map(
                "message", "Car updated successfully",
                "car", com.csms.util.Dto.map(
                    "id", updatedCar.getId(),
                    "carModel", updatedCar.getCarModel(),
                    "carBrand", updatedCar.getCarBrand(),
                    "carNumber", updatedCar.getCarNumber(),
                    "userId", updatedCar.getUser().getId()
                )
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(com.csms.util.Dto.map("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> deleteCar(@PathVariable Long id) {
        try {
            carService.deleteCar(id);
            return ResponseEntity.ok(com.csms.util.Dto.map("message", "Car deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(com.csms.util.Dto.map("error", e.getMessage()));
        }
    }
}
