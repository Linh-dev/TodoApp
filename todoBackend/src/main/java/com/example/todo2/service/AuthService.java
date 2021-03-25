package com.example.todo2.service;

import com.example.todo2.dto.AuthenticationResponse;
import com.example.todo2.dto.LoginRequest;
import com.example.todo2.dto.RegisterRequest;
import com.example.todo2.exception.SpringTodoException;
import com.example.todo2.model.NotificationEmail;
import com.example.todo2.model.User;
import com.example.todo2.model.VerificationToken;
import com.example.todo2.repository.UserRepository;
import com.example.todo2.repository.VerificationTokenRepository;
import com.example.todo2.security.JwtProvider;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

import static com.example.todo2.util.Constants.ACTIVATION_EMAIL;

@Service
@AllArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final MailContentBuilder mailContentBuilder;
    private final MailService mailService;
    private final VerificationTokenRepository verificationTokenRepository;

    @Transactional
    public void signup(RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(encodePassword(registerRequest.getPassword()));
        user.setEnabled(false);

        userRepository.save(user);

        String token = generateVerificationToken(user);
        String message = mailContentBuilder.build("Thank you for signing up to Spring Todo, please click on the below url to activate your account : "
                + ACTIVATION_EMAIL + "/" + token);

        mailService.sendMail(new NotificationEmail("Please Activate your account", user.getEmail(), message));
    }

    private String generateVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationTokenRepository.save(verificationToken);
        return token;
    }

    public AuthenticationResponse login(LoginRequest loginRequest) {

        Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authenticate);
        String authenticationToken = jwtProvider.generateToken(authenticate);
        Optional<User> user = userRepository.findByUsername(loginRequest.getUsername());
        Long id = user.get().getId();
        VerificationToken token = new VerificationToken(authenticationToken, user.get());
        if (checkToken(authenticationToken)!=null){
            return new AuthenticationResponse(authenticationToken, loginRequest.getUsername(),id,"ok");
        }else {
            verificationTokenRepository.save(token);
            return new AuthenticationResponse(authenticationToken, loginRequest.getUsername(),id,"ok");
        }
    }

    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    public void verifyAccount(String token) {
        Optional<VerificationToken> verificationTokenOptional = verificationTokenRepository.findByToken(token);
        verificationTokenOptional.orElseThrow(() -> new SpringTodoException("Invalid Token"));
        fetchUserAndEnable(verificationTokenOptional.get());
    }

    @Transactional
    void fetchUserAndEnable(VerificationToken verificationToken) {
        String username = verificationToken.getUser().getUsername();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new SpringTodoException("User Not Found with id - " + username));
        user.setEnabled(true);
        userRepository.save(user);
    }

    private VerificationToken checkToken(String token){
        try {
            return verificationTokenRepository.findByToken(token).get();
        }catch (Exception e){
            return null;
        }
    }
}
