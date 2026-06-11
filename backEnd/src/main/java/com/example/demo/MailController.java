package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mail")
@CrossOrigin(origins = "http://localhost:5174")
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