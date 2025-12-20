package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepo;

    public AuthController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    private static String hash(String input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(digest.length * 2);
        for (byte b : digest) sb.append(String.format("%02x", b));
        return sb.toString();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String,String> body) {
        try {
            String username = body.getOrDefault("username", "").trim();
            String password = body.get("password");
            if (username.isEmpty() || password == null || password.length() < 4) {
                return ResponseEntity.badRequest().body("username and password(min 4) required");
            }
            if (userRepo.findByUsername(username).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("username_taken");
            }
            User u = new User();
            u.setUsername(username);
            u.setPasswordHash(hash(password));
            u.setRole("USER");
            User saved = userRepo.save(u);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", saved.getId(), "username", saved.getUsername(), "role", saved.getRole()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.toString());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body) {
        try {
            String username = body.getOrDefault("username", "").trim();
            String password = body.get("password");
            if (username.isEmpty() || password == null) {
                return ResponseEntity.badRequest().body("username and password required");
            }
            var opt = userRepo.findByUsername(username);
            if (opt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("invalid_credentials");
            User u = opt.get();
            String h = hash(password);
            if (!h.equals(u.getPasswordHash())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("invalid_credentials");
            return ResponseEntity.ok(Map.of("id", u.getId(), "username", u.getUsername(), "role", u.getRole()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.toString());
        }
    }
}
