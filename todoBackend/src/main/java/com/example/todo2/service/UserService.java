package com.example.todo2.service;

import com.example.todo2.model.User;
import com.example.todo2.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User findByUsername(String username){
        try {
            return userRepository.findByUsername(username).get();
        }catch (Exception e){
            return null;
        }
    }

    public User findByEmail(String email){
        try {
            return userRepository.findByEmail(email).get();
        }catch (Exception e){
            return null;
        }
    }
}
