package com.csms.service;

import com.csms.entity.Car;
import com.csms.entity.User;
import com.csms.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserService userService;

    public Car addCar(Car car, Long userId) {
        User user = userService.findById(userId);
        
        if (carRepository.existsByCarNumber(car.getCarNumber())) {
            throw new RuntimeException("Car with this number already exists");
        }
        
        car.setUser(user);
        return carRepository.save(car);
    }

    public Car updateCar(Long id, Car carDetails) {
        Car car = findById(id);
        
        if (!car.getCarNumber().equals(carDetails.getCarNumber()) && 
            carRepository.existsByCarNumber(carDetails.getCarNumber())) {
            throw new RuntimeException("Car with this number already exists");
        }
        
        car.setCarModel(carDetails.getCarModel());
        car.setCarBrand(carDetails.getCarBrand());
        car.setCarNumber(carDetails.getCarNumber());
        
        return carRepository.save(car);
    }

    public void deleteCar(Long id) {
        Car car = findById(id);
        carRepository.delete(car);
    }

    public Car findById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
    }

    public List<Car> findByUserId(Long userId) {
        return carRepository.findByUserId(userId);
    }

    public List<Car> findAllCars() {
        return carRepository.findAll();
    }

    public Optional<Car> findByCarNumber(String carNumber) {
        return carRepository.findByCarNumber(carNumber);
    }
}
