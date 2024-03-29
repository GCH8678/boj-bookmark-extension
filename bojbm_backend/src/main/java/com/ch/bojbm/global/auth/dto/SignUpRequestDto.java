package com.ch.bojbm.global.auth.dto;

import com.ch.bojbm.domain.user.Users;
import com.ch.bojbm.global.auth.entity.Role;
import lombok.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

@Getter
@NoArgsConstructor(access= AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SignUpRequestDto {
    private String authCode;
    private String email;
    private String password;


    public Users toUsersEntity(PasswordEncoder passwordEncoder){
        return Users.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.USER)
                .build();
    }

    public UsernamePasswordAuthenticationToken toAuthentication() {
        return new UsernamePasswordAuthenticationToken(email, password);
    }
}
