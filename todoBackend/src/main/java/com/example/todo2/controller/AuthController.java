package com.example.todo2.controller;

import com.example.todo2.dto.AuthenticationResponse;
import com.example.todo2.dto.LoginRequest;
import com.example.todo2.dto.RegisterRequest;
import com.example.todo2.dto.ResponseToken;
import com.example.todo2.model.User;
import com.example.todo2.model.VerificationToken;
import com.example.todo2.repository.VerificationTokenRepository;
import com.example.todo2.service.AuthService;
import com.example.todo2.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final VerificationTokenRepository tokenRepository;
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody RegisterRequest registerRequest) {
        User user1 = userService.findByEmail(registerRequest.getEmail());
        User user2 = userService.findByUsername(registerRequest.getUsername());
        if (user1!=null){
            return ResponseEntity.status(OK).body("email");
        }
        if (user2!=null){
            return ResponseEntity.status(OK).body("username");
        }
        authService.signup(registerRequest);
        return new ResponseEntity<>("Đăng ký thành công",OK);
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @GetMapping("/accountVerification/{token}")
    public ResponseEntity<String> verifyAccount(@PathVariable String token) {
        authService.verifyAccount(token);
        return new ResponseEntity<>("Xác nhận thành công!", OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout( @RequestBody ResponseToken responseToken){
        Optional<VerificationToken> token = tokenRepository.findByToken(responseToken.getToken());
        Long id = token.get().getId();
        tokenRepository.deleteById(id);
        return new ResponseEntity<>(OK);
    }
}
