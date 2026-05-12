package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // CSRF（セキュリティの仕組み）をオフ
                .csrf(csrf -> csrf.disable())

                // CORS（さまざまなサイトから来ても利用可能にする）を有効化
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ログイン必須ページの設定
                .authorizeHttpRequests(auth -> auth
                        // ログイン不必要
                        .requestMatchers("/", "/error").permitAll()

                        // ログイン必須
                        .requestMatchers("/mail/**").authenticated()

                        // その他全てログイン必要
                        .anyRequest().authenticated())

                // ログイン機能
                .oauth2Login(oauth2 -> oauth2
                        // ログイン成功したらここに戻る
                        .defaultSuccessUrl("http://localhost:5173", true))
                
                // 未ログイン時に401を返すs
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                        }));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Reactのアドレス
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        // 使用可能操作
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // ヘッダー全て使用可能
        config.setAllowedHeaders(List.of("*"));

        // Cookieの許可
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // 全URLに適用
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}