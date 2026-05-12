package com.example.demo;

import java.io.ByteArrayOutputStream;
import java.util.Properties;

import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.commons.codec.binary.Base64;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;

@Service
public class MailService {

    private final OAuth2AuthorizedClientService clientService;

    public MailService(OAuth2AuthorizedClientService clientService) {
        this.clientService = clientService;
    }

    public void sendMail(String text) {

        try {
            System.out.println("送信内容: " + text);

            // ★① 安全に取得（キャスト前提にしない）
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // ★② OAuthじゃなければ即終了（防御）
            if (!(authentication instanceof OAuth2AuthenticationToken auth)) {
                System.out.println("未ログインアクセス（拒否）");
                return;
            }

            // ★③ トークン取得
            OAuth2AuthorizedClient client = clientService.loadAuthorizedClient(
                    auth.getAuthorizedClientRegistrationId(),
                    auth.getName());

            String accessToken = client.getAccessToken().getTokenValue();

            // ★④ Gmail API
            Gmail service = new Gmail.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    request -> request.getHeaders().setAuthorization("Bearer " + accessToken))
                    .setApplicationName("mail-app")
                    .build();

            // ★⑤ メール作成
            MimeMessage email = new MimeMessage(Session.getDefaultInstance(new Properties()));

            email.setFrom(new InternetAddress("me"));
            email.addRecipient(
                    javax.mail.Message.RecipientType.TO,
                    new InternetAddress("k.arai@dcworks.jp"));

            email.setSubject("日報テスト");
            email.setText(text);

            // ★⑥ エンコード
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            email.writeTo(buffer);

            String encodedEmail = Base64.encodeBase64URLSafeString(buffer.toByteArray());

            Message message = new Message();
            message.setRaw(encodedEmail);

            // ★⑦ 送信
            service.users().messages().send("me", message).execute();

            System.out.println("メール送信成功");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}