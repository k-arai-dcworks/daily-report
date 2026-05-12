package com.example.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/mail")
@CrossOrigin(origins = "*")
public class MailController {

    @Autowired
    private MailService mailService;

    // ログイン確認
    @GetMapping("/me")
    public Object me(@AuthenticationPrincipal OAuth2User user) {

        // ログインしてない場合
        if (user == null) {
            return "NOT_LOGIN";
        }

        // ログインしてる場合
        return user.getAttributes();
    }

    @PostMapping("/send")
    public String send(@RequestBody MailRequest req) {
        System.out.println("受信: " + req.getText());
        mailService.sendMail(req.getText());
        return "OK";
    }
}